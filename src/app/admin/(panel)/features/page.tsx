import Link from "next/link";
import { Card, PageHeader, Saved } from "@/components/admin/page-header";
import { Field, Select, SubmitButton } from "@/components/admin/ui";
import { Icon, iconNames } from "@/components/icons";
import { deleteFeature, saveFeature } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function FeaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string }>;
}) {
  const { edit, saved } = await searchParams;
  const features = await prisma.feature.findMany({ orderBy: { position: "asc" } });
  const editing = features.find((feature) => feature.id === edit) ?? null;

  return (
    <div>
      <PageHeader
        title="Promises strip"
        description="The four items above the footer on the homepage and About page."
      />
      <Saved show={Boolean(saved)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {features.map((feature) => (
              <li key={feature.id} className="flex items-center gap-4 px-5 py-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream-2 text-brand">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-[16px] text-ink-2">{feature.title}</span>
                  <span className="text-[13px] text-muted">{feature.subtitle}</span>
                </span>
                <Link
                  href={`/admin/features?edit=${feature.id}`}
                  className="text-[14px] text-brand hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteFeature}>
                  <input type="hidden" name="id" value={feature.id} />
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
            {editing ? "Edit item" : "Add an item"}
          </h2>
          <form action={saveFeature} className="flex flex-col gap-4">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field label="Title" name="title" defaultValue={editing?.title} required />
            <Field label="Sub-line" name="subtitle" defaultValue={editing?.subtitle} />
            <Select
              label="Icon"
              name="icon"
              defaultValue={editing?.icon ?? "check"}
              options={iconNames.map((name) => ({ value: name, label: name }))}
            />
            <Field
              label="Sort order"
              name="position"
              type="number"
              defaultValue={editing?.position ?? features.length + 1}
            />
            <div className="flex items-center gap-3">
              <SubmitButton>{editing ? "Save" : "Add item"}</SubmitButton>
              {editing && (
                <Link href="/admin/features" className="text-[15px] text-muted hover:text-brand">
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
