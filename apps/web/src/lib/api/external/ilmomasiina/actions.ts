"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCurrentLocale, useScopedI18n } from "../../../../locales/client";
import {
  baseUrl,
  deleteSignUp,
  getSignup,
  patchSignUp,
  type IlmomasiinaSignupResponse,
} from ".";

export function useSignUp() {
  const router = useRouter();
  const locale = useCurrentLocale();

  async function signUp(formData: FormData): Promise<void> {
    const quotaId = formData.get("quotaId");
    console.log("quotaId", quotaId);
    if (!quotaId) {
      return;
    }
    console.log("baseUrl", baseUrl);
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

    router.push(`/${locale}/signups/${data.id}/${data.editToken}`);
  }

  return {
    signUp,
  };
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

export function useSaveSignUpAction() {
  const locale = useCurrentLocale();
  const t = useScopedI18n("errors");

  async function saveSignUpAction(
    currentState: unknown,
    formData: FormData,
  ): Promise<{
    success?: true;
    errors?: Partial<Record<string, string[]>>;
  } | null> {
    const formEntries = [...formData.entries()].reduce<
      Record<string, string | string[]>
    >((acc, [key, value]) => {
      if (
        value instanceof File ||
        value === "" ||
        value.startsWith("$ACTION")
      ) {
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

    const signupResult = await getSignup(signupId, signupEditToken);
    const multipleChoiceQuestions = signupResult.data?.event.questions
      .filter((question) => question.type === "checkbox")
      .map((question) => question.id);

    const updatedSignupResult = await patchSignUp(signupId, signupEditToken, {
      id: signupId,
      answers: Object.entries(otherAnswers).map(([questionId, answer]) => ({
        questionId,
        answer:
          multipleChoiceQuestions?.includes(questionId) &&
          !Array.isArray(answer)
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

    return {
      success: true,
    };
  }

  return {
    saveSignUpAction,
  };
}

const deleteSignUpSchema = z.object({
  signupId: z.string(),
  signupEditToken: z.string(),
});

export function useDeleteSignUpAction() {
  const router = useRouter();

  const locale = useCurrentLocale();
  const tp = useScopedI18n("ilmomasiina.path");

  async function deleteSignUpAction(formData: FormData): Promise<void> {
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

    if (!signupResult.ok) {
      router.push(`/${locale}/${tp("events")}`);
    }

    if (signupResult.data === null) {
      return;
    }

    router.push(`/${locale}/${tp("events")}/${signupResult.data.event.slug}`);
  }

  return {
    deleteSignUpAction,
  };
}
