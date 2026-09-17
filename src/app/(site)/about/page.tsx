import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { RichText } from "@/components/rich-text";
import { getFeatures, getHomePage, getSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Who publishes this library, how texts are chosen, and why everything is free.",
};

export default async function AboutPage() {
  const [home, settings, features] = await Promise.all([getHomePage(), getSettings(), getFeatures()]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-10 lg:py-20">
      <span className="eyebrow">About</span>
      <h1 className="pt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
        {home.aboutTitle || "About this library"}
      </h1>

      <div className="grid gap-10 pt-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="flex flex-col gap-10">
          <RichText content={home.aboutBody} />

          <section className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink">How each text is presented</h2>
            <ol className="flex flex-col gap-4">
              {[
                ["Devanagari", "The verse as it is recited, with sandhi intact."],
                ["IAST transliteration", "So you can read aloud without knowing the script."],
                ["Plain translation", "In English, with Hindi being added text by text."],
                ["Commentary", "Optional, and never mixed into the translation itself."],
              ].map(([title, description], index) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-2 text-[14px] text-muted">
                    {index + 1}
                  </span>
                  <span className="text-[17px] leading-relaxed text-body">
                    <strong className="font-semibold text-ink">{title}</strong> — {description}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink">Licensing</h2>
            <p className="text-[17px] leading-relaxed text-body">{settings.footerAbout}</p>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          {home.aboutImage && (
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-line">
              <Image src={home.aboutImage} alt="" fill sizes="420px" className="object-cover" />
            </div>
          )}

          <div className="flex flex-col gap-5 rounded-2xl border border-line bg-cream-2 p-6">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ecdcbe] text-brand">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[16px] text-ink">{feature.title}</span>
                  <span className="text-[14px] text-muted">{feature.subtitle}</span>
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            className="flex h-12 items-center justify-center rounded-md bg-brand text-[16px] text-cream transition-colors hover:bg-brand-dark"
          >
            Contribute or report a mistake
          </Link>
        </aside>
      </div>
    </div>
  );
}
