"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/#projects", label: "projects" },
  { href: "/#experience", label: "experience" },
  { href: "/#skills", label: "skills" },
  { href: "/#education", label: "education" },
  { href: "/#contact", label: "contact" },
  { href: "/about", label: "about" },
];

const sectionIds = links
  .filter((l) => l.href.startsWith("/#"))
  .map((l) => l.href.slice(2));

export function NavLinks() {
  const pathname = usePathname();
  const [section, setSection] = useState<string | null>(null);

  // On the home page, mark the section that crosses the middle of the viewport.
  useEffect(() => {
    if (pathname !== "/") return;
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSection(entry.target.id);
          else setSection((cur) => (cur === entry.target.id ? null : cur));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      setSection(null);
    };
  }, [pathname]);

  return (
    <ul className="flex flex-wrap items-center gap-x-4 font-mono text-xs sm:gap-x-5 sm:text-sm">
      {links.map((link) => {
        const onPage = link.href === pathname;
        const inView = pathname === "/" && link.href === `/#${section}`;
        const active = onPage || inView;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              prefetch={false}
              aria-current={onPage ? "page" : inView ? "location" : undefined}
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
