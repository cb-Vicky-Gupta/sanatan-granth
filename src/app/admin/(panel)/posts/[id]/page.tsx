import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader, Saved } from "@/components/admin/page-header";
import { ImageField } from "@/components/admin/image-field";
import { DangerButton, Field, SubmitButton, TextArea, Toggle } from "@/components/admin/ui";
import { deletePost, savePost } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function PostEditorPage({ params, searchParams }: Params) {
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";

  const post = isNew ? null : await prisma.post.findUnique({ where: { id } });
  if (!isNew && !post) notFound();

  const publishedDate = post?.publishedAt
    ? new Date(post.publishedAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        title={isNew ? "Write a post" : (post?.title ?? "")}
        description={isNew ? undefined : `Public page: /blog/${post?.slug}`}
      />
      <Saved show={Boolean(saved)} message="Post saved." />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr] xl:items-start">
        <Card>
          <form action={savePost} className="flex flex-col gap-5">
            {!isNew && <input type="hidden" name="id" value={post!.id} />}

            <Field label="Title" name="title" defaultValue={post?.title} required />
            <Field label="Slug" name="slug" defaultValue={post?.slug} hint="Leave blank to build from the title." />
            <TextArea label="Excerpt" name="excerpt" rows={3} defaultValue={post?.excerpt} />
            <TextArea
              label="Body"
              name="content"
              rows={20}
              defaultValue={post?.content}
              hint="Blank line for a new paragraph. ## heading, > quote and - list also work."
            />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SubmitButton>{isNew ? "Create post" : "Save post"}</SubmitButton>
              <Link href="/admin/posts" className="text-[15px] text-muted hover:text-brand">
                Back to all posts
              </Link>
            </div>
          </form>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="pb-4 font-display text-lg font-semibold text-ink">Publishing</h2>
            <p className="pb-4 text-[14px] text-muted">
              These fields belong to the form on the left — save there once you have set them.
            </p>
            <div className="flex flex-col gap-4">
              <Toggle
                label="Published"
                name="published"
                defaultChecked={post?.published ?? false}
                hint="Drafts are hidden from /blog."
              />
              <Field label="Publish date" name="publishedAt" type="date" defaultValue={publishedDate} />
              <ImageField label="Cover image" name="coverImage" defaultValue={post?.coverImage ?? ""} />
            </div>
          </Card>

          {!isNew && (
            <Card>
              <h2 className="font-display text-lg font-semibold text-ink">Danger zone</h2>
              <p className="pt-2 pb-4 text-[14px] text-muted">This cannot be undone.</p>
              <form action={deletePost}>
                <input type="hidden" name="id" value={post!.id} />
                <DangerButton>Delete this post</DangerButton>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
