import type { AboutBlock } from "@/content/types";
import { BulletList } from "../BulletList";
import { ChipList } from "../ChipList";
import { isPhotoVisible, Photo } from "./Photo";

type AboutBlockViewProps = {
  block: AboutBlock;
};

export function AboutBlockView({ block }: AboutBlockViewProps) {
  const photos = block.photos.filter(isPhotoVisible);

  const body = (
    <div className="flex flex-col gap-5">
      {block.paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="max-w-2xl text-base leading-relaxed text-foreground/90 sm:text-lg"
        >
          {paragraph}
        </p>
      ))}
      {block.bullets && <BulletList items={block.bullets} />}
      {block.chips && (
        <ChipList items={block.chips} label={block.chipsLabel ?? "Details"} />
      )}
    </div>
  );

  if (photos.length === 0) return body;

  if (photos.length > 1) {
    return (
      <div className="flex flex-col gap-8">
        {body}
        <div className="grid max-w-xl grid-cols-2 gap-4 sm:gap-6">
          {photos.map((photo) => (
            <Photo
              key={photo.file}
              photo={photo}
              sizes="(min-width: 640px) 280px, 50vw"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] md:items-start">
      {body}
      <div className="flex flex-col gap-6">
        {photos.map((photo) => (
          <Photo
            key={photo.file}
            photo={photo}
            sizes="(min-width: 768px) 272px, 100vw"
          />
        ))}
      </div>
    </div>
  );
}
