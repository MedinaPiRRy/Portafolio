import Link from "next/link";
import { site } from "@/content/site";
import { NavLinks } from "./NavLinks";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/85 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link
          href="/#top"
          prefetch={false}
          className="font-mono text-sm text-foreground hover:text-accent"
        >
          <span className="text-accent">~/</span>
          {site.name.toLowerCase().replace(/\s+/g, "-")}
        </Link>
        <NavLinks />
      </nav>
    </header>
  );
}
