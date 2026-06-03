"use client";

import { navItems } from "@/lib/content";
import { useEffect, useMemo, useState } from "react";

type NavHref = (typeof navItems)[number]["href"];

function getHashFromWindow(): NavHref {
  const currentHash = window.location.hash as NavHref;

  return navItems.some((item) => item.href === currentHash)
    ? currentHash
    : "#home";
}

export function SiteHeader() {
  const sectionIds = useMemo(
    () => navItems.map((item) => item.href.slice(1)),
    [],
  );
  const [activeHref, setActiveHref] = useState<NavHref>("#home");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      const activationPoint = window.scrollY + window.innerHeight * 0.58;
      const currentSection = sections.reduce<HTMLElement>((current, section) => {
        return section.offsetTop <= activationPoint ? section : current;
      }, sections[0]);

      setActiveHref(`#${currentSection.id}` as NavHref);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    setActiveHref(getHashFromWindow());
    scheduleUpdate();
    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("hashchange", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, [sectionIds]);

  const handleNavClick = (href: NavHref) => {
    setActiveHref(href);
  };

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
          onClick={() => handleNavClick("#home")}
        >
          0xThomas
        </a>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-9 md:flex"
        >
          {navItems.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <a
                aria-current={isActive ? "page" : undefined}
                className={`relative py-2 text-sm transition duration-200 hover:text-text ${
                  isActive
                    ? "text-text after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-accent"
                    : "text-text-soft"
                }`}
                href={item.href}
                key={item.label}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <a
          className="hidden size-7 items-center justify-center rounded-full border border-line/70 bg-text text-[11px] font-medium text-background transition duration-200 hover:bg-accent hover:text-text sm:inline-flex"
          href="#contact"
          aria-label="Connect"
          onClick={() => handleNavClick("#contact")}
        >
          +
        </a>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="mx-auto flex max-w-7xl gap-5 overflow-x-auto border-t border-line/35 px-5 py-3 md:hidden"
      >
        {navItems.map((item) => {
          const isActive = activeHref === item.href;

          return (
            <a
              aria-current={isActive ? "page" : undefined}
              className={`relative shrink-0 py-1 text-sm transition duration-200 hover:text-text ${
                isActive
                  ? "text-text after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-accent"
                  : "text-text-soft"
              }`}
              href={item.href}
              key={item.label}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
