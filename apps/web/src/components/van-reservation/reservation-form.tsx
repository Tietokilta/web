"use client";

import { Button, Checkbox, Input } from "@tietokilta/ui";
import {
  type FormEvent,
  type InputHTMLAttributes,
  startTransition,
  useActionState,
} from "react";
import { useFormStatus } from "react-dom";
import {
  requestReservation,
  type ReservationField,
  type ReservationFormState,
} from "../../lib/api/external/pakuvaraus/actions";
import { useTranslations } from "../../locales/client";
import type { Messages } from "../../locales/index";

type FieldErrors = ReservationFormState["fieldErrors"];
// The action uses these keys as its validation messages
type FieldErrorKey = keyof Messages["pakuvaraus"]["fieldError"];

function FieldError({
  name,
  errors,
}: {
  name: ReservationField;
  errors: FieldErrors;
}) {
  const t = useTranslations("pakuvaraus.fieldError");
  const messages = errors?.[name];
  if (!messages?.length) return null;
  return (
    <span aria-live="polite" className="block text-red-600">
      {messages.map((message) => t(message as FieldErrorKey)).join(", ")}
    </span>
  );
}

function Field({
  name,
  label,
  hint,
  errors,
  ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & {
  name: ReservationField;
  label: string;
  hint?: string;
  errors: FieldErrors;
}) {
  return (
    <p className="w-full max-w-sm space-y-2">
      <label className="block" htmlFor={`van-${name}`}>
        {label}
      </label>
      <Input
        id={`van-${name}`}
        name={name}
        required
        aria-invalid={!!errors?.[name]?.length}
        {...inputProps}
      />
      {hint ? (
        <span className="block text-sm text-gray-700">{hint}</span>
      ) : null}
      <FieldError name={name} errors={errors} />
    </p>
  );
}

function CheckboxField({
  name,
  label,
  errors,
  required,
}: {
  name: ReservationField;
  label: string;
  errors: FieldErrors;
  required?: boolean;
}) {
  return (
    <p className="w-full max-w-sm space-x-2">
      <Checkbox id={`van-${name}`} name={name} required={required} />
      <label htmlFor={`van-${name}`}>{label}</label>
      <FieldError name={name} errors={errors} />
    </p>
  );
}

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full max-w-sm" disabled={pending}>
      {children}
    </Button>
  );
}

export default function ReservationForm() {
  const t = useTranslations("pakuvaraus");
  const [state, formAction] = useActionState(requestReservation, null);

  // Submit without React's automatic form reset, so input survives errors
  // https://github.com/facebook/react/issues/29034#issuecomment-2143595195
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  if (state?.success) {
    return (
      <div
        aria-live="polite"
        className="w-full max-w-prose space-y-2 rounded-md border-2 border-gray-900 p-4 shadow-solid md:p-6"
      >
        <h3 className="font-mono text-xl">{t("Request sent")}</h3>
        <p>{t("requestSentDetails")}</p>
      </div>
    );
  }

  const errors = state?.fieldErrors;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-prose flex-col items-center gap-4 rounded-md border-2 border-gray-900 p-4 py-6 shadow-solid md:px-6 md:py-8"
    >
      <h3 className="w-full max-w-sm font-mono text-xl">
        {t("Request a reservation")}
      </h3>
      {state?.error ? (
        <p aria-live="polite" className="w-full max-w-sm text-red-600">
          {t(`formError.${state.error}`)}
          {state.detail ? ` (${state.detail})` : null}
        </p>
      ) : null}
      <Field
        name="start_time"
        type="datetime-local"
        label={t("Start")}
        errors={errors}
      />
      <Field
        name="end_time"
        type="datetime-local"
        label={t("End")}
        hint={t("Times are in Finnish time")}
        errors={errors}
      />
      <Field
        name="full_name"
        label={t("Full name")}
        autoComplete="name"
        errors={errors}
      />
      <Field
        name="email"
        type="email"
        label={t("Email")}
        autoComplete="email"
        errors={errors}
      />
      <Field
        name="phone_number"
        type="tel"
        label={t("Phone number")}
        autoComplete="tel"
        errors={errors}
      />
      <Field
        name="address"
        label={t("Address")}
        autoComplete="street-address"
        errors={errors}
      />
      <Field
        name="hetu"
        label={t("Personal identity code")}
        hint={t("hetuHint")}
        autoComplete="off"
        errors={errors}
      />
      <CheckboxField name="internal" label={t("internal")} errors={errors} />
      <CheckboxField
        name="used_outside_finland"
        label={t("usedOutsideFinland")}
        errors={errors}
      />
      <CheckboxField
        name="terms_accepted"
        label={t("termsAccepted")}
        errors={errors}
        required
      />
      <SubmitButton>{t("Send request")}</SubmitButton>
    </form>
  );
}
