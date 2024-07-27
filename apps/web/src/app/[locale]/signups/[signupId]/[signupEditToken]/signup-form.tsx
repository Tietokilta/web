"use client";

/* eslint-disable no-nested-ternary -- this is pretty cool and readable here */

import { Button, Checkbox, Input, Textarea, Radio } from "@tietokilta/ui";
// eslint-disable-next-line import/named -- Next.js magic enables this
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import {
  type IlmomasiinaEvent,
  type IlmomasiinaSignupInfo,
} from "../../../../../lib/api/external/ilmomasiina";
import type {
  deleteSignUpAction,
  saveSignUpAction,
} from "../../../../../lib/api/external/ilmomasiina/actions";
import {
  I18nProviderClient,
  useCurrentLocale,
  useScopedI18n,
} from "../../../../../locales/client";

function InputRow({
  question,
  defaultValue,
  errors,
}: {
  question: IlmomasiinaEvent["questions"][number];
  defaultValue?: string[] | string;
  errors?: string[];
}) {
  const t = useScopedI18n("ilmomasiina.form");

  const sharedInputProps = {
    id: `question-${question.id}`,
    name: question.id,
    required: question.required ?? false,
    defaultValue,
    "aria-invalid": !!errors?.length,
  };

  return (
    <div className="w-full max-w-sm space-y-2" key={sharedInputProps.id}>
      <label className="block" htmlFor={sharedInputProps.id}>
        <span>{question.question}</span>
        {!question.required && (
          <span className="text-gray-700"> ({t("optional")})</span>
        )}
      </label>
      {question.type === "checkbox" ? (
        <div className="grid gap-2">
          {(question.options ?? []).map((option) => (
            <p key={option} className="w-full max-w-sm space-x-2">
              <Checkbox
                id={`checkbox-${question.id}-option-${option}`}
                name={question.id}
                value={option}
                defaultChecked={defaultValue?.includes(option)}
              />
              <label htmlFor={`checkbox-${question.id}-option-${option}`}>
                {option}
              </label>
            </p>
          ))}
        </div>
      ) : question.type === "select" ? (
        <div className="grid gap-2">
          {(question.options ?? []).map((option) => (
            <p key={option} className="flex items-center space-x-2">
              <Radio
                id={`radio-${question.id}-option-${option}`}
                value={option}
                required={question.required ?? false}
                defaultChecked={defaultValue === option}
                name={question.id}
              />
              <label htmlFor={`radio-${question.id}-option-${option}`}>
                {option}
              </label>
            </p>
          ))}
        </div>
      ) : question.type === "textarea" ? (
        <Textarea {...sharedInputProps} />
      ) : (
        <Input type={question.type ?? "text"} {...sharedInputProps} />
      )}

      {question.public ? (
        <span className="block text-gray-700">
          ({t("Shown in the public list of sign ups")})
        </span>
      ) : null}
      {errors?.length ? (
        <span aria-live="polite" className="block text-red-600">
          {errors.join(", ")}
        </span>
      ) : null}
    </div>
  );
}

function SubmitButton({ isConfirmed }: { isConfirmed: boolean }) {
  const t = useScopedI18n("ilmomasiina.form");
  const { pending } = useFormStatus();

  return (
    <Button className="w-full max-w-sm" type="submit" disabled={pending}>
      {isConfirmed ? t("Update") : t("Submit")}
    </Button>
  );
}

function Form({
  signupId,
  signupEditToken,
  event,
  signup,
  saveAction,
  deleteAction,
}: {
  signupId: string;
  signupEditToken: string;
  event: IlmomasiinaEvent;
  signup: IlmomasiinaSignupInfo;
  saveAction: typeof saveSignUpAction;
  deleteAction: typeof deleteSignUpAction;
}) {
  const t = useScopedI18n("ilmomasiina.form");
  const [state, formAction] = useFormState(saveAction, null);

  useEffect(() => {
    const errorFields = state?.errors
      ? Object.keys(state.errors).filter((v) => v !== "_form")
      : [];
    if (errorFields.length !== 0) {
      const lastErrorField = errorFields[errorFields.length - 1];
      const inputWithError = document.getElementById(lastErrorField);
      inputWithError?.focus();
    } else if (!!state?.success || !!state?.errors?._form) {
      document.querySelector("[data-form-status]")?.scrollIntoView();
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="shadow-solid w-full max-w-prose space-y-4 overflow-x-clip rounded-md border-2 border-gray-900 p-4 py-6 md:px-6 md:py-8"
    >
      <input type="hidden" name="signupId" value={signupId} />
      <input type="hidden" name="signupEditToken" value={signupEditToken} />

      <div className="flex flex-col items-center gap-4 *:scroll-mt-24">
        {state?.success ? (
          <p
            data-form-status
            className="w-full max-w-sm text-green-600"
            aria-live="polite"
          >
            {t("Sign up saved")}
          </p>
        ) : null}

        {state?.errors?._form ? (
          <p
            data-form-status
            className="w-full max-w-sm text-red-600"
            aria-live="polite"
          >
            {state.errors._form.join(", ")}
          </p>
        ) : null}

        {!!event.nameQuestion && (
          <>
            <p className="w-full max-w-sm space-y-2">
              <label className="block" htmlFor="firstName">
                {t("First name")}
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Teemu"
                required
                defaultValue={signup.firstName ?? undefined}
                disabled={signup.confirmed}
              />
              {state?.errors?.firstName ? (
                <span aria-live="polite" className="block text-red-600">
                  {state.errors.firstName.join(", ")}
                </span>
              ) : null}
            </p>
            <p className="w-full max-w-sm space-y-2">
              <label className="block" htmlFor="lastName">
                {t("Last name")}
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Teekkari"
                required
                defaultValue={signup.lastName ?? undefined}
                disabled={signup.confirmed}
              />
              {state?.errors?.lastName ? (
                <span aria-live="polite" className="block text-red-600">
                  {state.errors.lastName.join(", ")}
                </span>
              ) : null}
            </p>
            <p className="w-full max-w-sm space-x-2">
              <Checkbox
                id="namePublic"
                name="namePublic"
                defaultChecked={signup.namePublic}
              />
              <label htmlFor="namePublic">
                {t("Show name in the public list of sign ups")}
              </label>
            </p>
          </>
        )}
        {!!event.emailQuestion && (
          <p className="w-full max-w-sm space-y-2">
            <label className="block" htmlFor="email">
              {t("Email")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="teemu.teekkari@aalto.fi"
              required
              defaultValue={signup.email ?? undefined}
              disabled={signup.confirmed}
            />
            {state?.errors?.email ? (
              <span aria-live="polite" className="block text-red-600">
                {state.errors.email.join(", ")}
              </span>
            ) : null}
          </p>
        )}
        {event.questions.map((question) => (
          <InputRow
            key={question.id}
            question={question}
            defaultValue={
              signup.answers.find((answer) => answer.questionId === question.id)
                ?.answer ?? undefined
            }
            errors={state?.errors?.[question.id]}
          />
        ))}
        <p className="w-full max-w-sm">
          {t(
            "You can edit your sign up or delete it later from this page, which will be sent to your email in the confirmation message",
          )}
        </p>
        <SubmitButton isConfirmed={signup.confirmed} />
        <Button
          formNoValidate
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- server actions can be ignored promises
          formAction={deleteAction}
          variant="outline"
          className="w-full max-w-sm"
        >
          {t("Delete sign up")}
        </Button>
      </div>
    </form>
  );
}

export function SignupForm(props: React.ComponentProps<typeof Form>) {
  const locale = useCurrentLocale();

  return (
    <I18nProviderClient locale={locale}>
      <Form {...props} />
    </I18nProviderClient>
  );
}
