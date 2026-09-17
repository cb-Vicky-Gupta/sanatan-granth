import type { Metadata } from "next";
import { Cormorant_Garamond, Spectral, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const devanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  variable: "--font-deva",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sanatan Granth — A free library of Indian scripture",
    template: "%s · Sanatan Granth",
  },
  description:
    "Read the Vedas, Bhagavad Gita, Upanishads and other sacred Indian texts in authentic, easy-to-read editions. Free to read, free to download.",
  openGraph: {
    title: "Sanatan Granth",
    description:
      "A free, open library of Indian scripture — Sanskrit, transliteration and a plain translation, side by side.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${devanagari.variable}`}>
      <body>{children}</body>
    </html>
  );
}
