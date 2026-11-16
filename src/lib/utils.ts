import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

type Plain = Record<string, unknown>;
const isObj = (v: unknown): v is Plain => typeof v === "object" && v !== null && !Array.isArray(v);

/** Deep merge where `override` wins; arrays are replaced, unknown keys ignored. */
export function mergeDefaults<T>(defaults: T, override: unknown): T {
  if (!isObj(defaults) || !isObj(override)) return defaults;
  const out: Plain = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const d = (defaults as Plain)[key];
    const o = override[key];
    if (o === undefined || o === null) continue;
    if (isObj(d)) out[key] = mergeDefaults(d, o);
    else if (Array.isArray(d)) out[key] = Array.isArray(o) ? o : d;
    else if (typeof o === typeof d) out[key] = o;
  }
  return out as T;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbizaccounting.ca").replace(/\/$/, "");
