"use client";

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
      {images.map((image, idx) => (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0 z-10 bg-cover bg-center transition-opacity duration-1000",
            idx === currentImage ? "opacity-25" : "opacity-0",
          )}
          key={image}
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ))}
      <p className="container z-20 mx-auto px-6 font-mono text-5xl text-gray-100">
        {text}
      </p>
    </section>
  );
}
