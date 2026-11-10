"use server";

import { tz } from "@date-fns/tz";
import { isValid, parse } from "date-fns";
import { updateTag } from "next/cache";
import * as z from "zod";
import { pakuvaraus, RESERVATIONS_TAG } from ".";

// Messages are keys under "pakuvaraus.fieldError" in the locale files
const helsinkiTime = z.string().transform((value, ctx) => {
  // A datetime-local input sends wall-clock time without a zone
  const date = parse(value, "yyyy-MM-dd'T'HH:mm", new Date(), {
    in: tz("Europe/Helsinki"),
  });
  if (!isValid(date)) {
    ctx.addIssue({ code: "custom", message: "invalidTime" });
    return z.NEVER;
  }
  // A plain Date, so toISOString() gives UTC instead of the Helsinki offset
  return new Date(date.getTime());
});

const required = z.string().trim().min(1, "required");

const reservationSchema = z
  .object({
    full_name: required,
    email: z.email("invalidEmail"),
    phone_number: required,
    address: required,
    hetu: required,
    start_time: helsinkiTime,
    end_time: helsinkiTime,
    internal: z.literal("on").optional(),
    used_outside_finland: z.literal("on").optional(),
    terms_accepted: z.literal("on", "termsNotAccepted"),
  })
  .refine((data) => data.start_time > new Date(), {
    path: ["start_time"],
    message: "startInPast",
  })
  .refine((data) => data.end_time > data.start_time, {
    path: ["end_time"],
    message: "endBeforeStart",
  });

export type ReservationField = keyof z.input<typeof reservationSchema>;

export interface ReservationFormState {
  success?: true;
  error?: "invalid" | "overlap" | "failed";
  /** The API's own message when it rejects a field */
  detail?: string;
  fieldErrors?: Partial<Record<ReservationField, string[]>>;
}

export async function requestReservation(
  _state: unknown,
  formData: FormData,
): Promise<ReservationFormState> {
  const parsed = reservationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: "invalid",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { start_time, end_time, internal, used_outside_finland, ...person } =
    parsed.data;

  try {
    const { error, response } = await pakuvaraus.POST("/reservations", {
      body: {
        ...person,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
        internal: internal === "on",
        used_outside_finland: used_outside_finland === "on",
      },
    });

    if (response.ok) {
      updateTag(RESERVATIONS_TAG);
      return { success: true };
    }
    if (response.status === 409) {
      return { error: "overlap" };
    }
    if (response.status === 422 && typeof error === "string") {
      return { error: "invalid", detail: error };
    }
    return { error: "failed" };
  } catch (_) {
    return { error: "failed" };
  }
}

export type CancelState = "cancelled" | "not-found" | "failed" | null;

export async function cancelReservation(
  _state: unknown,
  formData: FormData,
): Promise<CancelState> {
  const editKey = formData.get("editKey");
  if (typeof editKey !== "string") {
    return "not-found";
  }

  try {
    const { response } = await pakuvaraus.POST(
      "/reservations/cancel/{edit_key}",
      { params: { path: { edit_key: editKey } } },
    );

    if (response.ok) {
      updateTag(RESERVATIONS_TAG);
      return "cancelled";
    }
    return response.status === 404 ? "not-found" : "failed";
  } catch (_) {
    return "failed";
  }
}
