import Link from "next/link";
import { Card, PageHeader, Saved } from "@/components/admin/page-header";
import { Field, SubmitButton, Select } from "@/components/admin/ui";
import { Icon, iconNames } from "@/components/icons";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string }>;
}) {
  const { edit, saved } = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { books: true } } },
  });
  const editing = categories.find((category) => category.id === edit) ?? null;

  return (
    <div>
      <PageHeader
        title="Categories"
        description="The round icons on the homepage and the filter chips on the books page."
      />
      <Saved show={Boolean(saved)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center gap-4 px-5 py-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream-2 text-brand">
                  <Icon name={category.icon} className="h-5 w-5" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-[16px] text-ink-2">{category.name}</span>
                  <span className="text-[13px] text-muted">
                    {category.subtitle} · {category._count.books} book
                    {category._count.books === 1 ? "" : "s"}
                  </span>
                </span>
                <Link
                  href={`/admin/categories?edit=${category.id}`}
                  className="text-[14px] text-brand hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <button type="submit" className="text-[14px] text-[#8d3418] hover:underline">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="pb-4 font-display text-xl font-semibold text-ink">
            {editing ? "Edit category" : "Add a category"}
          </h2>

          <form action={saveCategory} className="flex flex-col gap-4">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field label="Name" name="name" defaultValue={editing?.name} required />
            <Field label="Slug" name="slug" defaultValue={editing?.slug} hint="Used in /books?category=…" />
            <Field label="Sub-line" name="subtitle" defaultValue={editing?.subtitle} />
            <Select
              label="Icon"
              name="icon"
              defaultValue={editing?.icon ?? "lotus"}
              options={iconNames.map((name) => ({ value: name, label: name }))}
            />
            <Field
              label="Sort order"
              name="position"
              type="number"
              defaultValue={editing?.position ?? categories.length + 1}
            />
            <div className="flex items-center gap-3">
              <SubmitButton>{editing ? "Save" : "Add category"}</SubmitButton>
              {editing && (
                <Link href="/admin/categories" className="text-[15px] text-muted hover:text-brand">
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
