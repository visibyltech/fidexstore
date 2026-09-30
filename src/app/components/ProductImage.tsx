"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

type ProductImageProps = Omit<ImageProps, "src"> & { src: string | null | undefined };

// next/image with a fallback: a missing or failing image (for example a cart
// item saved before a rebrand deleted its photo) renders a plain branded
// placeholder instead of the browser's broken-image icon.
const ProductImage = ({ src, alt, className = "", ...props }: ProductImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-cream"
      >
        <span className="display-type text-2xl text-ink/15" aria-hidden>
          FIDEX
        </span>
      </span>
    );
  }

  return <Image src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} {...props} />;
};

export default ProductImage;
