"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PhotoImageProps = {
  src: string;
  alt: string;
  sizes: string;
};

export function PhotoImage({ src, alt, sizes }: PhotoImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} role="img" aria-label={alt} className="absolute inset-0">
      {near && (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          loading="eager"
          className="object-cover"
        />
      )}
    </div>
  );
}
