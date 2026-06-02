export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-medium text-text">0xThomas</p>
          <p className="mt-1">Building systems for AI, finance, and focus.</p>
        </div>
        <p className="font-mono text-[11px]">&copy; {year} 0xThomas.dev</p>
      </div>
    </footer>
  );
}
