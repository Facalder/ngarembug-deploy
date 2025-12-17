"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends Omit<ImageProps, "onLoad"> {
  /**
   * Aspect ratio of the image wrapper.
   * If provided, the image will fill this ratio.
   * Example: "aspect-video", "aspect-square", "aspect-[4/3]"
   */
  aspectRatio?: string;
  /**
   * Container class name
   */
  className?: string;
  /**
   * Image class name
   */
  imageClassName?: string;
}

export function ResponsiveImage({
  src,
  alt,
  aspectRatio,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = true,
  ...props
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full bg-muted",
        aspectRatio,
        className,
      )}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full z-10" />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          imageClassName,
        )}
        onLoad={() => setIsLoading(false)}
        sizes={sizes}
        priority={priority}
        {...props}
      />
    </div>
  );
}
