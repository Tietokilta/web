"use client";

import Form from "next/form";
import { Button, type ButtonProps } from "@tietokilta/ui";
import { useFormStatus } from "react-dom";
import { type IlmomasiinaEvent } from "@lib/api/external/ilmomasiina";
import { useSignUp } from "@lib/api/external/ilmomasiina/actions";
import { cn } from "@lib/utils";
import { useScopedI18n } from "@locales/client";

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

export function SignupButtons({ event }: { event: IlmomasiinaEvent }) {
  const { signUp } = useSignUp();
  const t = useScopedI18n("action");

  if (!event.registrationStartDate || !event.registrationEndDate) {
    return null;
  }

  const hasStarted = new Date(event.registrationStartDate) < new Date();
  const hasEnded = new Date(event.registrationEndDate) < new Date();

  return (
    <ul className="flex flex-col gap-2">
      {event.quotas.map((quota) => (
        <li key={quota.id} className="contents">
          <SignUpButton
            quotaId={quota.id}
            isDisabled={!hasStarted || hasEnded}
            signUpAction={signUp}
          >
            <span>
              <span className={cn(event.quotas.length > 1 && "sr-only")}>
                {t("Sign up")}
                {event.quotas.length === 1 ? "" : `: `}
              </span>
              {event.quotas.length > 1 ? <span>{quota.title}</span> : null}
            </span>
          </SignUpButton>
        </li>
      ))}
    </ul>
  );
}
