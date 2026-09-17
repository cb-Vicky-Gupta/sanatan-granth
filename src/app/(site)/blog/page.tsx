import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on reading Indian scripture — where to start, how translations are chosen, and why.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 lg:py-20">
      <span className="eyebrow">Writing</span>
      <h1 className="pt-3 font-display text-4xl font-bold text-ink sm:text-5xl">From the reading room</h1>

      {posts.length === 0 ? (
        <p className="pt-10 text-[17px] text-muted">No posts published yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-line pt-10">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col gap-4 py-8 sm:flex-row sm:gap-8">
              {post.coverImage && (
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-line sm:w-56">
                  <Image src={post.coverImage} alt="" fill sizes="224px" className="object-cover" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <span className="text-[13px] tracking-[0.12em] text-muted uppercase">
                  {formatDate(post.publishedAt)}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-display text-2xl font-semibold text-ink hover:text-brand"
                >
                  {post.title}
                </Link>
                <p className="text-[17px] leading-relaxed text-body">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
