import { notFound } from "next/navigation";
import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { getBookBySlug, getSettings } from "@/lib/site";
import { excerptFrom } from "@/lib/utils";

export const alt = "Book cover";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: { slug: string } }) {
  const [book, settings] = await Promise.all([getBookBySlug(params.slug), getSettings()]);
  if (!book) notFound();

  return ogImage({
    eyebrow: book.category?.name ?? "Scripture",
    title: book.title,
    subtitle: book.subtitle || excerptFrom(book.description, 120),
    siteName: settings.siteName,
    footnote: book.chapters.length ? `${book.chapters.length} chapters · Free` : "Free to read",
  });
}
