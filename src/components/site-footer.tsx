import Link from "next/link";
import { LotusMark, SocialIcon } from "@/components/icons";

type Settings = {
  siteName: string;
  tagline: string;
  footerAbout: string;
  footerQuote: string;
  youtube: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
};

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
];

const helpLinks = [
  { href: "/faqs", label: "FAQs" },
  { href: "/books", label: "Download PDFs" },
  { href: "/contact", label: "Contribute a translation" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteFooter({ settings }: { settings: Settings }) {
  const socials = (["youtube", "instagram", "facebook", "twitter", "linkedin"] as const)
    .map((key) => ({ key, href: settings[key] }))
    .filter((item) => item.href);

  return (
    <footer className="bg-night-2 text-[#e6dbc7]">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <LotusMark className="h-9 w-10 text-gold" />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-xl font-bold text-[#f6ead4]">{settings.siteName}</span>
                <span className="text-[10px] tracking-[0.14em] text-[#a9977c]">{settings.tagline}</span>
              </span>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-[#b6a68c]">{settings.footerAbout}</p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs tracking-[0.2em] text-gold">QUICK LINKS</span>
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-[15px] text-[#cdbfa6] hover:text-gold">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs tracking-[0.2em] text-gold">HELP</span>
            {helpLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-[15px] text-[#cdbfa6] hover:text-gold">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs tracking-[0.2em] text-gold">FOLLOW US</span>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  aria-label={social.key}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#3d362a] text-[#cdbfa6] transition-colors hover:border-gold hover:text-gold"
                >
                  <SocialIcon name={social.key} className="h-4 w-4" />
                </a>
              ))}
            </div>
            {settings.footerQuote && (
              <p className="font-display text-lg italic text-[#b6a68c]">{settings.footerQuote}</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#332d23] pt-6 text-sm text-[#9c8d75] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {settings.siteName} · Made in India
          </span>
          <span>Every text on this site is free to read and share.</span>
        </div>
      </div>
    </footer>
  );
}
