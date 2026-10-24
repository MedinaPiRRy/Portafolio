"use client";

import { useEffect, useRef, useState } from "react";

const SHOW_AFTER = 400;
const RADIUS = 21;

/**
 * Floating "back to top" button. It appears once you scroll down, wears a ring
 * that fills as you read, and scrolls natively (smooth unless reduced motion).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      ring.current?.style.setProperty("--ring", p.toFixed(4));
      setVisible(window.scrollY > SHOW_AFTER);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    // The button hides once you reach the top, so hand focus to the page header.
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      data-visible={visible}
      className="back-to-top btn-sweep fixed! bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-surface/90 text-accent shadow-lg shadow-black/40 backdrop-blur-sm [--fill-text:var(--background)] [--fill:var(--accent)] sm:bottom-6 sm:right-6"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="absolute inset-0 h-full w-full -rotate-90"
      >
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          strokeWidth="2"
          className="stroke-surface-border"
        />
        <circle
          ref={ring}
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          pathLength={1}
          strokeWidth="2"
          strokeLinecap="round"
          className="back-to-top-ring stroke-accent"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="back-to-top-arrow relative h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
