import "server-only";
import type { Metadata } from "next";
import { getSettings } from "@/lib/site";
import { excerptFrom } from "@/lib/utils";

/**
 * Every absolute URL the site emits — canonicals, Open Graph, sitemap,
 * JSON-LD @id values — is built from this one origin. Search engines treat
 * https://example.com and https://www.example.com as different sites, so the
 * value must be the exact host you want indexed, with no trailing slash.
 */
export const FALLBACK_SITE_URL = "https://sanatangranth.in";

function normaliseOrigin(value: string | undefined | null) {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return "";
  }
}

/** Origin from the admin panel first, then the environment, then the fallback. */
export async function getSiteUrl() {
  const settings = await getSettings().catch(() => null);
  return (
    normaliseOrigin(settings?.siteUrl) ||
    normaliseOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
    normaliseOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    FALLBACK_SITE_URL
  );
}

/** Turns "/books/gita" or an already-absolute URL into an absolute URL. */
export function absoluteUrl(path: string, origin: string) {
  if (!path) return origin;
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageSeo = {
  /** Page title without the site-name suffix; the layout template adds it. */
  title?: string;
  description?: string;
  /** Site-root-relative path, e.g. "/books/bhagavad-gita". */
  path: string;
  image?: string;
  keywords?: string;
  noindex?: boolean;
  type?: "website" | "article" | "book" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

/**
 * Builds the metadata object for a page: canonical URL, Open Graph, Twitter
 * card and robots directives, all filled in from site settings where the page
 * does not override them.
 */
export async function buildMetadata(seo: PageSeo): Promise<Metadata> {
  const settings = await getSettings();
  const origin = await getSiteUrl();

  const siteName = settings.siteName || "Sanatan Granth";
  const title = seo.title?.trim() || settings.metaTitle || siteName;
  const description = excerptFrom(
    seo.description?.trim() || settings.metaDescription || settings.tagline || "",
    160,
  );
  const canonical = absoluteUrl(seo.path, origin);
  const image = absoluteUrl(
    seo.image || settings.defaultOgImage || "/opengraph-image",
    origin,
  );
  const keywords = (seo.keywords || settings.metaKeywords || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const twitterHandle = settings.twitterHandle.trim();

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical },
    robots: seo.noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: seo.type === "book" ? "article" : (seo.type ?? "website"),
      url: canonical,
      siteName,
      title,
      description,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(seo.publishedTime ? { publishedTime: seo.publishedTime } : {}),
      ...(seo.modifiedTime ? { modifiedTime: seo.modifiedTime } : {}),
      ...(seo.authors?.length ? { authors: seo.authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
    },
  };
}
