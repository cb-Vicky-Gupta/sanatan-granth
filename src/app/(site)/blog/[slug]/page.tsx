import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { RichText } from "@/components/rich-text";
import { getPostBySlug } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
      <Link href="/blog" className="inline-flex items-center gap-2 text-[15px] text-brand hover:text-brand-dark">
        <Icon name="arrow" className="h-4 w-4 rotate-180" />
        All posts
      </Link>

      <header className="flex flex-col gap-4 pt-8">
        <span className="text-[13px] tracking-[0.12em] text-muted uppercase">
          {formatDate(post.publishedAt)}
        </span>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="text-xl leading-relaxed text-body">{post.excerpt}</p>}
      </header>

      {post.coverImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-line">
          <Image src={post.coverImage} alt="" fill sizes="768px" className="object-cover" priority />
        </div>
      )}

      <div className="py-10">
        <RichText content={post.content} />
      </div>
    </article>
  );
}
