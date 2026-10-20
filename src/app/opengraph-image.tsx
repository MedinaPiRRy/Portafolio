import { site } from "@/content/site";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgCard({
    command: "whoami",
    title: site.name,
    subtitle: site.role,
    body: site.tagline,
    footer: "Open to full-time roles · GTA · hybrid / remote",
  });
}
