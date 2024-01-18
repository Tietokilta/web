import type { Dictionary } from "../../dictionaries";

export type ErrorType = keyof Dictionary["errors"];

export interface OkResponse<T> {
  ok: true;
  error: null;
  data: T;
}

export interface ErrorResponse {
  ok: false;
  error: ErrorType;
  data: null;
}

export type ApiResponse<T> = OkResponse<T> | ErrorResponse;

export const ok = <T>(data: T): OkResponse<T> => ({
  ok: true,
  error: null,
  data,
});

export const err = (error: ErrorType): ErrorResponse => ({
  ok: false,
  error,
  data: null,
});
