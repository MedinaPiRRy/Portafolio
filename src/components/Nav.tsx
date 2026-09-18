import Link from "next/link";
import { site } from "@/content/site";

const links = [
  { href: "#projects", label: "projects" },
  { href: "#experience", label: "experience" },
  { href: "#skills", label: "skills" },
  { href: "#education", label: "education" },
  { href: "#contact", label: "contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/85 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link
          href="#top"
          className="font-mono text-sm text-foreground hover:text-accent"
        >
          <span className="text-accent">~/</span>
          {site.name.toLowerCase().replace(/\s+/g, "-")}
        </Link>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs sm:gap-x-5 sm:text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
