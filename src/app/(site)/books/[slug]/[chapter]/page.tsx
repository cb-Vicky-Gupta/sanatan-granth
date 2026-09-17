import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { RichText } from "@/components/rich-text";
import { getBookBySlug } from "@/lib/site";

type Params = { params: Promise<{ slug: string; chapter: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, chapter } = await params;
  const book = await getBookBySlug(slug);
  const current = book?.chapters.find((item) => String(item.number) === chapter);
  if (!book || !current) return { title: "Chapter not found" };
  return { title: `${current.title} — ${book.title}`, description: current.summary };
}

export default async function ChapterPage({ params }: Params) {
  const { slug, chapter } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const index = book.chapters.findIndex((item) => String(item.number) === chapter);
  if (index === -1) notFound();

  const current = book.chapters[index];
  const previous = book.chapters[index - 1];
  const next = book.chapters[index + 1];

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
      <Link
        href={`/books/${book.slug}`}
        className="inline-flex items-center gap-2 text-[15px] text-brand hover:text-brand-dark"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" />
        {book.title}
      </Link>

      <header className="flex flex-col gap-3 border-b border-line pt-8 pb-8">
        <span className="eyebrow">Chapter {current.number}</span>
        {current.sanskritTitle && <span className="deva text-2xl text-brand">{current.sanskritTitle}</span>}
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{current.title}</h1>
        {current.summary && <p className="text-[17px] text-muted">{current.summary}</p>}
      </header>

      <div className="py-10">
        {current.content ? (
          <RichText content={current.content} />
        ) : (
          <p className="text-[17px] text-muted">This chapter has not been transcribed yet.</p>
        )}
      </div>

      <nav className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:justify-between">
        {previous ? (
          <Link
            href={`/books/${book.slug}/${previous.number}`}
            className="flex items-center gap-3 rounded-lg border border-line px-5 py-4 transition-colors hover:border-brand"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180 text-brand" />
            <span className="flex flex-col">
              <span className="text-[13px] text-muted">Previous</span>
              <span className="text-[16px] text-ink-2">{previous.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <Link
            href={`/books/${book.slug}/${next.number}`}
            className="flex items-center gap-3 rounded-lg border border-line px-5 py-4 text-right transition-colors hover:border-brand sm:flex-row-reverse"
          >
            <Icon name="arrow" className="h-4 w-4 text-brand" />
            <span className="flex flex-col">
              <span className="text-[13px] text-muted">Next</span>
              <span className="text-[16px] text-ink-2">{next.title}</span>
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
