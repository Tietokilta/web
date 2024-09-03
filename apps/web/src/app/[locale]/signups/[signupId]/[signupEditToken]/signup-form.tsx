"use client";

/* eslint-disable no-nested-ternary -- this is pretty cool and readable here */

import {
  Button,
  Checkbox,
  Input,
  Textarea,
  Radio,
  Card,
  type ButtonProps,
} from "@tietokilta/ui";
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

  const isMultiLabel =
    question.type === "checkbox" || question.type === "select";

  const Label = isMultiLabel ? "legend" : "label";
  const Container = isMultiLabel ? "fieldset" : "p";

  return (
    <Container className="w-full max-w-sm space-y-2" key={sharedInputProps.id}>
      <Label
        className="block"
        htmlFor={!isMultiLabel ? sharedInputProps.id : undefined}
      >
        <span>{question.question}</span>
        {!question.required && (
          <span className="text-gray-700"> ({t("optional")})</span>
        )}
      </Label>
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
    </Container>
  );
}

function StatusButton(props: Omit<ButtonProps, "disabled">) {
  const { pending } = useFormStatus();

  return <Button disabled={pending} {...props} />;
}

function ConfirmDeletePopover({
  id,
  eventTitle,
  deleteAction,
}: {
  id: string;
  eventTitle: string;
  deleteAction: typeof deleteSignUpAction;
}) {
  const t = useScopedI18n("ilmomasiina.form");
  return (
    <Card
      id={id}
      popover="auto"
      className="[&:popover-open]:flex [&:popover-open]:w-full [&:popover-open]:max-w-sm [&:popover-open]:flex-col [&:popover-open]:gap-2"
    >
      <p>
        {t(
          "Are you sure you want to delete your sign up to {eventTitle}? If you delete your sign up, you will lose your place in the queue.",
          {
            eventTitle,
          },
        )}
      </p>
      <p>
        <strong>{t("This action cannot be undone.")}</strong>
      </p>
      <Button
        type="button"
        popoverTarget={id}
        popoverTargetAction="hide"
        variant="outline"
        className="w-full max-w-sm"
      >
        {t("Cancel")}
      </Button>
      <StatusButton
        type="submit"
        formNoValidate
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- server actions can be ignored promises
        formAction={deleteAction}
        variant="destructive"
        className="w-full max-w-sm"
      >
        {t("Delete sign up")}
      </StatusButton>
    </Card>
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
                autoComplete="given-name"
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
                autoComplete="family-name"
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
              autoComplete="email"
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
        <StatusButton className="w-full max-w-sm" type="submit">
          {signup.confirmed ? t("Update") : t("Submit")}
        </StatusButton>
        <Button
          type="button"
          popoverTarget="confirm-delete"
          variant="outline"
          className="w-full max-w-sm"
        >
          {t("Delete sign up")}
        </Button>
        <ConfirmDeletePopover
          id="confirm-delete"
          eventTitle={event.title}
          deleteAction={deleteAction}
        />
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
