import Link from "next/link";
import { Card } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [books, published, chapters, posts, unread, messages] = await Promise.all([
    prisma.book.count(),
    prisma.book.count({ where: { published: true } }),
    prisma.chapter.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.message.count({ where: { read: false } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Books", value: books, hint: `${published} published`, href: "/admin/books" },
    { label: "Chapters", value: chapters, hint: "across all books", href: "/admin/books" },
    { label: "Blog posts", value: posts, hint: "published", href: "/admin/posts" },
    { label: "Unread messages", value: unread, hint: "from the contact form", href: "/admin/messages" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-3xl font-bold text-ink">Dashboard</h1>
        <p className="text-[15px] text-muted">Everything on the public site is edited from here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-line bg-white p-5 transition-colors hover:border-brand"
          >
            <span className="text-[13px] tracking-[0.12em] text-muted uppercase">{stat.label}</span>
            <span className="block pt-2 font-display text-4xl font-bold text-ink">{stat.value}</span>
            <span className="text-[13px] text-muted">{stat.hint}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl font-semibold text-ink">Common tasks</h2>
          <div className="flex flex-col gap-2 pt-4">
            {[
              { href: "/admin/books/new", label: "Add a new book" },
              { href: "/admin/homepage", label: "Edit the homepage hero and about section" },
              { href: "/admin/verses", label: "Change the verse of the day" },
              { href: "/admin/settings", label: "Update site name, footer and social links" },
            ].map((task) => (
              <Link
                key={task.href}
                href={task.href}
                className="rounded-md border border-line px-4 py-3 text-[15px] text-body transition-colors hover:border-brand hover:text-brand"
              >
                {task.label}
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Latest messages</h2>
            <Link href="/admin/messages" className="text-[14px] text-brand hover:text-brand-dark">
              View all
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="pt-4 text-[15px] text-muted">No messages yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line pt-2">
              {messages.map((message) => (
                <li key={message.id} className="flex flex-col gap-1 py-3">
                  <span className="flex items-center gap-2 text-[15px] text-ink-2">
                    {!message.read && <span className="h-2 w-2 rounded-full bg-brand" />}
                    {message.name}
                  </span>
                  <span className="text-[14px] text-muted">
                    {message.subject || message.body.slice(0, 60)}
                  </span>
                  <span className="text-[12px] text-muted">{formatDate(message.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
