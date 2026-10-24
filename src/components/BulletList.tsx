import type { CSSProperties } from "react";

type BulletListProps = {
  items: string[];
};

export function BulletList({ items }: BulletListProps) {
  return (
    <ul className="flex flex-col gap-2.5" data-reveal-group>
      {items.map((item, i) => (
        <li
          key={item}
          className="hl-item flex gap-3 text-sm leading-relaxed sm:text-base"
          data-reveal-child="up"
          style={{ "--i": i } as CSSProperties}
        >
          <span
            className="select-none font-mono text-accent"
            aria-hidden="true"
          >
            ▸
          </span>
          <span className="text-foreground/90">{item}</span>
        </li>
      ))}
    </ul>
  );
}
