"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, LotusMark } from "@/components/icons";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ siteName, tagline }: { siteName: string; tagline: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <LotusMark className="h-9 w-10 shrink-0 text-brand" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl font-bold text-ink-2 sm:text-2xl">{siteName}</span>
            <span className="hidden text-[10px] tracking-[0.14em] text-muted sm:block">{tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] lg:flex">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-brand",
                  active ? "text-ink-2" : "text-body/85",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search the library"
            className="grid h-11 w-11 place-items-center rounded-full text-ink-2 transition-colors hover:bg-cream-2"
          >
            <Icon name="search" className="h-5 w-5" />
          </Link>
          <Link
            href="/books"
            className="hidden h-11 items-center rounded-md bg-brand px-6 text-[15px] text-cream transition-colors hover:bg-brand-dark sm:flex"
          >
            Read Free
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full text-ink-2 transition-colors hover:bg-cream-2 lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream px-5 py-3 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex h-12 items-center border-b border-line/70 text-[16px] text-body last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
