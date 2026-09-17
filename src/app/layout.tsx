import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Spectral, Tiro_Devanagari_Hindi } from "next/font/google";
import { getSiteUrl } from "@/lib/seo";
import { getSettings } from "@/lib/site";
import { excerptFrom } from "@/lib/utils";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

const body = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

/**
 * Devanagari is only used inside verse blocks and Sanskrit titles, so it is not
 * preloaded — that would cost every visitor a font download before first paint.
 */
const devanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  variable: "--font-deva",
  display: "swap",
  preload: false,
  fallback: ["Noto Sans Devanagari", "serif"],
});

export const viewport: Viewport = {
  themeColor: "#9b3a1e",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * Site-wide defaults. `metadataBase` is what turns every relative OG image and
 * canonical path in the app into an absolute URL, so it has to be set here.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [settings, origin] = await Promise.all([getSettings(), getSiteUrl()]);
  const siteName = settings.siteName || "Sanatan Granth";
  const description = excerptFrom(
    settings.metaDescription ||
      "Read the Vedas, Bhagavad Gita, Upanishads and other sacred Indian texts in authentic, easy-to-read editions. Free to read, free to download.",
    160,
  );

  return {
    metadataBase: new URL(origin),
    title: {
      default: settings.metaTitle || `${siteName} — A free library of Indian scripture`,
      template: `%s · ${siteName}`,
    },
    description,
    applicationName: siteName,
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    authors: [{ name: siteName, url: origin }],
    creator: siteName,
    publisher: siteName,
    category: "Religion & Spirituality",
    manifest: "/manifest.webmanifest",
    alternates: {
      canonical: "/",
      types: { "application/rss+xml": [{ url: "/feed.xml", title: `${siteName} — journal` }] },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    /** Pasted straight from Search Console / Bing Webmaster Tools. */
    verification: {
      ...(settings.googleVerification ? { google: settings.googleVerification } : {}),
      ...(settings.bingVerification ? { other: { "msvalidate.01": settings.bingVerification } } : {}),
    },
    openGraph: {
      type: "website",
      url: origin,
      siteName,
      title: settings.metaTitle || siteName,
      description,
      locale: "en_IN",
      alternateLocale: ["hi_IN"],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle || siteName,
      description,
      ...(settings.twitterHandle ? { site: settings.twitterHandle, creator: settings.twitterHandle } : {}),
    },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${body.variable} ${devanagari.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Fonts are self-hosted by next/font, but images and uploads
            may come from anywhere — warming the connection saves a round trip. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
