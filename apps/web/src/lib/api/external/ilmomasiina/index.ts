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
}

export interface EventQuestion {
  id: string;
  question: string;
  public: boolean;
}

export interface EventQuota {
  id: string;
  title: string;
  size: number;
  signupCount: number;
  signups?: QuotaSignup[] | null;
}

export interface EventQuotaWithSignups extends EventQuota {
  signups: QuotaSignupWithQuotaTitle[];
}

export interface QuotaSignup {
  firstName?: string | null;
  lastName?: string | null;
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

export interface IlmomasiinaErrorResponse {
  statusCode: number;
  message: string;
}

export type IlmomasiinaSignupResponse =
  | IlmomasiinaSignupSuccessResponse
  | IlmomasiinaErrorResponse;

// TODO: better env handling since next.js doesn't have that built-in
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- ideally would throw during build, but let's at least throw here if it's missing
export const baseUrl = process.env.PUBLIC_ILMOMASIINA_URL!;

export const fetchEvents = async (): Promise<
  ApiResponse<IlmomasiinaEvent[]>
> => {
  try {
    const response = await fetch(`${baseUrl}/api/events`, {
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
  } catch (error) {
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
  } catch (error) {
    return err("ilmomasiina-fetch-fail");
  }
};
