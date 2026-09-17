import { Card, PageHeader } from "@/components/admin/page-header";
import { deleteMessage, toggleMessageRead } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Messages" description="Everything sent through the contact form." />

      {messages.length === 0 ? (
        <Card>
          <p className="text-[15px] text-muted">No messages yet.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <Card key={message.id} className={message.read ? "" : "border-brand"}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] text-ink-2">
                    {message.name} ·{" "}
                    <a href={`mailto:${message.email}`} className="text-brand hover:underline">
                      {message.email}
                    </a>
                  </span>
                  <span className="text-[13px] text-muted">
                    {message.subject || "No subject"} · {formatDate(message.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <form action={toggleMessageRead}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="text-[14px] text-brand hover:underline">
                      Mark as {message.read ? "unread" : "read"}
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="text-[14px] text-[#8d3418] hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              <p className="pt-4 text-[16px] leading-relaxed whitespace-pre-line text-body">
                {message.body}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
