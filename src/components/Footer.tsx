import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-surface-border py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 text-center font-mono text-xs text-muted sm:px-6">
        <p>
          Built by {site.name} · Next.js + Tailwind ·{" "}
          <a
            href={site.github}
            className="inline-flex min-h-6 items-center hover:text-accent"
            target="_blank"
            rel="noreferrer"
          >
            source
          </a>
        </p>
      </div>
    </footer>
  );
}
