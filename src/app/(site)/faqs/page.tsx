import type { Metadata } from "next";
import Link from "next/link";
import { getFaqs } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Common questions about reading, downloading and reusing the texts in this library.",
};

export default async function FaqsPage() {
  const faqs = await getFaqs();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:py-20">
      <span className="eyebrow">Help</span>
      <h1 className="pt-3 font-display text-4xl font-bold text-ink sm:text-5xl">Frequently asked questions</h1>

      <div className="flex flex-col gap-3 pt-10">
        {faqs.map((faq) => (
          <details
            key={faq.id}
            className="group rounded-xl border border-line bg-card px-6 py-5 open:bg-cream-2"
          >
            <summary className="cursor-pointer list-none font-display text-xl font-semibold text-ink marker:hidden">
              {faq.question}
            </summary>
            <p className="pt-3 text-[17px] leading-relaxed text-body">{faq.answer}</p>
          </details>
        ))}
      </div>

      <p className="pt-10 text-[17px] text-body">
        Still stuck?{" "}
        <Link href="/contact" className="text-brand hover:text-brand-dark">
          Send us a message
        </Link>
        .
      </p>
    </div>
  );
}
