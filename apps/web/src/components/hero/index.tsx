"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useScramble } from "use-scramble";
import _ from "lodash";
import { cn } from "../../lib/utils";

export interface ImageWithPhotographer {
  url: string;
  photographer: string | null | undefined;
}

function ImageWithCitation({
  image,
  isCurrentImage,
}: {
  image: ImageWithPhotographer;
  isCurrentImage: boolean;
}) {
  if (!image.photographer) {
    return (
      <Image
        alt=""
        className={cn(
          "pointer-events-none z-10 object-cover object-center transition-opacity duration-1000",
          isCurrentImage ? "opacity-25" : "opacity-0",
        )}
        fill
        priority={isCurrentImage}
        loading="eager"
        quality={50}
        src={image.url}
      />
    );
  }

  return (
    <blockquote key={image.url} className="absolute contents">
      <Image
        alt=""
        className={cn(
          "pointer-events-none z-10 object-cover object-center transition-opacity duration-1000",
          isCurrentImage ? "opacity-25" : "opacity-0",
        )}
        fill
        priority={isCurrentImage}
        loading="eager"
        quality={50}
        src={image.url}
      />
      <footer className="contents">
        <cite
          className={cn(
            "absolute bottom-0 right-2 text-gray-100 opacity-50",
            isCurrentImage ? "block" : "hidden",
          )}
        >
          © {image.photographer}
        </cite>
      </footer>
    </blockquote>
  );
}

export function Hero({
  images,
  texts,
}: {
  images: ImageWithPhotographer[];
  texts: string[];
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(
    new Date().getUTCDate() % images.length,
  );

  const [currentText, setCurrentText] = useState(texts[0]);
  // eslint-disable-next-line react/hook-use-state -- prev index used directly in the setter
  const [, setTextIndex] = useState(0);

  const { ref } = useScramble({
    text: currentText,
    seed: 1,
    tick: 2,
    speed: 0.7,
  });

  useEffect(() => {
    const shuffledTexts = _.shuffle(texts);
    setCurrentText(shuffledTexts[0]);

    const interval = setInterval(() => {
      setCurrentImageIndex((_current) => (_current + 1) % images.length);
      setTextIndex((_textIndex) => {
        const newIndex = (_textIndex + 1) % texts.length;
        setCurrentText(shuffledTexts[newIndex]);
        return newIndex;
      });
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [images.length, texts]);

  return (
    <div className="relative flex h-[55vh] items-end bg-gray-900 py-24 md:h-[75vh]">
      {images.map((image, imageIndex) => (
        <ImageWithCitation
          key={image.url}
          image={image}
          isCurrentImage={imageIndex === currentImageIndex}
        />
      ))}
      <div className="container z-20 mx-auto px-6 font-mono text-2xl font-semibold text-gray-100 md:text-4xl lg:text-6xl">
        <p
          className="line-clamp-4 w-full max-w-lg break-words pb-2 lg:w-1/2"
          ref={ref}
        />
      </div>
    </div>
  );
}
