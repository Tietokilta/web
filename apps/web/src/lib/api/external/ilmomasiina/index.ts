import type { ApiResponse } from "../helpers";
import { err, ok } from "../helpers";

export const OPEN_QUOTA_ID = "open";
export const QUEUE_QUOTA_ID = "queue";

export type IlmomasiinaResponse = IlmomasiinaEvent[];

export interface IlmomasiinaEvent {
  id: string;
  questions: EventQuestion[];
  title: string;
  slug: string;
  date?: string | null;
  endDate?: string | null;
  registrationStartDate?: string | null;
  registrationEndDate?: string | null;
  openQuotaSize: number;
  category: string;
  description: string;
  /**
   * Can be empty string
   */
  price: string;
  location: string;
  /**
   * Can be empty string
   */
  webpageUrl: string;
  /**
   * Can be empty string
   */
  facebookUrl: string;
  signupsPublic: boolean;
  quotas: EventQuota[];
  millisTillOpening?: number | null;
  registrationClosed?: boolean | null;
  nameQuestion?: boolean;
  emailQuestion?: boolean;
}

export interface EventQuestion {
  id: string;
  question: string;
  public: boolean;
  type?: "text" | "textarea" | "number" | "select" | "checkbox";
  options?: string[] | null;
  required?: boolean | null;
}

export interface EventQuota {
  id: string;
  title: string;
  size?: number | null;
  signupCount?: number;
  signups?: QuotaSignup[] | null;
}

export interface EventQuotaWithSignups extends EventQuota {
  signups: QuotaSignupWithQuotaTitle[];
}

export interface QuotaSignup {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  namePublic: boolean;
  answers: QuestionAnswer[];
  status: "in-quota" | "in-open" | "in-queue";
  position: number;
  createdAt: string;
  confirmed: boolean;
}

export interface QuestionAnswer {
  questionId: string;
  answer: string | string[];
}

export interface QuotaSignupWithQuotaTitle extends QuotaSignup {
  quotaTitle: string;
}

export interface IlmomasiinaSignupSuccessResponse {
  id: string;
  editToken: string;
}

export const ilmomasiinaFieldErrors = [
  "missing",
  "wrongType",
  "tooLong",
  "invalidEmail",
  "notANumber",
  "notAnOption",
] as const;

export type IlmomasiinaFieldError = (typeof ilmomasiinaFieldErrors)[number];

export interface IlmomasiinaErrorResponse {
  statusCode: number;
  message: string;
  errors?: {
    answers?: Record<string, IlmomasiinaFieldError>;
  };
  code?: string;
}

export type IlmomasiinaSignupResponse =
  | IlmomasiinaSignupSuccessResponse
  | IlmomasiinaErrorResponse;

export interface IlmomasiinaSignupInfo extends QuotaSignup {
  id: string;
  quota: EventQuota;
}

export interface IlmomasiinaSignupInfoResponse {
  signup: IlmomasiinaSignupInfo;
  event: IlmomasiinaEvent;
}

// TODO: better env handling since next.js doesn't have that built-in
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- ideally would throw during build, but let's at least throw here if it's missing
export const baseUrl = process.env.PUBLIC_ILMOMASIINA_URL!;

export const fetchEvents = async (
  maxAge?: number,
): Promise<ApiResponse<IlmomasiinaEvent[]>> => {
  try {
    let url = `${baseUrl}/api/events`;
    if (maxAge !== undefined) {
      url += `?${new URLSearchParams({ maxAge: String(maxAge) }).toString()}`;
    }

    const response = await fetch(url, {
      next: {
        tags: ["ilmomasiina-events"],
        revalidate: 120, // 2 minutes
      },
    });
    if (!response.ok) {
      return err("ilmomasiina-fetch-fail");
    }
    const data = (await response.json()) as IlmomasiinaResponse;

    return ok(data);
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};

export const fetchUpcomingEvents = async (): Promise<
  ApiResponse<IlmomasiinaEvent[]>
> => {
  const events = await fetchEvents();
  if (!events.ok) {
    return events;
  }

  const currentDate = new Date();
  return ok(
    events.data.filter((event) => {
      if (event.endDate) {
        const eventEndDate = new Date(event.endDate);
        return eventEndDate >= currentDate;
      }
      if (event.date) {
        const eventStartDate = new Date(event.date);
        return eventStartDate >= currentDate;
      }
      return false;
    }),
  );
};

export const fetchEvent = async (
  slug: string,
): Promise<ApiResponse<IlmomasiinaEvent>> => {
  try {
    const response = await fetch(`${baseUrl}/api/events/${slug}`, {
      next: {
        tags: ["ilmomasiina-events"],
        revalidate: 120, // 2 minutes
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        return err("ilmomasiina-event-not-found");
      }

      return err("ilmomasiina-fetch-fail");
    }
    const data = (await response.json()) as IlmomasiinaEvent;

    return ok(data);
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};

export const getSignup = async (
  signupId: string,
  signupEditToken: string,
): Promise<ApiResponse<IlmomasiinaSignupInfoResponse>> => {
  try {
    const response = await fetch(`${baseUrl}/api/signups/${signupId}`, {
      headers: {
        "x-edit-token": signupEditToken,
      },
      next: {
        tags: ["ilmomasiina-signup"],
        revalidate: 10, // 10 seconds
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return err("ilmomasiina-signup-not-found");
      }

      if (response.status === 403) {
        // invalid edit token
        return err("ilmomasiina-signup-not-found");
      }

      return err("ilmomasiina-fetch-fail");
    }

    const data = (await response.json()) as IlmomasiinaSignupInfoResponse;

    return ok(data);
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};

export const deleteSignUp = async (
  signupId: string,
  signupEditToken: string,
): Promise<ApiResponse<"ok">> => {
  try {
    const response = await fetch(`${baseUrl}/api/signups/${signupId}`, {
      method: "DELETE",
      headers: {
        "x-edit-token": signupEditToken,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return err("ilmomasiina-signup-not-found");
      }

      return err("ilmomasiina-fetch-fail");
    }

    return ok("ok");
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};

export const patchSignUp = async (
  signupId: string,
  signupEditToken: string,
  request: {
    id: string;
    answers: QuestionAnswer[];
    language: "en" | "fi";
    firstName?: string;
    lastName?: string;
    email?: string;
    namePublic?: boolean;
  },
): Promise<ApiResponse<{ id: string }, IlmomasiinaErrorResponse>> => {
  try {
    const response = await fetch(`${baseUrl}/api/signups/${signupId}`, {
      method: "PATCH",
      headers: {
        "x-edit-token": signupEditToken,
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return err("ilmomasiina-signup-not-found");
      }

      const errorData = (await response.json()) as IlmomasiinaErrorResponse;

      if (
        errorData.code === "SignupValidationError" ||
        errorData.message.startsWith("Errors validating signup") ||
        errorData.message.startsWith("Validation error") ||
        errorData.message.startsWith("Invalid answer") ||
        errorData.message.startsWith("Missing answer")
      ) {
        return err("ilmomasiina-validation-failed", {
          originalError: errorData,
        });
      }

      return err("ilmomasiina-fetch-fail");
    }

    const data = (await response.json()) as { id: string };

    return ok(data);
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};
