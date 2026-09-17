import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * A complete sitemap built from the database: static pages, every published
 * book, every chapter of every book, every category listing and every post.
 * Priorities reflect the real shape of the site — the library and the books
 * are what should rank, the utility pages are support.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteUrl();

  const [books, posts, categories] = await Promise.all([
    prisma.book.findMany({
      where: { published: true, noindex: false },
      select: { slug: true, updatedAt: true, chapters: { select: { number: true } } },
      orderBy: { position: "asc" },
    }),
    prisma.post.findMany({
      where: { published: true, noindex: false },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.category.findMany({ select: { slug: true }, orderBy: { position: "asc" } }),
  ]);

  const newestBook = books.reduce<Date | null>(
    (latest, book) => (!latest || book.updatedAt > latest ? book.updatedAt : latest),
    null,
  );
  const newestPost = posts[0]?.updatedAt ?? null;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, changeFrequency: "daily", priority: 1, lastModified: newestBook ?? new Date() },
    { url: `${origin}/books`, changeFrequency: "daily", priority: 0.9, lastModified: newestBook ?? new Date() },
    { url: `${origin}/blog`, changeFrequency: "weekly", priority: 0.7, lastModified: newestPost ?? new Date() },
    { url: `${origin}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/faqs`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${origin}/books?category=${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: newestBook ?? new Date(),
  }));

  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${origin}/books/${book.slug}`,
    lastModified: book.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const chapterPages: MetadataRoute.Sitemap = books.flatMap((book) =>
    book.chapters.map((chapter) => ({
      url: `${origin}/books/${book.slug}/${chapter.number}`,
      lastModified: book.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${origin}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...bookPages, ...chapterPages, ...postPages];
}
