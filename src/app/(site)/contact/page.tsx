import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { getSettings } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Report a mistake, contribute a translation, or ask a question about the library.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-10 lg:py-20">
      <span className="eyebrow">Contact</span>
      <h1 className="pt-3 font-display text-4xl font-bold text-ink sm:text-5xl">Write to us</h1>
      <p className="max-w-2xl pt-4 text-[17px] leading-relaxed text-body">
        Corrections are the most useful thing anyone can send. Translations, transliterations and scanned
        editions are welcome too.
      </p>

      <div className="grid gap-10 pt-10 lg:grid-cols-[1.4fr_1fr]">
        <ContactForm />

        <aside className="flex h-fit flex-col gap-5 rounded-2xl border border-line bg-cream-2 p-6">
          <h2 className="font-display text-xl font-semibold text-ink">Other ways to reach us</h2>
          {settings.contactEmail && (
            <div className="flex items-center gap-3">
              <Icon name="mail" className="h-5 w-5 shrink-0 text-brand" />
              <a href={`mailto:${settings.contactEmail}`} className="text-[16px] text-body hover:text-brand">
                {settings.contactEmail}
              </a>
            </div>
          )}
          {settings.contactPhone && (
            <div className="flex items-center gap-3">
              <Icon name="speaker" className="h-5 w-5 shrink-0 text-brand" />
              <span className="text-[16px] text-body">{settings.contactPhone}</span>
            </div>
          )}
          {settings.contactAddress && (
            <div className="flex items-center gap-3">
              <Icon name="temple" className="h-5 w-5 shrink-0 text-brand" />
              <span className="text-[16px] text-body">{settings.contactAddress}</span>
            </div>
          )}
          <p className="text-[15px] leading-relaxed text-muted">
            We are a small team and read everything, but replies can take a few days.
          </p>
        </aside>
      </div>
    </div>
  );
}
