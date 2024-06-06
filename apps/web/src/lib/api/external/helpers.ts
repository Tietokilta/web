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
