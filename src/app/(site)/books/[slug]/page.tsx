import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { RichText } from "@/components/rich-text";
import { buildMetadata, getSiteUrl } from "@/lib/seo";
import { getBookBySlug, getSettings } from "@/lib/site";
import { bookSchema, breadcrumbSchema, graph, type Crumb } from "@/lib/structured-data";
import { excerptFrom } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: "Book not found", robots: { index: false, follow: false } };

  return buildMetadata({
    title: book.metaTitle || `${book.title}${book.subtitle ? ` — ${book.subtitle}` : ""}`,
    description:
      book.metaDescription ||
      excerptFrom(
        book.description ||
          `Read ${book.title} in full, free of charge — ${book.chapters.length} chapters in ${book.language}.`,
        158,
      ),
    path: `/books/${book.slug}`,
    image: book.ogImage || book.coverImage,
    keywords: book.keywords,
    noindex: book.noindex,
    type: "book",
    modifiedTime: book.updatedAt.toISOString(),
    ...(book.author ? { authors: [book.author] } : {}),
  });
}

export default async function BookPage({ params }: Params) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const [settings, origin] = await Promise.all([getSettings(), getSiteUrl()]);

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Books", path: "/books" },
    ...(book.category ? [{ name: book.category.name, path: `/books?category=${book.category.slug}` }] : []),
    { name: book.title, path: `/books/${book.slug}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-10 lg:py-16">
      <JsonLd data={graph([bookSchema(book, settings, origin), breadcrumbSchema(crumbs, origin)])} />

      <Breadcrumbs crumbs={crumbs} />

      <div className="grid gap-10 pt-8 lg:grid-cols-[300px_1fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-line shadow-[0_24px_50px_-34px_rgba(36,22,8,0.6)]">
            <BookCover
              title={book.title}
              sanskritTitle={book.sanskritTitle}
              coverImage={book.coverImage}
              coverColor={book.coverColor}
              className="aspect-3/4"
              sizes="300px"
            />
          </div>

          {book.chapters.length > 0 && (
            <Link
              href={`/books/${book.slug}/${book.chapters[0].number}`}
              className="flex h-12 items-center justify-center rounded-md bg-brand text-[16px] text-cream transition-colors hover:bg-brand-dark"
            >
              Start reading
            </Link>
          )}

          {book.pdfUrl ? (
            <a
              href={book.pdfUrl}
              download
              className="flex h-12 items-center justify-center gap-2 rounded-md border border-line-2 text-[16px] text-ink-2 transition-colors hover:border-brand hover:text-brand"
            >
              <Icon name="download" className="h-4 w-4" aria-hidden="true" />
              Download {book.title} (PDF)
            </a>
          ) : (
            <span className="flex h-12 items-center justify-center rounded-md border border-dashed border-line-2 text-[15px] text-muted">
              PDF coming soon
            </span>
          )}

          <dl className="flex flex-col gap-3 rounded-xl border border-line bg-card p-5 text-[15px]">
            {book.category && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Category</dt>
                <dd className="text-ink-2">{book.category.name}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Languages</dt>
              <dd className="text-right text-ink-2">{book.language}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Chapters</dt>
              <dd className="text-ink-2">{book.chapters.length || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Price</dt>
              <dd className="text-ink-2">Free</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-3">
            {book.sanskritTitle && <span className="deva text-2xl text-brand">{book.sanskritTitle}</span>}
            <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">{book.title}</h1>
            {book.subtitle && <p className="text-[17px] text-muted">{book.subtitle}</p>}
          </header>

          <RichText content={book.description} />

          {book.chapters.length > 0 && (
            <section className="flex flex-col gap-4 pt-4">
              <h2 className="font-display text-2xl font-semibold text-ink">Contents</h2>
              <ol className="flex flex-col divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
                {book.chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <Link
                      href={`/books/${book.slug}/${chapter.number}`}
                      className="flex items-center gap-4 p-5 transition-colors hover:bg-cream-2"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-2 text-[14px] text-muted">
                        {chapter.number}
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-[17px] text-ink-2">{chapter.title}</span>
                        {chapter.summary && (
                          <span className="text-[14px] text-muted">{chapter.summary}</span>
                        )}
                      </span>
                      <Icon name="arrow" className="ml-auto h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
