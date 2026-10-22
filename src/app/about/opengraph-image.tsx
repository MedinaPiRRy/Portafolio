import { aboutHeader, aboutMeta } from "@/content/about";
import { site } from "@/content/site";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = `${aboutMeta.title} | ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function AboutOpenGraphImage() {
  return renderOgCard({
    command: aboutHeader.command,
    title: aboutHeader.title,
    subtitle: site.name,
    body: "Colombia to Canada, school and work, animals, family and powerlifting.",
    footer: "Open to full-time roles · GTA · hybrid / remote",
  });
}
