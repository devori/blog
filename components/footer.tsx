export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="max-w-[640px] mx-auto px-5 h-14 flex items-center justify-between text-xs text-muted">
        <span>&copy; {new Date().getFullYear()} Leo</span>
        <div className="flex items-center gap-4">
          <a
            href="/rss.xml"
            className="hover:text-foreground transition-colors duration-150"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
