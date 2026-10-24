import type { CSSProperties } from "react";
import { meets, powerlifting, videos } from "@/content/about";
import { Section } from "../Section";
import { LinkCard } from "./LinkCard";
import { MeetCard } from "./MeetCard";
import { YouTubeFacade } from "./YouTubeFacade";

function SubHeading({ children }: { children: string }) {
  return (
    <h3
      className="mb-4 font-mono text-sm text-accent"
      data-reveal="left"
      style={{ "--rx": "calc(var(--dist-sm) * -1)" } as CSSProperties}
    >
      {children}
    </h3>
  );
}

export function Powerlifting() {
  const totals = meets.flatMap((m) =>
    typeof m.total === "number" ? [m.total] : [],
  );
  const dots = meets.flatMap((m) => (m.dots !== undefined ? [m.dots] : []));

  const stats = [
    { label: "Best total", value: `${Math.max(...totals)}`, unit: "kg" },
    { label: "Best DOTS", value: `${Math.max(...dots)}`, unit: "" },
    { label: "Meets", value: `${meets.length}`, unit: "" },
    { label: "Lifting since", value: `${powerlifting.since}`, unit: "" },
  ];

  return (
    <Section id="powerlifting" index="06" title="Powerlifting">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6" data-reveal-group>
          {powerlifting.intro.map((paragraph, i) => (
            <p
              key={paragraph}
              className="max-w-2xl text-base leading-relaxed text-foreground/90 sm:text-lg"
              data-reveal-child="up"
              style={{ "--i": i } as CSSProperties}
            >
              {paragraph}
            </p>
          ))}
          </div>

          <dl
            className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-surface-border bg-surface-border md:grid-cols-4"
            data-reveal-group
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 bg-surface p-4"
                data-reveal-child="pop"
                style={{ "--i": i } as CSSProperties}
              >
                <dt className="font-mono text-xs text-muted">{stat.label}</dt>
                <dd className="font-mono text-3xl font-semibold text-accent">
                  {stat.value}
                  {stat.unit && (
                    <span className="ml-1 text-sm font-normal text-muted">
                      {stat.unit}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <SubHeading>Meet timeline</SubHeading>
          <div className="relative pl-5 sm:pl-8" data-timeline>
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px bg-surface-border"
          />
          <span
            aria-hidden="true"
            data-timeline-line
            className="absolute left-0 top-0 h-full w-px bg-accent-dim"
          />
          <ol className="flex flex-col gap-8">
            {meets.map((meet, i) => (
              <li
                key={meet.slug}
                className="relative"
                data-reveal={i % 2 === 0 ? "left" : "right"}
              >
                <span
                  aria-hidden="true"
                  data-reveal="pop"
                  className={`absolute -left-[25px] top-6 h-2.5 w-2.5 rounded-full border sm:-left-[36px] ${
                    meet.placing === "1st"
                      ? "border-accent bg-accent"
                      : "border-muted bg-background"
                  }`}
                />
                <MeetCard meet={meet} previous={meets[i - 1]} />
              </li>
            ))}
          </ol>
          </div>
        </div>

        <div>
          <SubHeading>Videos</SubHeading>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4" data-reveal-group>
            {videos.map((video, i) => (
              <YouTubeFacade
                key={video.id}
                id={video.id}
                title={video.title}
                index={i}
              />
            ))}
          </div>
        </div>

        <div>
          <SubHeading>Find me online</SubHeading>
          <div className="grid gap-4 md:grid-cols-3" data-reveal-group>
            <LinkCard
              {...powerlifting.openPowerlifting}
              href={powerlifting.openPowerlifting.url}
              index={0}
            />
            <LinkCard
              {...powerlifting.youtube}
              href={powerlifting.youtube.url}
              index={1}
            />
            <LinkCard
              {...powerlifting.instagram}
              href={powerlifting.instagram.url}
              index={2}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
