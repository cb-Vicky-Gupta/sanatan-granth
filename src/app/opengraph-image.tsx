import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { getSettings } from "@/lib/site";

export const alt = "Sanatan Granth — a free library of Indian scripture";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const settings = await getSettings();
  return ogImage({
    eyebrow: "Explore · Learn · Live",
    title: settings.siteName,
    subtitle: settings.metaDescription || settings.tagline,
    siteName: settings.siteName,
  });
}
