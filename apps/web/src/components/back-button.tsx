"use client";

import { useRouter } from "next/navigation";
import { Button } from "@tietokilta/ui";

export function BackButton({ buttonText }: { buttonText: string }) {
  const router = useRouter();

  return (
    <Button
      variant="backLink"
      onClick={() => {
        router.back();
      }}
    >
      {buttonText}
    </Button>
  );
}
