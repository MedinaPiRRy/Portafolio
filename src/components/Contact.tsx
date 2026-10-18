import { site } from "@/content/site";
import { Section } from "./Section";

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

const rows = [
  { label: "email", text: site.email, href: `mailto:${site.email}` },
  {
    label: "phone",
    text: site.phone,
    href: `tel:+1${site.phone.replace(/\D/g, "")}`,
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
        <p className="max-w-2xl text-lg leading-relaxed text-foreground">
          {site.openTo}
        </p>

        <dl className="flex flex-col gap-px overflow-hidden rounded-lg border border-surface-border bg-surface-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 bg-surface px-4 py-3.5 sm:flex-row sm:items-center sm:gap-6 sm:px-5"
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
                    className="text-accent underline-offset-4 hover:underline"
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
