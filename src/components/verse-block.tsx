import Link from "next/link";

type Verse = {
  reference: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
};

export function VerseBlock({ verse }: { verse: Verse }) {
  return (
    <section className="bg-night text-[#f6ead4]">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-5 py-16 text-center lg:px-10 lg:py-20">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase">
          Verse of the day · {verse.reference}
        </span>

        <div className="deva text-xl text-white sm:text-2xl lg:text-3xl">
          {verse.sanskrit.split("\n").map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </div>

        {verse.transliteration && (
          <div className="font-display text-base italic text-[#d5bd98] sm:text-lg">
            {verse.transliteration.split("\n").map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </div>
        )}

        <p className="max-w-2xl font-display text-xl leading-relaxed italic text-[#e4cfa4] sm:text-2xl">
          {verse.translation}
        </p>

        <Link
          href="/books/bhagavad-gita"
          className="mt-2 flex h-12 items-center rounded-md border border-[#6a5233] px-7 text-[15px] text-[#e8c880] transition-colors hover:border-gold hover:text-gold"
        >
          Read the full chapter
        </Link>
      </div>
    </section>
  );
}
