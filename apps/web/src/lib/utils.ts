import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const localisePath = (path: string, locale: string) =>
  `/${locale}${path}` as const;
