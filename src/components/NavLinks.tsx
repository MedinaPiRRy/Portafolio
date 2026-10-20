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
              className={`block py-2 transition-colors hover:text-accent ${
                active
                  ? "text-accent underline decoration-2 underline-offset-8"
                  : "text-muted"
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
