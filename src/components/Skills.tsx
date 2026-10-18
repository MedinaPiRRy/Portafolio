import { skills } from "@/content/skills";
import { ChipList } from "./ChipList";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" index="03" title="Skills">
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((group) => (
          <div
            key={group.label}
            className="flex flex-col gap-3 rounded-lg border border-surface-border bg-surface p-4 sm:p-5"
          >
            <h3 className="font-mono text-sm text-accent">{group.label}</h3>
            <ChipList items={group.items} label={group.label} />
          </div>
        ))}
      </div>
    </Section>
  );
}
