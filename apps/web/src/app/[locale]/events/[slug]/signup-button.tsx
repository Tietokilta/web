"use client";

import { Button, type ButtonProps } from "@tietokilta/ui";
// eslint-disable-next-line import/named -- Next.js magic enables this
import { useFormStatus } from "react-dom";
import type { signUp } from "../../../../lib/api/external/ilmomasiina/actions";

function StatusButton({ disabled, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return <Button {...props} disabled={pending || disabled} />;
}

export function SignUpButton({
  quotaId,
  isDisabled,
  children,
  signUpAction,
}: React.PropsWithChildren<{
  quotaId: string;
  isDisabled: boolean;
  signUpAction: typeof signUp;
}>) {
  return (
    <form action={signUpAction} className="contents">
      <input type="hidden" name="quotaId" value={quotaId} />
      <StatusButton type="submit" disabled={isDisabled} variant="secondary">
        {children}
      </StatusButton>
    </form>
  );
}
