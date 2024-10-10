"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import * as z from "zod";
import { getCurrentLocale, getScopedI18n } from "../../../../locales/server";
import {
  baseUrl,
  deleteSignUp,
  getSignup,
  patchSignUp,
  type IlmomasiinaSignupResponse,
} from ".";

// TODO: check if this makes any sense to introduce extra steps for signing up
// perhaps it's much better to fetch on client side directly and then redirect
export async function signUp(formData: FormData): Promise<void> {
  "use server";
  const locale = getCurrentLocale();

  const quotaId = formData.get("quotaId");
  if (!quotaId) {
    return;
  }

  const response = await fetch(`${baseUrl}/api/signups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quotaId }),
  });

  if (!response.ok) {
    return;
  }

  const data = (await response.json()) as IlmomasiinaSignupResponse;

  if ("statusCode" in data) {
    return;
  }

  revalidateTag("ilmomasiina-events");
  redirect(`/${locale}/signups/${data.id}/${data.editToken}`);
}

const saveSignUpSchema = z
  .object({
    signupId: z.string(),
    signupEditToken: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    namePublic: z.literal("on").optional(),
    email: z.string().email().optional(),
  })
  .and(z.record(z.string().or(z.string().array())));

export async function saveSignUpAction(
  currentState: unknown,
  formData: FormData,
): Promise<{
  success?: true;
  errors?: Partial<Record<string, string[]>>;
} | null> {
  "use server";

  const locale = getCurrentLocale();

  const formEntries = [...formData.entries()].reduce<
    Record<string, string | string[]>
  >((acc, [key, value]) => {
    if (value instanceof File || value === "" || value.startsWith("$ACTION")) {
      return acc;
    }

    if (key in acc) {
      acc[key] = [value].concat(acc[key]);
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
  const data = saveSignUpSchema.safeParse(formEntries);

  if (!data.success) {
    return {
      // TODO: i18n for zod validation errors
      errors: data.error.flatten().fieldErrors,
    };
  }

  const {
    signupId,
    signupEditToken,
    firstName,
    lastName,
    email,
    namePublic,
    ...otherAnswers
  } = data.data;

  const t = await getScopedI18n("errors");

  const signupResult = await getSignup(signupId, signupEditToken);
  const multipleChoiceQuestions = signupResult.data?.event.questions
    .filter((question) => question.type === "checkbox")
    .map((question) => question.id);

  const updatedSignupResult = await patchSignUp(signupId, signupEditToken, {
    id: signupId,
    answers: Object.entries(otherAnswers).map(([questionId, answer]) => ({
      questionId,
      answer:
        multipleChoiceQuestions?.includes(questionId) && !Array.isArray(answer)
          ? [answer]
          : answer,
    })),
    language: locale,
    firstName,
    lastName,
    email,
    namePublic: namePublic === "on",
  });

  if (!updatedSignupResult.ok) {
    if (updatedSignupResult.error === "ilmomasiina-validation-failed") {
      const fieldErrors = updatedSignupResult.originalError?.errors?.answers
        ? Object.fromEntries(
            Object.entries(
              updatedSignupResult.originalError.errors.answers,
            ).map(([questionId, error]) => [questionId, [error]]),
          )
        : {};

      return {
        errors: {
          _form: [
            t(updatedSignupResult.error),
            updatedSignupResult.originalError?.message,
          ].filter((x): x is string => !!x),
          ...fieldErrors,
        },
      };
    }

    return {
      errors: {
        _form: [t(updatedSignupResult.error)],
      },
    };
  }

  revalidateTag("ilmomasiina-events");
  revalidateTag("ilmomasiina-signup");

  return {
    success: true,
  };
}

const deleteSignUpSchema = z.object({
  signupId: z.string(),
  signupEditToken: z.string(),
});

export async function deleteSignUpAction(formData: FormData): Promise<void> {
  "use server";
  const locale = getCurrentLocale();
  const tp = await getScopedI18n("ilmomasiina.path");
  const data = deleteSignUpSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!data.success) {
    return;
  }

  const { signupId, signupEditToken } = data.data;

  const signupResult = await getSignup(signupId, signupEditToken);
  const deleteResult = await deleteSignUp(signupId, signupEditToken);

  if (!deleteResult.ok) {
    return;
  }

  revalidateTag("ilmomasiina-events");
  revalidateTag("ilmomasiina-signup");

  if (!signupResult.ok) {
    redirect(`/${locale}/${tp("events")}`);
  }

  redirect(`/${locale}/${tp("events")}/${signupResult.data.event.slug}`);
}
