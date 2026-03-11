import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Impact GG",
    short_name: "ImpactGG",
    description:
      "Impact GG helps esports players, coaches, and creators showcase achievements, publish guides, and offer coaching in one focused place.",
    start_url: "/",
    display: "standalone",
    background_color: "#020817",
    theme_color: "#0f172a",
  };
}
