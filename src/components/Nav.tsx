import Link from "next/link";
import { site } from "@/content/site";
import { NavLinks } from "./NavLinks";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/85 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6 sm:py-3"
      >
        <Link
          href="/#top"
          prefetch={false}
          className="inline-flex min-h-6 shrink-0 items-center whitespace-nowrap font-mono text-sm text-foreground hover:text-accent"
        >
          <span className="text-accent">~/</span>
          {site.name.toLowerCase().replace(/\s+/g, "-")}
        </Link>
        <NavLinks />
      </nav>
    </header>
  );
}
