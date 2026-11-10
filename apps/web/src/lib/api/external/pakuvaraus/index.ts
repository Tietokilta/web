import { createPakuvarausClient } from "@tietokilta/pakuvaraus-client";
import { env } from "../../../../env";
import { type ApiResponse, err, ok } from "../helpers";

// Server only: pakuvaraus sends no CORS headers
export const pakuvaraus = createPakuvarausClient({
  baseUrl: env.PAKUVARAUS_URL,
});

export const RESERVATIONS_TAG = "pakuvaraus-reservations";

export interface BusySlot {
  start: string;
  end: string;
}

/**
 * Upcoming times when the van is taken. The API has no status yet, so every
 * reservation counts, including pending and cancelled ones.
 *
 * OPEN QUESTION: should pending requests show as busy? Decide here once the
 * availability endpoint returns a status.
 */
export const fetchBusySlots = async (): Promise<ApiResponse<BusySlot[]>> => {
  try {
    const { data } = await pakuvaraus.GET("/reservations", {
      fetch: (request) =>
        fetch(request, {
          next: { tags: [RESERVATIONS_TAG], revalidate: 60 },
        }),
    });
    if (!data) {
      return err("pakuvaraus-fetch-fail");
    }

    const now = new Date();
    return ok(
      data
        .filter((reservation) => new Date(reservation.end_time) > now)
        .map((reservation) => ({
          start: reservation.start_time,
          end: reservation.end_time,
        })),
    );
  } catch (_) {
    return err("pakuvaraus-fetch-fail");
  }
};
