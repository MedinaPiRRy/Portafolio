import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { AboutBlockView } from "@/components/about/AboutBlockView";
import { Powerlifting } from "@/components/about/Powerlifting";
import {
  aboutHeader,
  aboutMeta,
  animals,
  colombia,
  family,
  school,
  who,
} from "@/content/about";
import { site } from "@/content/site";

const pageTitle = `${aboutMeta.title} — ${site.name}`;

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: `${site.url}/about`,
    title: pageTitle,
    description: aboutMeta.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: aboutMeta.description,
  },
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <header className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pb-4 pt-14 sm:px-6 sm:pt-20">
          <p className="font-mono text-sm text-muted">
            <span className="text-accent">daniel@gta</span>
            <span>:~$</span>
            <span className="ml-2 text-foreground">{aboutHeader.command}</span>
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {aboutHeader.title}
          </h1>
          <p className="font-mono text-base text-accent sm:text-lg">
            {aboutHeader.subtitle}
          </p>
        </header>

        <Section id="who-i-am" index="01" title="Who I am">
          <AboutBlockView block={who} />
        </Section>

        <Section id="colombia-to-canada" index="02" title="Colombia to Canada">
          <AboutBlockView block={colombia} />
        </Section>

        <Section id="school-and-work" index="03" title="School and work">
          <AboutBlockView block={school} />
        </Section>

        <Section id="animals" index="04" title="Animals">
          <AboutBlockView block={animals} />
        </Section>

        <Section id="family" index="05" title="Family">
          <AboutBlockView block={family} />
        </Section>

        <Powerlifting />

        <p className="mx-auto max-w-4xl px-4 pb-16 font-mono text-sm sm:px-6">
          <Link
            href="/#contact"
            className="inline-flex min-h-6 items-center text-accent underline-offset-4 hover:underline"
          >
            Like what you see? Let&apos;s talk <span aria-hidden="true">→</span>
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
