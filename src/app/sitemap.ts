import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<[string, number]> = [
    ["", 1],
    ["/services", 0.9],
    ["/about", 0.8],
    ["/contact", 0.8],
    ["/testimonials", 0.6],
  ];
  return routes.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
