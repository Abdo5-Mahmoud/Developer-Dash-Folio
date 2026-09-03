"use client";

import * as React from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

interface ProjectImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ProjectImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: ProjectImageProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  if (imageFailed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center font-mono text-xs text-muted-foreground">
        <ImageIcon className="h-5 w-5 text-muted-foreground/60" aria-hidden="true" />
        <span className="font-medium text-foreground/80">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setImageFailed(true)}
    />
  );
}
