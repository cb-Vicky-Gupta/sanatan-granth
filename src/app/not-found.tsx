import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="eyebrow">404</span>
        <h1 className="font-display text-4xl font-bold text-ink">This page is not in the library</h1>
        <p className="max-w-md text-[17px] text-body">
          The text you were looking for may have moved, or the link may be mistyped.
        </p>
        <Link
          href="/books"
          className="mt-2 flex h-12 items-center rounded-md bg-brand px-7 text-[16px] text-cream transition-colors hover:bg-brand-dark"
        >
          Browse all books
        </Link>
      </div>
    </div>
  );
}
