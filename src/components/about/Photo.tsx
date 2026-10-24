import type { CSSProperties } from "react";
import { aboutSettings } from "@/content/about";
import type { AboutPhoto, PhotoAspect } from "@/content/types";
import { PhotoImage } from "./PhotoImage";

const aspectClass: Record<PhotoAspect, string> = {
  "4/5": "aspect-[4/5]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

export function isPhotoVisible(photo: AboutPhoto) {
  return (
    Boolean(photo.ready) ||
    process.env.NODE_ENV !== "production" ||
    aboutSettings.showPlaceholdersInProduction
  );
}

type PhotoProps = {
  photo: AboutPhoto;
  sizes: string;
  index?: number;
  reveal?: "clip" | "scale" | "fade";
};

export function Photo({
  photo,
  sizes,
  index = 0,
  reveal = "clip",
}: PhotoProps) {
  if (!isPhotoVisible(photo)) return null;

  return (
    <figure className="flex flex-col gap-2" data-reveal-group>
      <div
        className={`relative w-full overflow-hidden rounded-lg border border-surface-border bg-surface ${aspectClass[photo.aspect]}`}
        data-reveal-child={reveal}
        style={{ "--i": index } as CSSProperties}
      >
        {photo.ready ? (
          <PhotoImage
            src={`/about/${photo.file}`}
            alt={photo.alt}
            sizes={sizes}
          />
        ) : (
          <div
            role="img"
            aria-label={`Photo placeholder: ${photo.alt}`}
            className="absolute inset-2 flex flex-col items-center justify-center gap-1 rounded border border-dashed border-surface-border p-3 text-center font-mono text-xs text-muted"
          >
            <span aria-hidden="true">┌─ photo ─┐</span>
            <span className="break-all">public/about/{photo.file}</span>
            <span aria-hidden="true">
              └─ {photo.aspect.replace("/", ":")} ─┘
            </span>
          </div>
        )}
      </div>
      {photo.caption && (
        <figcaption className="font-mono text-xs text-muted">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}
