"use client";

import { useRouter } from "next/navigation";
import { Button } from "@tietokilta/ui";
import { useScopedI18n } from "../locales/client";

export function BackButton() {
  const router = useRouter();
  const t = useScopedI18n("action");

  return (
    <Button
      variant="backLink"
      onClick={() => {
        router.back();
      }}
    >
      {t("Back")}
    </Button>
  );
}
