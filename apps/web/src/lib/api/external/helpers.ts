import { type Dictionary } from "../../../locales/server";

export type ErrorType = keyof {
  [Property in keyof Dictionary as Property extends `errors.${infer S}`
    ? S
    : never]?: string;
};

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
