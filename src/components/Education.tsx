import type { CSSProperties } from "react";
import { certifications, education } from "@/content/education";
import { BulletList } from "./BulletList";
import { Section } from "./Section";

export function Education() {
  return (
    <Section id="education" index="04" title="Education">
      <div className="flex flex-col gap-10">
        {education.map((entry) => (
          <article
            key={`${entry.org}-${entry.start}`}
            className="entry flex flex-col gap-3"
            data-reveal="up"
          >
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {entry.credential}, {entry.field}
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
            <BulletList items={entry.details} />
          </article>
        ))}

        <div className="entry flex flex-col gap-3" data-reveal="up">
          <h3 className="font-mono text-sm text-accent">Certifications</h3>
          <ul className="flex flex-col gap-2" data-reveal-group>
            {certifications.map((cert, i) => (
              <li
                key={cert.name}
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
                <span className="text-foreground/90">
                  {cert.name}
                  <span className="text-muted"> · {cert.issuer}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
