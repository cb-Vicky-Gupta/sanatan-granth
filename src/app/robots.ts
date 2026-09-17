import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /**
         * The admin panel and the upload endpoint must never be crawled, and
         * /search produces an unbounded number of thin, near-duplicate pages.
         */
        disallow: ["/admin", "/admin/", "/api/", "/search", "/*?q=", "/uploads/*.tmp"],
      },
      /** Ad-tech crawlers that add nothing to search ranking. */
      { userAgent: "GPTBot", disallow: "/admin" },
      { userAgent: "AhrefsBot", crawlDelay: 10, allow: "/", disallow: "/admin" },
      { userAgent: "SemrushBot", crawlDelay: 10, allow: "/", disallow: "/admin" },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
