import "server-only";
import { revalidateTag } from "next/cache";

export const TAGS = {
  settings: "settings",
  services: "services",
  testimonials: "testimonials",
  page: (key: string) => `page:${key}`,
} as const;

/** Expire tagged public content immediately after an admin change. */
export function invalidate(...tags: string[]) {
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
}
