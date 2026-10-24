import type { CSSProperties } from "react";

type ChipListProps = {
  items: string[];
  label: string;
};

export function ChipList({ items, label }: ChipListProps) {
  if (items.length === 0) return null;

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2" data-reveal-group>
      {items.map((item, i) => (
        <li
          key={item}
          className="chip rounded border border-surface-border px-2 py-1 font-mono text-xs text-muted"
          data-reveal-child="scale"
          style={{ "--i": i } as CSSProperties}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
