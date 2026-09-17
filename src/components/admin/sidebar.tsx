"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LotusMark } from "@/components/icons";
import { cn } from "@/lib/utils";

const groups: Array<{ label: string; items: Array<{ href: string; label: string }> }> = [
  {
    label: "Library",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/books", label: "Books & chapters" },
      { href: "/admin/categories", label: "Categories" },
    ],
  },
  {
    label: "Homepage",
    items: [
      { href: "/admin/homepage", label: "Homepage content" },
      { href: "/admin/verses", label: "Verse of the day" },
      { href: "/admin/features", label: "Promises strip" },
    ],
  },
  {
    label: "Pages",
    items: [
      { href: "/admin/posts", label: "Blog posts" },
      { href: "/admin/faqs", label: "FAQs" },
      { href: "/admin/messages", label: "Messages" },
    ],
  },
  {
    label: "Site",
    items: [{ href: "/admin/settings", label: "Settings & password" }],
  },
];

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col gap-7 border-b border-line bg-white px-5 py-6 lg:h-screen lg:w-64 lg:overflow-y-auto lg:border-r lg:border-b-0">
      <Link href="/admin" className="flex items-center gap-3">
        <LotusMark className="h-8 w-9 text-brand" />
        <span className="flex flex-col leading-tight">
          <span className="font-display text-lg font-bold text-ink">Sanatan Granth</span>
          <span className="text-[11px] tracking-[0.12em] text-muted uppercase">Admin panel</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5">
            <span className="px-3 text-[11px] tracking-[0.18em] text-muted uppercase">{group.label}</span>
            {group.items.map((item) => {
              const active =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-[15px] transition-colors",
                    active ? "bg-cream-2 font-medium text-ink" : "text-body hover:bg-[#f7f3ea]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 border-t border-line pt-5">
        <span className="px-3 text-[13px] text-muted">Signed in as {userName}</span>
        <Link href="/" target="_blank" className="px-3 text-[14px] text-brand hover:text-brand-dark">
          View the site ↗
        </Link>
      </div>
    </aside>
  );
}
