"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useScramble } from "use-scramble";

export function Hero({ images, texts }: { images: string[]; texts: string[] }) {
  const [currentImage, setCurrentImage] = useState(
    new Date().getUTCDate() % images.length,
  );

  const [currentText, setCurrentText] = useState("");
  const [_, setTextIndex] = useState(0);

  const { ref } = useScramble({
    text: currentText,
    seed: 1,
    tick: 2,
    speed: 0.7,
  });

  useEffect(() => {
    const shuffledTexts = texts
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    setCurrentText(shuffledTexts[0]);

    const interval = setInterval(() => {
      setCurrentImage((_current) => (_current + 1) % images.length);
      setTextIndex((_textIndex) => {
        const newIndex = (_textIndex + 1) % texts.length;
        setCurrentText(shuffledTexts[newIndex]);
        return newIndex;
      });
    }, 15000);

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
      <div className="container z-20 mx-auto px-6 font-mono text-4xl font-semibold text-gray-100 md:text-6xl">
        <p className="w-1/2" ref={ref} />
      </div>
    </section>
  );
}
