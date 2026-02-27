import Link from 'next/link';
import ThemeToggle from './theme-toggle';

export default function Nav({ backLink }: { backLink?: boolean }) {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50">
      <div className="max-w-[640px] mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-150"
        >
          Leo
        </Link>
        <div className="flex items-center gap-1">
          {backLink && (
            <Link
              href="/"
              className="text-sm text-muted hover:text-foreground transition-colors duration-150 mr-2"
            >
              글 목록
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
