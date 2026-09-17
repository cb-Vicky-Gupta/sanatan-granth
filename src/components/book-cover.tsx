import Image from "next/image";

type Props = {
  title: string;
  sanskritTitle?: string;
  coverImage?: string;
  coverColor?: string;
  className?: string;
  sizes?: string;
};

/**
 * Shows the uploaded cover when there is one, and falls back to a
 * typographic cover built from the book's Devanagari title and colour.
 */
export function BookCover({
  title,
  sanskritTitle,
  coverImage,
  coverColor = "#9b3a1e",
  className = "aspect-[3/4]",
  sizes = "(max-width: 768px) 45vw, 220px",
}: Props) {
  if (coverImage) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        <Image src={coverImage} alt={`Cover of ${title}`} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center p-3 ${className}`}
      style={{ backgroundColor: coverColor }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xs border border-white/35 p-3 text-center">
        {sanskritTitle && (
          <span className="deva text-lg text-[#f7dfa8] sm:text-xl">{sanskritTitle}</span>
        )}
        <span className="h-px w-6 bg-white/45" />
        <span className="font-display text-sm tracking-[0.1em] text-[#fdf3dc] uppercase">{title}</span>
      </div>
    </div>
  );
}
