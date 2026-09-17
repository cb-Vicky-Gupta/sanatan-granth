import Link from "next/link";
import { BookCover } from "@/components/book-cover";

type Props = {
  book: {
    title: string;
    slug: string;
    sanskritTitle: string;
    subtitle: string;
    coverImage: string;
    coverColor: string;
    pdfUrl: string;
    category?: { name: string } | null;
  };
};

export function BookCard({ book }: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-card transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(36,22,8,0.55)]">
      <Link href={`/books/${book.slug}`} className="block">
        <BookCover
          title={book.title}
          sanskritTitle={book.sanskritTitle}
          coverImage={book.coverImage}
          coverColor={book.coverColor}
          className="aspect-3/4"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {book.category && (
          <span className="text-[10px] tracking-[0.2em] text-[#855321] uppercase">{book.category.name}</span>
        )}
        <Link href={`/books/${book.slug}`} className="font-display text-xl font-semibold text-ink hover:text-brand">
          {book.title}
        </Link>
        <p className="text-[13px] text-muted">{book.subtitle}</p>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link
            href={`/books/${book.slug}`}
            className="flex h-10 items-center justify-center rounded-md bg-brand text-[15px] text-cream transition-colors hover:bg-brand-dark"
          >
            Read Free
          </Link>
          {book.pdfUrl ? (
            <a
              href={book.pdfUrl}
              className="text-center text-[13px] text-brand hover:text-brand-dark"
              download
            >
              Download PDF
            </a>
          ) : (
            <span className="text-center text-[13px] text-muted">PDF coming soon</span>
          )}
        </div>
      </div>
    </article>
  );
}
