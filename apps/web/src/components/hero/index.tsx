"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function Hero({ images, text }: { images: string[]; text: string }) {
  const [currentImage, setCurrentImage] = useState(
    new Date().getUTCDate() % images.length,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((_current) => (_current + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [images.length]);

  return (
    <section className="relative flex h-[85vh] items-end bg-gray-900 py-24">
      {images.map((image, imageIndex) => (
        <Image
          alt=""
          className={cn(
            "z-10 object-cover object-center transition-opacity duration-1000",
            imageIndex === currentImage ? "opacity-25" : "opacity-0",
          )}
          fill
          key={image}
          priority
          src={image}
        />
      ))}
      <p className="container z-20 mx-auto px-6 font-mono text-5xl text-gray-100">
        {text}
      </p>
    </section>
  );
}
