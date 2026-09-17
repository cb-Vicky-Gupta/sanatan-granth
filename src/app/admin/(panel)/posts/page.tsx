import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Blog posts"
        description="Notes and essays shown on /blog."
        action={{ href: "/admin/posts/new", label: "Write a post" }}
      />

      <Card className="p-0">
        <ul className="divide-y divide-line">
          {posts.length === 0 && <li className="px-5 py-6 text-[15px] text-muted">No posts yet.</li>}
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-4 px-5 py-4">
              <Link href={`/admin/posts/${post.id}`} className="flex flex-1 flex-col gap-1">
                <span className="text-[16px] text-ink-2">{post.title}</span>
                <span className="text-[13px] text-muted">
                  /{post.slug} · {post.published ? formatDate(post.publishedAt) : "Draft"}
                </span>
              </Link>
              <span
                className={
                  post.published
                    ? "rounded-full bg-[#e8f0e0] px-2.5 py-1 text-[12px] text-[#2f4a22]"
                    : "rounded-full bg-[#f1ece2] px-2.5 py-1 text-[12px] text-muted"
                }
              >
                {post.published ? "Published" : "Draft"}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
