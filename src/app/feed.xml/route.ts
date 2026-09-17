import { getPosts, getSettings } from "@/lib/site";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { excerptFrom } from "@/lib/utils";

export const dynamic = "force-dynamic";

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * RSS for the journal. Feeds are not a ranking factor on their own, but they
 * get new posts in front of aggregators and readers quickly, which is how
 * early links happen.
 */
export async function GET() {
  const [settings, posts, origin] = await Promise.all([getSettings(), getPosts(30), getSiteUrl()]);
  const siteName = settings.siteName || "Sanatan Granth";
  const updated = posts[0]?.updatedAt ?? new Date();

  const items = posts
    .map((post) => {
      const url = `${origin}/blog/${post.slug}`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(excerptFrom(post.excerpt || post.content, 300))}</description>
      <pubDate>${(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate>
${post.coverImage ? `      <enclosure url="${escape(absoluteUrl(post.coverImage, origin))}" type="image/jpeg" />\n` : ""}    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteName)} — journal</title>
    <link>${origin}</link>
    <description>${escape(settings.metaDescription || settings.tagline)}</description>
    <language>en-in</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
