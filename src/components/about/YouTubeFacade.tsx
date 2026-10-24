"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type YouTubeFacadeProps = {
  id: string;
  title: string;
  index?: number;
};

export function YouTubeFacade({ id, title, index = 0 }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) iframeRef.current?.focus();
  }, [playing]);

  return (
    <figure
      className="flex flex-col gap-2"
      data-reveal-child="scale"
      style={{ "--i": index } as CSSProperties}
    >
      <div className="lift relative aspect-[9/16] w-full overflow-hidden rounded-lg border border-surface-border bg-surface [--lift:-3px]">
        {playing ? (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 block h-full w-full focus-visible:outline-offset-[-3px]!"
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/hq2.jpg`}
              alt=""
              fill
              sizes="(min-width: 768px) 210px, 50vw"
              className="zoom-img object-cover"
            />
            <span className="absolute inset-0 bg-background/30 transition-colors group-hover:bg-background/10" />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-background/80 font-mono text-lg text-accent"
            >
              ▶
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex flex-col gap-1 text-sm">
        <span className="text-foreground/90">{title}</span>
        <a
          href={`https://www.youtube.com/shorts/${id}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`${title}: watch on YouTube (opens in a new tab)`}
          className="sweep inline-flex min-h-6 items-center gap-1.5 self-start font-mono text-xs text-accent [--sweep-bottom:0.15rem]"
        >
          Watch on YouTube <span aria-hidden="true">↗</span>
        </a>
      </figcaption>
    </figure>
  );
}
