import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { Icon } from "@/components/icons";
import { prisma } from "@/lib/prisma";
import { getBooks } from "@/lib/site";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [books, posts] = query
    ? await Promise.all([
        getBooks(undefined, query),
        prisma.post.findMany({
          where: {
            published: true,
            OR: [{ title: { contains: query } }, { content: { contains: query } }],
          },
          orderBy: { publishedAt: "desc" },
          take: 6,
        }),
      ])
    : [[], []];

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-10 lg:py-20">
      <span className="eyebrow">Search</span>
      <h1 className="pt-3 font-display text-4xl font-bold text-ink sm:text-5xl">Find a text</h1>

      <form action="/search" className="flex gap-3 pt-8">
        <label className="sr-only" htmlFor="q">
          Search the library
        </label>
        <div className="relative flex-1">
          <Icon name="search" className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Gita, Upanishad, Agni…"
            className="h-13 w-full rounded-md border border-line-2 bg-card py-3.5 pr-4 pl-12 text-[16px] text-ink-2 outline-none focus:border-brand"
          />
        </div>
        <button
          type="submit"
          className="h-13 rounded-md bg-brand px-7 py-3.5 text-[16px] text-cream transition-colors hover:bg-brand-dark"
        >
          Search
        </button>
      </form>

      {query && (
        <p className="pt-6 text-[15px] text-muted">
          {books.length + posts.length} result{books.length + posts.length === 1 ? "" : "s"} for “{query}”
        </p>
      )}

      {books.length > 0 && (
        <div className="grid grid-cols-2 gap-5 pt-8 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <section className="flex flex-col gap-4 pt-12">
          <h2 className="font-display text-2xl font-semibold text-ink">Posts</h2>
          <ul className="flex flex-col divide-y divide-line rounded-xl border border-line bg-card">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="block p-5 transition-colors hover:bg-cream-2">
                  <span className="text-[17px] text-ink-2">{post.title}</span>
                  <span className="block pt-1 text-[14px] text-muted">{post.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {query && books.length === 0 && posts.length === 0 && (
        <p className="pt-10 text-[17px] text-muted">
          Nothing matched that. Try a shorter word, or{" "}
          <Link href="/books" className="text-brand hover:text-brand-dark">
            browse all books
          </Link>
          .
        </p>
      )}
    </div>
  );
}
