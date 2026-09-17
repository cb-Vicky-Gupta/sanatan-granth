import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: [{ position: "asc" }, { title: "asc" }],
    include: { category: true, _count: { select: { chapters: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Books & chapters"
        description="Add a text, edit its description, upload a cover and write its chapters."
        action={{ href: "/admin/books/new", label: "Add a book" }}
      />

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-line bg-[#faf7f0] text-[13px] tracking-[0.1em] text-muted uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">Book</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Category</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Chapters</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {books.map((book) => (
              <tr key={book.id} className="transition-colors hover:bg-[#faf7f0]">
                <td className="px-5 py-4">
                  <Link href={`/admin/books/${book.id}`} className="flex items-center gap-4">
                    <span className="w-12 shrink-0 overflow-hidden rounded-sm">
                      <BookCover
                        title={book.title}
                        sanskritTitle={book.sanskritTitle}
                        coverImage={book.coverImage}
                        coverColor={book.coverColor}
                        className="aspect-3/4"
                        sizes="48px"
                      />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[16px] text-ink-2">{book.title}</span>
                      <span className="text-[13px] text-muted">/{book.slug}</span>
                    </span>
                  </Link>
                </td>
                <td className="hidden px-5 py-4 text-[15px] text-body sm:table-cell">
                  {book.category?.name ?? "—"}
                </td>
                <td className="hidden px-5 py-4 text-[15px] text-body md:table-cell">
                  {book._count.chapters}
                </td>
                <td className="px-5 py-4">
                  <span className="flex flex-wrap gap-1.5">
                    <span
                      className={
                        book.published
                          ? "rounded-full bg-[#e8f0e0] px-2.5 py-1 text-[12px] text-[#2f4a22]"
                          : "rounded-full bg-[#f1ece2] px-2.5 py-1 text-[12px] text-muted"
                      }
                    >
                      {book.published ? "Published" : "Draft"}
                    </span>
                    {book.featured && (
                      <span className="rounded-full bg-[#f6e9cf] px-2.5 py-1 text-[12px] text-[#855321]">
                        Featured
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
