"use client";

import { Button, buttonVariants, Card } from "@tietokilta/ui";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cancelReservation } from "@lib/api/external/pakuvaraus/actions";
import { cn } from "@lib/utils";
import { useTranslations } from "@locales/client";

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      className="w-full"
      disabled={pending}
    >
      {children}
    </Button>
  );
}

export function CancelForm({ editKey }: { editKey: string }) {
  const t = useTranslations("pakuvaraus.manage");
  const [state, formAction] = useActionState(cancelReservation, null);

  if (state === "cancelled" || state === "not-found") {
    return (
      <p
        aria-live="polite"
        className={cn(state === "not-found" && "text-red-600")}
      >
        {t(state)}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p>{t("description")}</p>
      {state === "failed" ? (
        <p aria-live="polite" className="text-red-600">
          {t("failed")}
        </p>
      ) : null}
      <input
        type="button"
        popoverTarget="confirm-cancel"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full max-w-sm cursor-pointer",
        )}
        value={t("Cancel reservation")}
      />
      <Card
        id="confirm-cancel"
        popover="auto"
        className="[&:popover-open]:inset-0 [&:popover-open]:m-auto [&:popover-open]:flex [&:popover-open]:h-fit [&:popover-open]:w-full [&:popover-open]:max-w-sm [&:popover-open]:flex-col [&:popover-open]:gap-2"
      >
        <form action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="editKey" value={editKey} />
          <p>{t("confirmation")}</p>
          <input
            type="button"
            popoverTarget="confirm-cancel"
            popoverTargetAction="hide"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full cursor-pointer",
            )}
            value={t("Keep reservation")}
          />
          <SubmitButton>{t("Cancel reservation")}</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
