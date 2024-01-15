"use client";

import { useEffect, useState } from "react";

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
    <div className="relative flex h-[85vh] items-end bg-black py-24">
      {images.map((image, idx) => (
        <div
          className={`absolute bottom-0 left-0 right-0 top-0 z-10 bg-cover bg-center ${
            idx === currentImage ? "opacity-25" : "opacity-0"
          } transition-opacity duration-1000`}
          style={{
            backgroundImage: `url(${image})`,
          }}
          key={image}
        />
      ))}
      <div className="container z-20 mx-auto text-4xl text-white font-mono px-6">{text}</div>
    </div>
  );
}
