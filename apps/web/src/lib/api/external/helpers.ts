// Error types matching the keys in messages/en.json under "errors"
export type ErrorType =
  | "ilmomasiina-event-not-found"
  | "ilmomasiina-fetch-fail"
  | "ilmomasiina-ilmo-missing-quota-id"
  | "ilmomasiina-signup-not-found"
  | "ilmomasiina-unknown-error"
  | "ilmomasiina-validation-failed";

export interface OkResponse<T> {
  ok: true;
  error: null;
  data: T;
}

export interface ErrorResponse<TOriginalError = unknown> {
  ok: false;
  error: ErrorType;
  originalError?: TOriginalError;
  data: null;
}

export type ApiResponse<T, E = unknown> = OkResponse<T> | ErrorResponse<E>;

export const ok = <T>(data: T): OkResponse<T> => ({
  ok: true,
  error: null,
  data,
});

export const err = <TOriginalError = unknown>(
  error: ErrorType,
  options: { originalError?: TOriginalError } = {},
): ErrorResponse<TOriginalError> => ({
  ok: false,
  error,
  data: null,
  originalError: options.originalError,
});
