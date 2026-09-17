import Link from "next/link";
import { Card, PageHeader, Saved } from "@/components/admin/page-header";
import { Field, SubmitButton, TextArea } from "@/components/admin/ui";
import { deleteFaq, saveFaq } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function FaqsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string }>;
}) {
  const { edit, saved } = await searchParams;
  const faqs = await prisma.faq.findMany({ orderBy: { position: "asc" } });
  const editing = faqs.find((faq) => faq.id === edit) ?? null;

  return (
    <div>
      <PageHeader title="FAQs" description="Shown on /faqs, in this order." />
      <Saved show={Boolean(saved)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {faqs.map((faq) => (
              <li key={faq.id} className="flex flex-col gap-2 px-5 py-4">
                <div className="flex items-start gap-4">
                  <span className="flex-1 text-[16px] text-ink-2">{faq.question}</span>
                  <Link
                    href={`/admin/faqs?edit=${faq.id}`}
                    className="text-[14px] text-brand hover:underline"
                  >
                    Edit
                  </Link>
                  <form action={deleteFaq}>
                    <input type="hidden" name="id" value={faq.id} />
                    <button type="submit" className="text-[14px] text-[#8d3418] hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
                <p className="text-[14px] leading-relaxed text-muted">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="pb-4 font-display text-xl font-semibold text-ink">
            {editing ? "Edit question" : "Add a question"}
          </h2>
          <form action={saveFaq} className="flex flex-col gap-4">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field label="Question" name="question" defaultValue={editing?.question} required />
            <TextArea label="Answer" name="answer" rows={6} defaultValue={editing?.answer} />
            <Field
              label="Sort order"
              name="position"
              type="number"
              defaultValue={editing?.position ?? faqs.length + 1}
            />
            <div className="flex items-center gap-3">
              <SubmitButton>{editing ? "Save" : "Add question"}</SubmitButton>
              {editing && (
                <Link href="/admin/faqs" className="text-[15px] text-muted hover:text-brand">
                  Cancel
                </Link>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
