import type { ReactNode } from "react";

// Supports `code` and **bold** only. Nothing else is interpreted, and no HTML is ever injected.
function bold(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  text.split("**").forEach((part, i) => {
    out.push(
      i % 2 === 1 ? (
        <strong key={`${keyBase}-${i}`} className="font-semibold text-foreground">
          {part}
        </strong>
      ) : (
        part
      ),
    );
  });
  return out;
}

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  text.split("`").forEach((part, i) => {
    if (i % 2 === 1) {
      out.push(
        <code
          key={`c-${i}`}
          className="rounded bg-surface px-1 py-0.5 font-mono text-[0.88em] text-accent"
        >
          {part}
        </code>,
      );
    } else {
      out.push(...bold(part, `b-${i}`));
    }
  });
  return out;
}
