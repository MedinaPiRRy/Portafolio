"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#projects", label: "projects" },
  { href: "/#experience", label: "experience" },
  { href: "/#skills", label: "skills" },
  { href: "/#education", label: "education" },
  { href: "/#contact", label: "contact" },
  { href: "/about", label: "about" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap items-center gap-x-4 font-mono text-xs sm:gap-x-5 sm:text-sm">
      {links.map((link) => {
        const active = link.href === pathname;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={`sweep block py-1 transition-colors [--sweep-bottom:0.15rem] [--sweep-h:2px] sm:py-2 sm:[--sweep-bottom:0.4rem] hover:text-accent ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
