"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const SELECTOR = "[data-reveal], [data-reveal-group]";

/**
 * One shared IntersectionObserver for every scroll reveal on the site.
 *
 * - Content is visible by default (server HTML, no JS, crawlers, reduced motion).
 * - On mount, only elements that start below the fold get the `pre` class that
 *   hides them. Anything already on screen is never hidden, so there is no
 *   flash and no effect on LCP.
 * - Each element is revealed once, then unobserved.
 * - Jumping to a hash (nav click, /#contact load) reveals whatever lands in the
 *   viewport instantly, so you never arrive at hidden or half-animated content.
 * - A single passive scroll listener drives the `--p` progress of timelines.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let jumpUntil = 0;

    const reveal = (el: Element, instant: boolean) => {
      el.classList.remove("pre");
      el.classList.add("is-in");
      if (instant) el.classList.add("instant");
    };

    const io = new IntersectionObserver(
      (entries) => {
        const instant = performance.now() < jumpUntil;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target, instant);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    const vh = window.innerHeight;
    // Read every position first, then write, so layout is computed once
    // instead of once per element.
    const toHide: Element[] = [];
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (el.classList.contains("is-in")) return;
      if (el.classList.contains("pre")) {
        io.observe(el);
        return;
      }
      // Starts on screen (or above it): leave it visible, never hide it.
      if (el.getBoundingClientRect().top < vh) return;
      toHide.push(el);
    });
    for (const el of toHide) {
      el.classList.add("pre");
      io.observe(el);
    }

    // Reveal everything currently in the viewport without animating.
    const sweep = () => {
      const h = window.innerHeight;
      const hit: Element[] = [];
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains("pre")) return;
        const r = el.getBoundingClientRect();
        if (r.top < h && r.bottom > 0) hit.push(el);
      });
      for (const el of hit) {
        reveal(el, true);
        io.unobserve(el);
      }
    };

    const startJump = () => {
      jumpUntil = performance.now() + 1200;
      for (const t of [0, 60, 200, 450, 900]) window.setTimeout(sweep, t);
    };

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("#")) startJump();
    };
    const onHash = () => startJump();

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    if (window.location.hash) startJump();

    // Scroll-drawn timelines.
    const timelines = Array.from(
      document.querySelectorAll<HTMLElement>("[data-timeline]"),
    );
    let ticking = false;
    const updateTimelines = () => {
      ticking = false;
      const h = window.innerHeight;
      for (const tl of timelines) {
        const line = tl.querySelector<HTMLElement>("[data-timeline-line]");
        if (!line) continue;
        const r = tl.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (h * 0.65 - r.top) / r.height));
        line.style.setProperty("--p", p.toFixed(3));
      }
    };
    // At the very bottom of the page, elements inside the last 8% of the
    // viewport can never reach the observer's shrunk root, so reveal them here.
    const flushBottom = () => {
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY < doc.scrollHeight - 4) return;
      const hit: Element[] = [];
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains("pre")) return;
        if (el.getBoundingClientRect().top < window.innerHeight) hit.push(el);
      });
      for (const el of hit) {
        reveal(el, false);
        io.unobserve(el);
      }
    };
    const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
    const updateBar = () => {
      if (!bar) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.setProperty("--sp", p.toFixed(4));
    };
    const frame = () => {
      ticking = false;
      updateTimelines();
      updateBar();
      flushBottom();
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(frame);
    };
    updateTimelines();
    updateBar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
