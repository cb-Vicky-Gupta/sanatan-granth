import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { getBooks, getCategories } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All books",
  description: "Every text in the library — Vedas, Upanishads, Gita, Puranas and more. All free.",
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, books] = await Promise.all([getCategories(), getBooks(category)]);
  const active = categories.find((item) => item.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">The collection</span>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
          {active ? active.name : "Published editions"}
        </h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-body">
          {active
            ? active.subtitle
            : "Every text here can be read in full and downloaded without paying, registering or seeing a single advertisement."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-8">
        <Link
          href="/books"
          className={cn(
            "flex h-11 items-center rounded-full px-5 text-[15px] transition-colors",
            !category ? "bg-ink-2 text-cream" : "border border-line-2 text-body hover:border-brand",
          )}
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/books?category=${item.slug}`}
            className={cn(
              "flex h-11 items-center rounded-full px-5 text-[15px] transition-colors",
              category === item.slug
                ? "bg-ink-2 text-cream"
                : "border border-line-2 text-body hover:border-brand",
            )}
          >
            {item.name}
            <span className="ml-2 text-[13px] opacity-70">{item._count.books}</span>
          </Link>
        ))}
      </div>

      {books.length === 0 ? (
        <p className="pt-16 text-[17px] text-muted">
          Nothing published in this category yet. Please check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 pt-10 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
