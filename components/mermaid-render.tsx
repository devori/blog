'use client';

import { useEffect } from 'react';

function isDarkMode() {
  // Prefer explicit class-based dark mode if present.
  const html = document.documentElement;
  if (html.classList.contains('dark')) return true;
  // Fallback to system preference.
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}


type Props = {
  /** The element id that wraps the rendered markdown HTML. */
  rootId: string;
};

/**
 * Renders ```mermaid fenced code blocks into SVG diagrams on the client.
 *
 * This project currently renders markdown via remark-html (server),
 * so we transform <pre><code class="language-mermaid"> into <div class="mermaid">.
 */
export default function MermaidRender({ rootId }: Props) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const codeBlocks = Array.from(
      root.querySelectorAll('pre > code.language-mermaid')
    ) as HTMLElement[];

    if (codeBlocks.length === 0) return;

    let cancelled = false;

    // Replace each <pre><code class="language-mermaid">...</code></pre>
    // with <div class="mermaid">...</div>
    for (const code of codeBlocks) {
      const pre = code.parentElement;
      if (!pre) continue;

      // Avoid double-render on client navigations.
      if (pre.getAttribute('data-mermaid-done') === 'true') continue;
      pre.setAttribute('data-mermaid-done', 'true');

      const container = document.createElement('div');
      container.className = 'mermaid';
      const def = code.textContent ?? '';
      container.textContent = def;
      container.setAttribute('data-mermaid-def', def);

      pre.replaceWith(container);
    }

    // If the user toggles dark mode via class changes, re-render (best-effort).
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      if (cancelled) return;
      const blocks = root.querySelectorAll('.mermaid');
      if (!blocks.length) return;
      blocks.forEach((el) => {
        const def = el.getAttribute('data-mermaid-def');
        if (def) el.textContent = def;
      });
      // Mermaid will re-render when run() is called again below.
      // We intentionally don't debounce; class toggles are infrequent.
      void (async () => {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false,
            theme: isDarkMode() ? 'dark' : 'neutral',
            securityLevel: 'strict',
            fontFamily:
              '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif',
          });
          await mermaid.run({
            querySelector: `#${CSS.escape(rootId)} .mermaid`,
          });
        } catch {
          // ignore
        }
      })();
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    (async () => {
      try {
        // Dynamic import keeps mermaid out of the initial JS chunk.
        const mermaid = (await import('mermaid')).default;

        const dark = isDarkMode();

        // Use a stable config to match your blog's clean style.
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? 'dark' : 'neutral',
          securityLevel: 'strict',
          fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif',
        });

        if (cancelled) return;

        // Mermaid v10+ provides mermaid.run
        // It will find `.mermaid` blocks and replace them with SVG.
        await mermaid.run({
          querySelector: `#${CSS.escape(rootId)} .mermaid`,
        });
      } catch (err) {
        // Fallback: keep code blocks as-is if mermaid fails.
        // (We intentionally swallow errors to avoid breaking the post page.)
        console.warn('[mermaid] render failed', err);
      }
    })();

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [rootId]);

  return null;
}
