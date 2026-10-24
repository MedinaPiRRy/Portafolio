import type { CSSProperties } from "react";
import type { CaseBlock } from "@/content/types";
import { renderInline } from "./inline";

const focusInset = "focus-visible:outline-offset-[-3px]!";

function Code({ block }: { block: Extract<CaseBlock, { type: "code" }> }) {
  const { excerpt, note } = block;
  return (
    <figure
      className="overflow-hidden rounded-lg border border-surface-border bg-surface"
      data-reveal="fade"
    >
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-surface-border px-4 py-2 font-mono text-xs text-muted">
        <span className="break-all">{excerpt.path}</span>
        <span>lines {excerpt.lines}</span>
      </figcaption>
      <pre
        role="region"
        aria-label={`Code excerpt from ${excerpt.path}, lines ${excerpt.lines}`}
        tabIndex={0}
        className={`overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground/90 ${focusInset}`}
      >
        <code>{excerpt.code}</code>
      </pre>
      {note && (
        <p className="border-t border-surface-border px-4 py-3 text-sm leading-relaxed text-muted">
          {renderInline(note)}
        </p>
      )}
    </figure>
  );
}

function Diagram({ block }: { block: Extract<CaseBlock, { type: "diagram" }> }) {
  const markerId = `arrow-${block.title.replace(/\W+/g, "-").toLowerCase()}`;
  const lineHeight = 16;

  return (
    <figure className="flex flex-col gap-3" data-reveal="scale">
      <figcaption className="font-mono text-xs text-accent">
        {block.title}
      </figcaption>
      <div className="rounded-lg border border-surface-border bg-surface p-3 sm:p-5">
        <svg
          role="img"
          aria-label={`Diagram: ${block.title}`}
          viewBox={`0 0 ${block.width} ${block.height}`}
          className="mx-auto h-auto w-full max-w-[34rem]"
        >
          <defs>
            <marker
              id={markerId}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 z" className="fill-accent" />
            </marker>
          </defs>
          {block.boxes.map((box) => {
            const startY =
              box.y + box.h / 2 - ((box.lines.length - 1) * lineHeight) / 2 + 4;
            return (
              <g key={`${box.x}-${box.y}`}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  rx={6}
                  className="fill-background stroke-accent-dim"
                  strokeWidth={1.25}
                />
                {box.lines.map((line, i) => (
                  <text
                    key={line}
                    x={box.x + box.w / 2}
                    y={startY + i * lineHeight}
                    textAnchor="middle"
                    fontSize={i === 0 ? 13 : 11}
                    className={`font-mono ${
                      i === 0 ? "fill-foreground font-semibold" : "fill-muted"
                    }`}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
          {block.arrows.map((arrow) => (
            <g key={arrow.points.join("-")}>
              <polyline
                points={arrow.points.map((p) => p.join(",")).join(" ")}
                fill="none"
                className="stroke-accent"
                strokeWidth={1.5}
                markerEnd={`url(#${markerId})`}
              />
              {arrow.labels?.map((label) => (
                <text
                  key={label.text}
                  x={label.x}
                  y={label.y}
                  textAnchor={label.anchor ?? "start"}
                  fontSize={11}
                  className="fill-muted font-mono"
                >
                  {label.text}
                </text>
              ))}
            </g>
          ))}
        </svg>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        {renderInline(block.description)}
      </p>
    </figure>
  );
}

function DataTable({ block }: { block: Extract<CaseBlock, { type: "table" }> }) {
  return (
    <figure className="flex flex-col gap-3" data-reveal="up">
      <figcaption className="font-mono text-xs text-accent">
        {block.caption}
      </figcaption>
      <div
        role="region"
        aria-label={block.caption}
        tabIndex={0}
        className={`overflow-x-auto rounded-lg border border-surface-border ${focusInset}`}
      >
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead className="bg-surface">
            <tr>
              {block.headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="border-b border-surface-border px-3 py-2 font-mono text-xs font-medium text-accent"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row[0]} className="align-top [&:last-child>td]:border-b-0">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`border-b border-surface-border px-3 py-2.5 leading-relaxed ${
                      i === 0
                        ? "font-mono text-xs text-foreground"
                        : "text-foreground/90"
                    }`}
                  >
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export function CaseBlocks({ blocks }: { blocks: CaseBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p
                key={i}
                className="max-w-3xl leading-relaxed text-foreground/90"
                data-reveal="up"
              >
                {renderInline(block.text)}
              </p>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="mt-2 font-mono text-sm font-medium text-accent"
                data-reveal="left"
                style={{ "--rx": "calc(var(--dist-sm) * -1)" } as CSSProperties}
              >
                {block.text}
              </h3>
            );
          case "list":
            return (
              <ul
                key={i}
                className="flex max-w-3xl flex-col gap-2.5"
                data-reveal-group
              >
                {block.items.map((item, n) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed sm:text-base"
                    data-reveal-child="up"
                    style={{ "--i": n } as CSSProperties}
                  >
                    <span
                      className="select-none font-mono text-accent"
                      aria-hidden="true"
                    >
                      ▸
                    </span>
                    <span className="text-foreground/90">
                      {renderInline(item)}
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={i}
                className="max-w-3xl border-l-2 border-accent-dim pl-4"
                data-reveal="fade"
              >
                <p className="font-mono text-xs text-accent">{block.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {renderInline(block.text)}
                </p>
              </aside>
            );
          case "table":
            return <DataTable key={i} block={block} />;
          case "code":
            return <Code key={i} block={block} />;
          case "diagram":
            return <Diagram key={i} block={block} />;
        }
      })}
    </div>
  );
}
