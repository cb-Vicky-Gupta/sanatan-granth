import Image from "next/image";
import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { Icon } from "@/components/icons";
import { RichText } from "@/components/rich-text";
import { VerseBlock } from "@/components/verse-block";
import {
  getActiveVerse,
  getCategories,
  getFeaturedBooks,
  getFeatures,
  getHomePage,
} from "@/lib/site";

export default async function HomePage() {
  const [home, categories, books, verse, features] = await Promise.all([
    getHomePage(),
    getCategories(),
    getFeaturedBooks(6),
    getActiveVerse(),
    getFeatures(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={home.heroImage || "/images/hero.svg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fbeece]/90 via-[#fbeece]/70 to-transparent" />

        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-28">
          <div className="flex max-w-2xl flex-col gap-5">
            <span className="eyebrow">{home.heroEyebrow}</span>
            <h1 className="font-display text-4xl leading-[1.12] font-bold text-ink sm:text-5xl lg:text-6xl">
              {home.heroTitleLine1}
              <br />
              {home.heroTitleLine2}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-body">{home.heroSubtitle}</p>
            <div className="pt-2">
              <Link
                href={home.heroCtaHref || "/books"}
                className="inline-flex h-14 items-center gap-3 rounded-md bg-brand px-8 text-[17px] text-cream transition-colors hover:bg-brand-dark"
              >
                {home.heroCtaLabel}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-[15px] text-[#5c4527]">{home.heroNote}</p>
          </div>

          {home.heroQuote && (
            <figure className="flex max-w-xs flex-col gap-4 lg:items-end lg:text-right">
              <blockquote className="font-display text-2xl leading-snug italic text-[#55391a]">
                “{home.heroQuote}”
              </blockquote>
              <span className="h-px w-14 bg-[#8a6134]" />
            </figure>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-line bg-cream-2">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-10 sm:grid-cols-3 lg:grid-cols-6 lg:px-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/books?category=${category.slug}`}
              className="flex flex-col items-center gap-2.5 text-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#f3e4c9] text-brand transition-colors group-hover:bg-[#ecd9b5]">
                <Icon name={category.icon} className="h-6 w-6" />
              </span>
              <span className="text-[15px] text-ink-2">{category.name}</span>
              <span className="text-[13px] text-muted">{category.subtitle}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured books */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-brand" />
          <span className="eyebrow">{home.featuredEyebrow}</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">{home.featuredTitle}</h2>
            <p className="text-[16px] text-[#6b5843]">{home.featuredSubtitle}</p>
          </div>
          <Link href="/books" className="flex items-center gap-2 text-[16px] text-brand hover:text-brand-dark">
            View All Books
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 pt-9 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Verse of the day */}
      {home.verseEnabled && verse && <VerseBlock verse={verse} />}

      {/* About */}
      {home.aboutTitle && (
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-20">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">About the library</span>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">{home.aboutTitle}</h2>
            <RichText content={home.aboutBody} />
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-line-2 px-6 text-[16px] text-ink-2 transition-colors hover:border-brand hover:text-brand"
              >
                More about this project
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {home.aboutImage && (
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-line">
              <Image
                src={home.aboutImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          )}
        </section>
      )}

      {/* Promises */}
      <section className="border-y border-line bg-cream-3">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#ecdcbe] text-brand">
                <Icon name={feature.icon} className="h-5 w-5" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[16px] text-ink">{feature.title}</span>
                <span className="text-[14px] text-muted">{feature.subtitle}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
