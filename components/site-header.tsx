import { navItems } from "@/lib/content";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-line/55 bg-background/88 backdrop-blur-md"
      data-motion="site-header"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a
          aria-label="0xThomas home"
          className="font-semibold tracking-normal text-text"
          href="#home"
        >
          0xThomas
        </a>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-9 md:flex"
        >
          {navItems.map((item) => (
            <a
              className={`relative py-2 text-sm text-text-soft transition duration-200 hover:text-text ${
                item.label === "Home"
                  ? "after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-accent"
                  : ""
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="hidden size-7 items-center justify-center rounded-full border border-line/70 bg-text text-[11px] font-medium text-background transition duration-200 hover:bg-accent hover:text-text sm:inline-flex"
          href="#contact"
          aria-label="Connect"
        >
          +
        </a>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="mx-auto flex max-w-7xl gap-5 overflow-x-auto border-t border-line/35 px-5 py-3 md:hidden"
      >
        {navItems.map((item) => (
          <a
            className="shrink-0 text-sm text-text-soft transition duration-200 hover:text-text"
            href={item.href}
            key={item.label}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
