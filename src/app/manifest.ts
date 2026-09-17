import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();

  return {
    name: settings.siteName,
    short_name: settings.siteName,
    description: settings.metaDescription || settings.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ea",
    theme_color: "#9b3a1e",
    lang: "en-IN",
    categories: ["books", "education", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
