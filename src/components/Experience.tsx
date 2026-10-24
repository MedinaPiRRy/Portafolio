import type { CSSProperties } from "react";
import { experience } from "@/content/experience";
import { BulletList } from "./BulletList";
import { ChipList } from "./ChipList";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section id="experience" index="02" title="Experience">
      <div className="relative pl-6 sm:pl-8" data-timeline>
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-px bg-surface-border"
        />
        <span
          aria-hidden="true"
          data-timeline-line
          className="absolute left-0 top-0 h-full w-px bg-accent-dim"
        />
        <ol className="flex flex-col gap-10">
          {experience.map((entry, i) => {
            const current = entry.end === "Present";
            return (
              <li
                key={`${entry.org}-${entry.start}`}
                className="entry"
                data-reveal={i % 2 === 0 ? "left" : "right"}
                style={{ "--i": 0 } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  data-reveal="pop"
                  className={`dot absolute -left-[28px] top-2 h-2.5 w-2.5 rounded-full border border-accent sm:-left-[36px] ${
                    current ? "bg-accent" : "bg-background"
                  }`}
                />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h3 className="text-balance text-lg font-semibold tracking-tight text-foreground">
                        {entry.role}
                      </h3>
                      <p className="font-mono text-xs text-muted">
                        {entry.start} – {entry.end}
                      </p>
                    </div>
                    <p className="font-mono text-sm text-accent">
                      {entry.org}
                      <span className="text-muted"> · {entry.location}</span>
                    </p>
                  </div>
                  <BulletList items={entry.bullets} />
                  <ChipList
                    items={entry.stack}
                    label={`${entry.role} at ${entry.org}: tools used`}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
