import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { Section } from "./Section";

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

const rows = [
  { label: "email", text: site.email, href: `mailto:${site.email}` },
  {
    label: "phone",
    text: site.phone,
    href: site.phoneHref,
  },
  { label: "github", text: stripProtocol(site.github), href: site.github },
  {
    label: "linkedin",
    text: stripProtocol(site.linkedin),
    href: site.linkedin,
  },
  { label: "location", text: site.location },
];

export function Contact() {
  return (
    <Section id="contact" index="05" title="Contact">
      <div className="flex flex-col gap-8">
        <p
          className="max-w-2xl text-balance text-lg leading-relaxed text-foreground"
          data-reveal="up"
        >
          {site.openTo}
        </p>

        <dl
          className="flex flex-col gap-px overflow-hidden rounded-lg border border-surface-border bg-surface-border"
          data-reveal-group
        >
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="row-sweep flex flex-col gap-1 bg-surface px-4 py-3.5 sm:flex-row sm:items-center sm:gap-6 sm:px-5"
              data-reveal-child="up"
              style={{ "--i": i } as CSSProperties}
            >
              <dt className="font-mono text-xs text-muted sm:w-24">
                {row.label}
              </dt>
              <dd className="break-words font-mono text-sm text-foreground">
                {row.href ? (
                  <a
                    href={row.href}
                    {...(row.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="sweep inline-flex min-h-6 items-center text-accent [--sweep-bottom:0.2rem]"
                  >
                    {row.text}
                  </a>
                ) : (
                  row.text
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
