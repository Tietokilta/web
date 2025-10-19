"use client";

/* eslint-disable no-nested-ternary -- this is pretty cool and readable here */

import {
  QuestionType,
  SignupFieldError,
  type UserEventResponse,
  type SignupForEditResponse,
} from "@tietokilta/ilmomasiina-models";
import {
  Button,
  Checkbox,
  Input,
  Textarea,
  Radio,
  Card,
  type ButtonProps,
  buttonVariants,
} from "@tietokilta/ui";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect } from "react";
import NextForm from "next/form";
import Link from "next/link";
import {
  useDeleteSignUpAction,
  useSaveSignUpAction,
} from "@lib/api/external/ilmomasiina/actions";
import { useCurrentLocale, useScopedI18n } from "@locales/client";
import { cn } from "@lib/utils";

type FieldErrorI18n = ReturnType<typeof useScopedI18n>;

function renderError(error: string, t: FieldErrorI18n) {
  const isFieldError = error in SignupFieldError;

  if (isFieldError) {
    return t(error as SignupFieldError);
  }

  return error;
}

function renderErrors(errors: string[], t: FieldErrorI18n) {
  return errors.map((e) => renderError(e, t)).join(", ");
}

function InputRow({
  question,
  defaultValue,
  errors,
}: {
  question: UserEventResponse["questions"][number];
  defaultValue?: string[] | string;
  errors?: string[];
}) {
  const t = useScopedI18n("ilmomasiina.form");
  const tfe = useScopedI18n("ilmomasiina.form.fieldError");

  const sharedInputProps = {
    id: `question-${question.id}`,
    name: question.id,
    required: question.required,
    defaultValue,
    "aria-invalid": !!errors?.length,
  };

  const isMultiLabel =
    question.type === QuestionType.CHECKBOX ||
    question.type === QuestionType.SELECT;

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
      {question.type === QuestionType.CHECKBOX ? (
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
      ) : question.type === QuestionType.SELECT ? (
        <div className="grid gap-2">
          {(question.options ?? []).map((option) => (
            <p key={option} className="flex items-center space-x-2">
              <Radio
                id={`radio-${question.id}-option-${option}`}
                value={option}
                required={question.required}
                defaultChecked={defaultValue === option}
                name={question.id}
              />
              <label htmlFor={`radio-${question.id}-option-${option}`}>
                {option}
              </label>
            </p>
          ))}
        </div>
      ) : question.type === QuestionType.TEXT_AREA ? (
        <Textarea {...sharedInputProps} />
      ) : question.type === QuestionType.NUMBER ? (
        <Input type="number" {...sharedInputProps} />
      ) : (
        <Input type="text" {...sharedInputProps} />
      )}

      {question.public ? (
        <span className="block text-gray-700">
          ({t("Shown in the public list of sign ups")})
        </span>
      ) : null}
      {errors?.length ? (
        <span aria-live="polite" className="block text-red-600">
          {renderErrors(errors, tfe)}
        </span>
      ) : null}
    </Container>
  );
}

function StatusButton({ disabled, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- it's on purpose to overwrite false in case it's pending
  return <Button disabled={disabled || pending} {...props} />;
}

function ConfirmDeletePopover({
  id,
  eventTitle,
  deleteAction,
}: {
  id: string;
  eventTitle: string;
  deleteAction: ReturnType<typeof useDeleteSignUpAction>["deleteSignUpAction"];
}) {
  const t = useScopedI18n("ilmomasiina.form");
  return (
    <Card
      id={id}
      popover="auto"
      className="[&:popover-open]:inset-0 [&:popover-open]:m-auto [&:popover-open]:flex [&:popover-open]:h-fit [&:popover-open]:w-full [&:popover-open]:max-w-sm [&:popover-open]:flex-col [&:popover-open]:gap-2"
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
      <input
        type="button"
        popoverTarget={id}
        popoverTargetAction="hide"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full max-w-sm cursor-pointer",
        )}
        value={t("Cancel")}
      />
      <StatusButton
        type="submit"
        formNoValidate
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
  event: SignupForEditResponse["event"];
  signup: SignupForEditResponse["signup"];
  saveAction: ReturnType<typeof useSaveSignUpAction>["saveSignUpAction"];
  deleteAction: ReturnType<typeof useDeleteSignUpAction>["deleteSignUpAction"];
}) {
  const locale = useCurrentLocale();
  const t = useScopedI18n("ilmomasiina.form");
  const tp = useScopedI18n("ilmomasiina.path");
  const ta = useScopedI18n("action");
  const [state, formAction] = useActionState(saveAction, null);
  const isSignupPeriodEnded =
    !!event.registrationEndDate &&
    new Date(event.registrationEndDate) < new Date();

  // On first render, scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

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
    <NextForm
      action={formAction}
      className="w-full max-w-prose space-y-4 overflow-x-clip rounded-md border-2 border-gray-900 p-4 py-6 shadow-solid md:px-6 md:py-8"
    >
      <input type="hidden" name="signupId" value={signupId} />
      <input type="hidden" name="signupEditToken" value={signupEditToken} />

      <div className="flex flex-col items-center gap-4 *:scroll-mt-24">
        <p data-form-status className="w-full max-w-sm" aria-live="polite">
          <Link href={`/${locale}/${tp("events")}/${event.slug}`}>
            <Button variant="backLink">{ta("Back")}</Button>
          </Link>
          {state?.success ? (
            <p className="text-green-600">{t("Sign up saved")}</p>
          ) : null}
        </p>

        {state?.errors?._form ? (
          <p
            data-form-status
            className="w-full max-w-sm text-red-600"
            aria-live="polite"
          >
            {state.errors._form.join(", ")}
          </p>
        ) : null}

        {event.nameQuestion ? (
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
        ) : null}
        {event.emailQuestion ? (
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
        ) : null}
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
        <p
          className={cn(
            "w-full max-w-sm",
            isSignupPeriodEnded && "text-red-600",
          )}
        >
          {isSignupPeriodEnded
            ? t(
                "Your signup cannot be changed anymore as the signup for the event has closed",
              )
            : t(
                "You can edit your sign up or delete it later from this page, which will be sent to your email in the confirmation message",
              )}
        </p>
        <StatusButton
          disabled={isSignupPeriodEnded}
          className="w-full max-w-sm"
          type="submit"
        >
          {signup.confirmed ? t("Update") : t("Submit")}
        </StatusButton>
        <input
          type="button"
          disabled={isSignupPeriodEnded}
          popoverTarget="confirm-delete"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full max-w-sm cursor-pointer",
          )}
          value={t("Delete sign up")}
        />
        <ConfirmDeletePopover
          id="confirm-delete"
          eventTitle={event.title}
          deleteAction={deleteAction}
        />
      </div>
    </NextForm>
  );
}

export function SignupForm(
  props: Omit<React.ComponentProps<typeof Form>, "saveAction" | "deleteAction">,
) {
  const { deleteSignUpAction } = useDeleteSignUpAction();
  const { saveSignUpAction } = useSaveSignUpAction();

  return (
    <Form
      {...props}
      saveAction={saveSignUpAction}
      deleteAction={deleteSignUpAction}
    />
  );
}
