"use client";

import { type UserEventResponse } from "@tietokilta/ilmomasiina-models";
import { Button, type ButtonProps } from "@tietokilta/ui";
import Form from "next/form";
import { useFormStatus } from "react-dom";
import { useSignUp } from "@lib/api/external/ilmomasiina/actions";
import { cn, currencyFormatter } from "@lib/utils";
import { useLocale, useTranslations } from "@locales/client";

function StatusButton({ disabled, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return <Button {...props} disabled={pending || disabled} />;
}

function SignUpButton({
  quotaId,
  isDisabled,
  children,
  signUpAction,
}: React.PropsWithChildren<{
  quotaId: string;
  isDisabled: boolean;
  signUpAction: (formData: FormData) => Promise<void>;
}>) {
  return (
    <Form action={signUpAction} className="contents">
      <input type="hidden" name="quotaId" value={quotaId} />
      <StatusButton type="submit" disabled={isDisabled} variant="secondary">
        {children}
      </StatusButton>
    </Form>
  );
}

export function SignupButtons({
  event,
  disabled,
}: {
  event: UserEventResponse;
  disabled: boolean;
}) {
  const { signUp } = useSignUp();
  const t = useTranslations("action");
  const locale = useLocale();

  if (!event.registrationStartDate || !event.registrationEndDate) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-2">
      {event.quotas.map((quota) => (
        <li key={quota.id} className="contents">
          <SignUpButton
            quotaId={quota.id}
            isDisabled={disabled}
            signUpAction={signUp}
          >
            <span className="flex min-w-0 items-center gap-1">
              <span className={cn(event.quotas.length > 1 && "sr-only")}>
                {t("Sign up")}
                {event.quotas.length === 1 ? "" : `: `}
              </span>
              {event.quotas.length > 1 ? (
                <span className="truncate" title={quota.title}>
                  {quota.title}
                </span>
              ) : null}
              {quota.price > 0 ? (
                <span className="shrink-0">
                  ({currencyFormatter(locale, quota.price)})
                </span>
              ) : null}
            </span>
          </SignUpButton>
        </li>
      ))}
    </ul>
  );
}
