import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader, Saved } from "@/components/admin/page-header";
import { ImageField } from "@/components/admin/image-field";
import {
  DangerButton,
  Field,
  Select,
  SubmitButton,
  TextArea,
  Toggle,
} from "@/components/admin/ui";
import { createBook, deleteBook, deleteChapter, saveChapter, updateBook } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; chapter?: string }>;
};

export default async function BookEditorPage({ params, searchParams }: Params) {
  const { id } = await params;
  const { saved, chapter: chapterId } = await searchParams;
  const isNew = id === "new";

  const [book, categories] = await Promise.all([
    isNew
      ? null
      : prisma.book.findUnique({
          where: { id },
          include: { chapters: { orderBy: { number: "asc" } } },
        }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!isNew && !book) notFound();

  const editingChapter = book?.chapters.find((item) => item.id === chapterId) ?? null;
  const nextNumber = (book?.chapters.at(-1)?.number ?? 0) + 1;

  return (
    <div>
      <PageHeader
        title={isNew ? "Add a book" : (book?.title ?? "")}
        description={
          isNew
            ? "Everything here appears on the book page and in the library grid."
            : `Public page: /books/${book?.slug}`
        }
      />

      <Saved show={Boolean(saved)} message={saved === "chapter" ? "Chapter saved." : "Book saved."} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:items-start">
        <Card>
          <form action={isNew ? createBook : updateBook} className="flex flex-col gap-5">
            {!isNew && <input type="hidden" name="id" value={book!.id} />}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Title" name="title" defaultValue={book?.title} required />
              <Field
                label="URL slug"
                name="slug"
                defaultValue={book?.slug}
                hint="Leave blank to build it from the title."
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Sanskrit title"
                name="sanskritTitle"
                defaultValue={book?.sanskritTitle}
                placeholder="भगवद्गीता"
              />
              <Field
                label="Subtitle"
                name="subtitle"
                defaultValue={book?.subtitle}
                placeholder="Sanskrit with translation"
              />
            </div>

            <TextArea
              label="Description"
              name="description"
              rows={10}
              defaultValue={book?.description}
              hint="Blank line starts a new paragraph. ## heading, > quote and - list also work."
            />

            <ImageField
              label="Cover image"
              name="coverImage"
              defaultValue={book?.coverImage ?? ""}
              hint="Optional. Without one, a typographic cover is drawn from the Sanskrit title and colour below."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Cover colour"
                name="coverColor"
                type="color"
                defaultValue={book?.coverColor ?? "#9b3a1e"}
              />
              <Field
                label="PDF link"
                name="pdfUrl"
                defaultValue={book?.pdfUrl}
                placeholder="/uploads/gita.pdf or https://…"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <Select
                label="Category"
                name="categoryId"
                defaultValue={book?.categoryId ?? ""}
                options={[
                  { value: "", label: "No category" },
                  ...categories.map((category) => ({ value: category.id, label: category.name })),
                ]}
              />
              <Field
                label="Languages"
                name="language"
                defaultValue={book?.language ?? "Sanskrit · Hindi · English"}
              />
              <Field
                label="Sort order"
                name="position"
                type="number"
                defaultValue={book?.position ?? 0}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Toggle
                label="Published"
                name="published"
                defaultChecked={book?.published ?? true}
                hint="Unpublished books are hidden from the site."
              />
              <Toggle
                label="Featured on the homepage"
                name="featured"
                defaultChecked={book?.featured ?? false}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SubmitButton>{isNew ? "Create book" : "Save book"}</SubmitButton>
              <Link href="/admin/books" className="text-[15px] text-muted hover:text-brand">
                Back to all books
              </Link>
            </div>
          </form>
        </Card>

        {!isNew && (
          <div className="flex flex-col gap-6">
            <Card>
              <h2 className="font-display text-xl font-semibold text-ink">
                {editingChapter ? `Edit chapter ${editingChapter.number}` : "Add a chapter"}
              </h2>

              <form action={saveChapter} className="flex flex-col gap-4 pt-4">
                <input type="hidden" name="bookId" value={book!.id} />
                {editingChapter && <input type="hidden" name="id" value={editingChapter.id} />}

                <div className="grid gap-4 sm:grid-cols-[100px_1fr]">
                  <Field
                    label="Number"
                    name="number"
                    type="number"
                    defaultValue={editingChapter?.number ?? nextNumber}
                  />
                  <Field label="Title" name="title" defaultValue={editingChapter?.title} required />
                </div>

                <Field
                  label="Sanskrit title"
                  name="sanskritTitle"
                  defaultValue={editingChapter?.sanskritTitle}
                />
                <Field label="Summary" name="summary" defaultValue={editingChapter?.summary} />
                <TextArea
                  label="Chapter text"
                  name="content"
                  rows={12}
                  defaultValue={editingChapter?.content}
                  hint="Use > at the start of a line for a Devanagari verse block."
                />

                <div className="flex flex-wrap items-center gap-3">
                  <SubmitButton>{editingChapter ? "Save chapter" : "Add chapter"}</SubmitButton>
                  {editingChapter && (
                    <Link
                      href={`/admin/books/${book!.id}`}
                      className="text-[15px] text-muted hover:text-brand"
                    >
                      Cancel
                    </Link>
                  )}
                </div>
              </form>
            </Card>

            <Card>
              <h2 className="font-display text-xl font-semibold text-ink">
                Chapters ({book!.chapters.length})
              </h2>

              {book!.chapters.length === 0 ? (
                <p className="pt-3 text-[15px] text-muted">
                  No chapters yet. Readers will still see the book page and its PDF link.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-line pt-2">
                  {book!.chapters.map((chapter) => (
                    <li key={chapter.id} className="flex items-center gap-3 py-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-2 text-[13px] text-muted">
                        {chapter.number}
                      </span>
                      <Link
                        href={`/admin/books/${book!.id}?chapter=${chapter.id}`}
                        className="flex-1 text-[15px] text-ink-2 hover:text-brand"
                      >
                        {chapter.title}
                      </Link>
                      <form action={deleteChapter}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <input type="hidden" name="bookId" value={book!.id} />
                        <button
                          type="submit"
                          className="text-[14px] text-[#8d3418] hover:underline"
                          formNoValidate
                        >
                          Delete
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h2 className="font-display text-lg font-semibold text-ink">Danger zone</h2>
              <p className="pt-2 pb-4 text-[14px] text-muted">
                Deleting a book removes its chapters too. This cannot be undone.
              </p>
              <form action={deleteBook}>
                <input type="hidden" name="id" value={book!.id} />
                <DangerButton>Delete this book</DangerButton>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
