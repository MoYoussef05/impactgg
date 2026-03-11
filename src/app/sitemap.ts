import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "http://localhost:3000";

  const routes: string[] = [
    "/",
    "/discovery",
    "/guides",
    "/coaching",
    "/games",
    "/orders",
    "/orders/coach",
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: route === "/" ? 1 : 0.5,
  }));
}
