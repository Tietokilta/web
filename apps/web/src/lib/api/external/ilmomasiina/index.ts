import {
  getLocalizedEvent,
  getLocalizedEventListItem,
  getLocalizedSignup,
} from "@tietokilta/ilmomasiina-client/dist/utils/localizedEvent";
import {
  EDIT_TOKEN_HEADER,
  ErrorCode,
  type SignupValidationError,
  type ErrorResponse,
  type SignupForEditResponse,
  type SignupUpdateBody,
  type SignupUpdateResponse,
  type UserEventListResponse,
  type UserEventResponse,
  type StartPaymentResponse,
} from "@tietokilta/ilmomasiina-models";
import type { ApiResponse } from "../helpers";
import { err, ok } from "../helpers";

// TODO: better env handling since next.js doesn't have that built-in
export const baseUrl =
  process.env.NEXT_PUBLIC_ILMOMASIINA_URL ?? "https://ilmo.tietokilta.fi";
// In prod, the NEXT_PUBLIC_ILMOMASIINA_URL is empty probably because
// it needs to be set when building the docker image.

export const fetchEvents = async (
  locale: string,
  maxAge?: number,
): Promise<ApiResponse<UserEventListResponse>> => {
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
    const data = (await response.json()) as UserEventListResponse;

    const localized = data.map((event) =>
      getLocalizedEventListItem(event, locale),
    );

    return ok(localized);
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};

export const fetchUpcomingEvents = async (
  locale: string,
): Promise<ApiResponse<UserEventListResponse>> => {
  const events = await fetchEvents(locale);
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
  locale: string,
): Promise<ApiResponse<UserEventResponse>> => {
  try {
    const response = await fetch(`${baseUrl}/api/events/${slug}`, {
      next: {
        tags: ["ilmomasiina-events"],
        revalidate: 30, // 30 seconds
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        return err("ilmomasiina-event-not-found");
      }

      return err("ilmomasiina-fetch-fail");
    }
    const data = (await response.json()) as UserEventResponse;

    const localized = getLocalizedEvent(data, locale);

    return ok(localized);
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};

export const getSignup = async (
  signupId: string,
  signupEditToken: string,
  locale: string,
): Promise<ApiResponse<SignupForEditResponse>> => {
  try {
    const response = await fetch(`${baseUrl}/api/signups/${signupId}`, {
      headers: {
        "x-edit-token": signupEditToken,
      },
      cache: "no-store", // disabled cache to ensure payment status is up to date
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

    const data = (await response.json()) as SignupForEditResponse;

    const localized: typeof data = {
      event: getLocalizedEvent(data.event, locale),
      signup: getLocalizedSignup(data, locale),
    };

    return ok(localized);
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
        [EDIT_TOKEN_HEADER]: signupEditToken,
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
  request: SignupUpdateBody,
): Promise<ApiResponse<SignupUpdateResponse, SignupValidationError>> => {
  try {
    const response = await fetch(`${baseUrl}/api/signups/${signupId}`, {
      method: "PATCH",
      headers: {
        [EDIT_TOKEN_HEADER]: signupEditToken,
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return err("ilmomasiina-signup-not-found");
      }

      const errorData = (await response.json()) as ErrorResponse;

      if (errorData.code === ErrorCode.SIGNUP_VALIDATION_ERROR) {
        return err("ilmomasiina-validation-failed", {
          originalError: errorData as SignupValidationError,
        });
      }

      return err("ilmomasiina-fetch-fail");
    }

    const data = (await response.json()) as SignupUpdateResponse;

    return ok(data);
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};

export const startPayment = async (
  signupId: string,
  signupEditToken: string,
): Promise<ApiResponse<StartPaymentResponse, ErrorResponse>> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/signups/${signupId}/payment/start`,
      {
        method: "POST",
        headers: {
          [EDIT_TOKEN_HEADER]: signupEditToken,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return err("ilmomasiina-signup-not-found");
      }

      const errorData = (await response.json()) as ErrorResponse;

      return err("ilmomasiina-fetch-fail", {
        originalError: errorData,
      });
    }

    const data = (await response.json()) as StartPaymentResponse;

    return ok(data);
  } catch (_) {
    return err("ilmomasiina-fetch-fail");
  }
};

export const completePayment = async (
  signupId: string,
  signupEditToken: string,
): Promise<ApiResponse<"ok">> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/signups/${signupId}/payment/complete`,
      {
        method: "POST",
        headers: {
          [EDIT_TOKEN_HEADER]: signupEditToken,
        },
      },
    );

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
