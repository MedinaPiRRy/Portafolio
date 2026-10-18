type ChipListProps = {
  items: string[];
  label: string;
};

export function ChipList({ items, label }: ChipListProps) {
  if (items.length === 0) return null;

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded border border-surface-border px-2 py-1 font-mono text-xs text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
