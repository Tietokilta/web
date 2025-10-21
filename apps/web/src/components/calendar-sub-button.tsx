"use client";

import { Button } from "@tietokilta/ui";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CalendarSubButton({
  locale,
  ctaText,
  copyingText,
  copiedText,
}: {
  locale: string;
  ctaText: string;
  copyingText: string;
  copiedText: string;
}) {
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const calendarIcsUrl = `/next_api/ilmo-calendar?lang=${locale}`;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copied]);

  const copyUrl = async () => {
    setCopying(true);
    await navigator.clipboard.writeText(
      new URL(calendarIcsUrl, window.location.href).toString(),
    );
    setCopying(false);
    setCopied(true);
  };

  let buttonText = ctaText;
  if (copying) {
    buttonText = copyingText;
  } else if (copied) {
    buttonText = copiedText;
  }

  return (
    <Button asChild variant="outlineLink" className="self-end">
      <Link
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          void copyUrl();
        }}
        href={calendarIcsUrl}
      >
        {buttonText}
      </Link>
    </Button>
  );
}
