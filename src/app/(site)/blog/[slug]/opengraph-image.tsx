import { notFound } from "next/navigation";
import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { getPostBySlug, getSettings } from "@/lib/site";
import { excerptFrom } from "@/lib/utils";

export const alt = "Article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: { slug: string } }) {
  const [post, settings] = await Promise.all([getPostBySlug(params.slug), getSettings()]);
  if (!post) notFound();

  return ogImage({
    eyebrow: "From the journal",
    title: post.title,
    subtitle: excerptFrom(post.excerpt || post.content, 130),
    siteName: settings.siteName,
    footnote: "Read the full note",
  });
}
