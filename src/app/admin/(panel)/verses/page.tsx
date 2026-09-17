import Link from "next/link";
import { Card, PageHeader, Saved } from "@/components/admin/page-header";
import { Field, SubmitButton, TextArea } from "@/components/admin/ui";
import { activateVerse, deleteVerse, saveVerse } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function VersesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string }>;
}) {
  const { edit, saved } = await searchParams;
  const verses = await prisma.verse.findMany({ orderBy: { createdAt: "desc" } });
  const editing = verses.find((verse) => verse.id === edit) ?? null;

  return (
    <div>
      <PageHeader
        title="Verse of the day"
        description="Keep a pool of verses and mark one as live. Only the live verse shows on the homepage."
      />
      <Saved show={Boolean(saved)} message={saved === "active" ? "Live verse changed." : "Saved."} />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        <div className="flex flex-col gap-4">
          {verses.map((verse) => (
            <Card key={verse.id} className={verse.active ? "border-brand" : ""}>
              <div className="flex items-start justify-between gap-4">
                <span className="flex items-center gap-2 text-[13px] tracking-[0.12em] text-muted uppercase">
                  {verse.reference}
                  {verse.active && (
                    <span className="rounded-full bg-[#f6e9cf] px-2.5 py-1 text-[11px] tracking-normal text-[#855321] normal-case">
                      Live
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-3">
                  <Link
                    href={`/admin/verses?edit=${verse.id}`}
                    className="text-[14px] text-brand hover:underline"
                  >
                    Edit
                  </Link>
                  {!verse.active && (
                    <form action={activateVerse}>
                      <input type="hidden" name="id" value={verse.id} />
                      <button type="submit" className="text-[14px] text-brand hover:underline">
                        Make live
                      </button>
                    </form>
                  )}
                  <form action={deleteVerse}>
                    <input type="hidden" name="id" value={verse.id} />
                    <button type="submit" className="text-[14px] text-[#8d3418] hover:underline">
                      Delete
                    </button>
                  </form>
                </span>
              </div>

              <p className="deva pt-3 text-lg text-ink">{verse.sanskrit}</p>
              <p className="pt-2 text-[15px] leading-relaxed text-muted">{verse.translation}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="pb-4 font-display text-xl font-semibold text-ink">
            {editing ? "Edit verse" : "Add a verse"}
          </h2>
          <form action={saveVerse} className="flex flex-col gap-4">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field
              label="Reference"
              name="reference"
              defaultValue={editing?.reference}
              placeholder="Bhagavad Gita 2.47"
              required
            />
            <TextArea
              label="Sanskrit"
              name="sanskrit"
              rows={3}
              defaultValue={editing?.sanskrit}
              hint="One line per line of the verse."
            />
            <TextArea
              label="Transliteration"
              name="transliteration"
              rows={3}
              defaultValue={editing?.transliteration}
            />
            <TextArea label="Translation" name="translation" rows={4} defaultValue={editing?.translation} />
            <div className="flex items-center gap-3">
              <SubmitButton>{editing ? "Save verse" : "Add verse"}</SubmitButton>
              {editing && (
                <Link href="/admin/verses" className="text-[15px] text-muted hover:text-brand">
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
