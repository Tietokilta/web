import type { Messages } from "@locales/index";

// Error types derived from the "errors" namespace in locale files
// Only includes top-level string keys (not nested objects like "ilmo")
export type ErrorType = {
  [K in keyof Messages["errors"]]: Messages["errors"][K] extends string
    ? K
    : never;
}[keyof Messages["errors"]];

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
