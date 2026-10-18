import { experience } from "@/content/experience";
import { BulletList } from "./BulletList";
import { ChipList } from "./ChipList";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section id="experience" index="02" title="Experience">
      <ol className="flex flex-col gap-10 border-l border-surface-border pl-6 sm:pl-8">
        {experience.map((entry) => {
          const current = entry.end === "Present";
          return (
            <li key={`${entry.org}-${entry.start}`} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full border border-accent sm:-left-[37px] ${
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
    </Section>
  );
}
