import { formatMonthYear } from "@/lib/format";
import type { LiftResult, Meet } from "@/content/types";
import { ChipList } from "../ChipList";
import { isPhotoVisible, Photo } from "./Photo";

type MeetCardProps = {
  meet: Meet;
  previous?: Meet;
};

type LiftKey = "squat" | "bench" | "deadlift" | "total";

const lifts: { key: LiftKey; label: string }[] = [
  { key: "squat", label: "Squat" },
  { key: "bench", label: "Bench" },
  { key: "deadlift", label: "Deadlift" },
  { key: "total", label: "Total" },
];

function delta(current?: LiftResult, before?: LiftResult) {
  if (typeof current !== "number" || typeof before !== "number") return null;
  const diff = Math.round((current - before) * 100) / 100;
  return diff === 0 ? null : diff;
}

function LiftCell({
  label,
  value,
  change,
}: {
  label: string;
  value: LiftResult;
  change: number | null;
}) {
  const isTotal = label === "Total";
  return (
    <div
      className={`flex flex-col gap-1 rounded-md border bg-background px-3 py-3 ${
        isTotal && value !== "none"
          ? "border-accent-dim"
          : "border-surface-border"
      }`}
    >
      <dt className="font-mono text-xs text-muted">{label}</dt>
      <dd className="flex flex-wrap items-baseline gap-x-2">
        {value === "none" ? (
          <span className="font-mono text-sm text-muted">
            {isTotal ? "no total" : "no lift"}
          </span>
        ) : (
          <span className="font-mono text-2xl font-semibold text-foreground">
            {value}
            <span className="ml-1 text-xs font-normal text-muted">kg</span>
          </span>
        )}
        {change !== null && (
          <>
            <span
              aria-hidden="true"
              className="font-mono text-xs text-accent"
            >
              {change > 0 ? "+" : ""}
              {change}
            </span>
            <span className="sr-only">
              , {change > 0 ? "up" : "down"} {Math.abs(change)} kilograms from
              the previous meet
            </span>
          </>
        )}
      </dd>
    </div>
  );
}

export function MeetCard({ meet, previous }: MeetCardProps) {
  const won = meet.placing === "1st";
  const showPhoto = isPhotoVisible(meet.photo);
  const present = lifts.filter(({ key }) => meet[key] !== undefined);

  const chips = [
    meet.federation,
    meet.equipment,
    meet.weightClassKg ? `${meet.weightClassKg} kg class` : undefined,
    meet.division,
  ].filter((chip): chip is string => Boolean(chip));

  return (
    <article
      aria-labelledby={`meet-${meet.slug}`}
      className="rounded-lg border border-surface-border bg-surface p-4 sm:p-6"
    >
      <div
        className={
          showPhoto
            ? "grid gap-6 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:items-start"
            : ""
        }
      >
        {showPhoto && (
          <div className="order-last md:order-first">
            <Photo photo={meet.photo} sizes="(min-width: 768px) 208px, 100vw" />
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-xs text-muted">
                <time dateTime={meet.date}>{formatMonthYear(meet.date)}</time>
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, hosted by </span>
                {meet.host}
              </p>
              <h3
                id={`meet-${meet.slug}`}
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                {meet.name}
              </h3>
            </div>
            {meet.placing && (
              <span
                className={`shrink-0 rounded border px-2.5 py-1 font-mono text-sm font-medium ${
                  won
                    ? "border-accent bg-accent text-background"
                    : "border-muted text-muted"
                }`}
              >
                <span className="sr-only">Placing: </span>
                {meet.placing}
              </span>
            )}
          </div>

          <ChipList items={chips} label={`${meet.name} details`} />

          {present.length > 0 && (
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {present.map(({ key, label }) => (
                <LiftCell
                  key={key}
                  label={label}
                  value={meet[key] as LiftResult}
                  change={previous ? delta(meet[key], previous[key]) : null}
                />
              ))}
            </dl>
          )}

          {meet.dots !== undefined && (
            <p className="font-mono text-sm text-muted">
              <span className="text-accent">{meet.dots}</span> DOTS
            </p>
          )}

          <div className="flex max-w-2xl flex-col gap-3">
            {meet.story.map((paragraph) => (
              <p
                key={paragraph}
                className="leading-relaxed text-foreground/90"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {meet.instagramUrl && (
            <a
              href={meet.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${meet.name}: ${
                meet.instagramUrl.includes("/p/")
                  ? "Instagram post"
                  : "photos on Instagram"
              } (opens in a new tab)`}
              className="inline-flex min-h-6 items-center gap-1.5 self-start font-mono text-sm text-accent underline-offset-4 hover:underline"
            >
              {meet.instagramUrl.includes("/p/")
                ? "Instagram post"
                : "Photos on Instagram"}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
