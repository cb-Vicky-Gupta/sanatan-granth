"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

/* ---------------------------------------------------------------- helpers */

const text = (form: FormData, key: string, fallback = "") =>
  ((form.get(key) as string | null) ?? fallback).trim();

const bool = (form: FormData, key: string) => form.get(key) === "on";

const int = (form: FormData, key: string, fallback = 0) => {
  const value = Number.parseInt(text(form, key), 10);
  return Number.isFinite(value) ? value : fallback;
};

function refreshPublicPages() {
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------------- auth */

export type LoginState = { error: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = text(form, "email").toLowerCase();
  const password = text(form, "password");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Those details do not match an account." };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(form: FormData) {
  const user = await requireAdmin();
  const current = text(form, "currentPassword");
  const next = text(form, "newPassword");

  const record = await prisma.user.findUnique({ where: { id: user.id } });
  if (!record || !(await verifyPassword(current, record.passwordHash))) {
    redirect("/admin/settings?error=password");
  }
  if (next.length < 8) redirect("/admin/settings?error=short");

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) },
  });
  redirect("/admin/settings?saved=password");
}

/* -------------------------------------------------------------- home page */

export async function saveHomePage(form: FormData) {
  await requireAdmin();

  await prisma.homePage.upsert({
    where: { id: 1 },
    update: {
      heroEyebrow: text(form, "heroEyebrow"),
      heroTitleLine1: text(form, "heroTitleLine1"),
      heroTitleLine2: text(form, "heroTitleLine2"),
      heroSubtitle: text(form, "heroSubtitle"),
      heroImage: text(form, "heroImage"),
      heroCtaLabel: text(form, "heroCtaLabel"),
      heroCtaHref: text(form, "heroCtaHref"),
      heroNote: text(form, "heroNote"),
      heroQuote: text(form, "heroQuote"),
      featuredEyebrow: text(form, "featuredEyebrow"),
      featuredTitle: text(form, "featuredTitle"),
      featuredSubtitle: text(form, "featuredSubtitle"),
      verseEnabled: bool(form, "verseEnabled"),
      aboutTitle: text(form, "aboutTitle"),
      aboutBody: text(form, "aboutBody"),
      aboutImage: text(form, "aboutImage"),
    },
    create: { id: 1 },
  });

  refreshPublicPages();
  redirect("/admin/homepage?saved=1");
}

/* --------------------------------------------------------------- settings */

export async function saveSettings(form: FormData) {
  await requireAdmin();

  await prisma.setting.upsert({
    where: { id: 1 },
    update: {
      siteName: text(form, "siteName"),
      tagline: text(form, "tagline"),
      footerAbout: text(form, "footerAbout"),
      footerQuote: text(form, "footerQuote"),
      contactEmail: text(form, "contactEmail"),
      contactPhone: text(form, "contactPhone"),
      contactAddress: text(form, "contactAddress"),
      youtube: text(form, "youtube"),
      instagram: text(form, "instagram"),
      facebook: text(form, "facebook"),
      twitter: text(form, "twitter"),
      linkedin: text(form, "linkedin"),
    },
    create: { id: 1 },
  });

  refreshPublicPages();
  redirect("/admin/settings?saved=1");
}

/* ------------------------------------------------------------------ books */

export async function createBook(form: FormData) {
  await requireAdmin();
  const title = text(form, "title");
  const slug = slugify(text(form, "slug") || title);

  const book = await prisma.book.create({
    data: {
      title,
      slug,
      sanskritTitle: text(form, "sanskritTitle"),
      subtitle: text(form, "subtitle"),
      description: text(form, "description"),
      coverImage: text(form, "coverImage"),
      coverColor: text(form, "coverColor", "#9b3a1e"),
      pdfUrl: text(form, "pdfUrl"),
      language: text(form, "language", "Sanskrit · Hindi · English"),
      featured: bool(form, "featured"),
      published: bool(form, "published"),
      position: int(form, "position"),
      categoryId: text(form, "categoryId") || null,
    },
  });

  refreshPublicPages();
  redirect(`/admin/books/${book.id}?saved=1`);
}

export async function updateBook(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title");

  await prisma.book.update({
    where: { id },
    data: {
      title,
      slug: slugify(text(form, "slug") || title),
      sanskritTitle: text(form, "sanskritTitle"),
      subtitle: text(form, "subtitle"),
      description: text(form, "description"),
      coverImage: text(form, "coverImage"),
      coverColor: text(form, "coverColor", "#9b3a1e"),
      pdfUrl: text(form, "pdfUrl"),
      language: text(form, "language", "Sanskrit · Hindi · English"),
      featured: bool(form, "featured"),
      published: bool(form, "published"),
      position: int(form, "position"),
      categoryId: text(form, "categoryId") || null,
    },
  });

  refreshPublicPages();
  redirect(`/admin/books/${id}?saved=1`);
}

export async function deleteBook(form: FormData) {
  await requireAdmin();
  await prisma.book.delete({ where: { id: text(form, "id") } });
  refreshPublicPages();
  redirect("/admin/books");
}

/* --------------------------------------------------------------- chapters */

export async function saveChapter(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const bookId = text(form, "bookId");

  const data = {
    number: int(form, "number", 1),
    title: text(form, "title"),
    sanskritTitle: text(form, "sanskritTitle"),
    summary: text(form, "summary"),
    content: text(form, "content"),
  };

  if (id) {
    await prisma.chapter.update({ where: { id }, data });
  } else {
    await prisma.chapter.create({ data: { ...data, bookId } });
  }

  refreshPublicPages();
  redirect(`/admin/books/${bookId}?saved=chapter`);
}

export async function deleteChapter(form: FormData) {
  await requireAdmin();
  const bookId = text(form, "bookId");
  await prisma.chapter.delete({ where: { id: text(form, "id") } });
  refreshPublicPages();
  redirect(`/admin/books/${bookId}`);
}

/* ------------------------------------------------------------- categories */

export async function saveCategory(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const name = text(form, "name");

  const data = {
    name,
    slug: slugify(text(form, "slug") || name),
    subtitle: text(form, "subtitle"),
    icon: text(form, "icon", "lotus"),
    position: int(form, "position"),
  };

  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }

  refreshPublicPages();
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(form: FormData) {
  await requireAdmin();
  await prisma.category.delete({ where: { id: text(form, "id") } });
  refreshPublicPages();
  redirect("/admin/categories");
}

/* --------------------------------------------------------------- features */

export async function saveFeature(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const data = {
    title: text(form, "title"),
    subtitle: text(form, "subtitle"),
    icon: text(form, "icon", "check"),
    position: int(form, "position"),
  };

  if (id) {
    await prisma.feature.update({ where: { id }, data });
  } else {
    await prisma.feature.create({ data });
  }

  refreshPublicPages();
  redirect("/admin/features?saved=1");
}

export async function deleteFeature(form: FormData) {
  await requireAdmin();
  await prisma.feature.delete({ where: { id: text(form, "id") } });
  refreshPublicPages();
  redirect("/admin/features");
}

/* ----------------------------------------------------------------- verses */

export async function saveVerse(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const data = {
    reference: text(form, "reference"),
    sanskrit: text(form, "sanskrit"),
    transliteration: text(form, "transliteration"),
    translation: text(form, "translation"),
  };

  if (id) {
    await prisma.verse.update({ where: { id }, data });
  } else {
    await prisma.verse.create({ data });
  }

  refreshPublicPages();
  redirect("/admin/verses?saved=1");
}

export async function activateVerse(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  await prisma.$transaction([
    prisma.verse.updateMany({ data: { active: false } }),
    prisma.verse.update({ where: { id }, data: { active: true } }),
  ]);
  refreshPublicPages();
  redirect("/admin/verses?saved=active");
}

export async function deleteVerse(form: FormData) {
  await requireAdmin();
  await prisma.verse.delete({ where: { id: text(form, "id") } });
  refreshPublicPages();
  redirect("/admin/verses");
}

/* ------------------------------------------------------------------- faqs */

export async function saveFaq(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const data = {
    question: text(form, "question"),
    answer: text(form, "answer"),
    position: int(form, "position"),
  };

  if (id) {
    await prisma.faq.update({ where: { id }, data });
  } else {
    await prisma.faq.create({ data });
  }

  refreshPublicPages();
  redirect("/admin/faqs?saved=1");
}

export async function deleteFaq(form: FormData) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id: text(form, "id") } });
  refreshPublicPages();
  redirect("/admin/faqs");
}

/* ------------------------------------------------------------------ posts */

export async function savePost(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title");
  const published = bool(form, "published");

  const data = {
    title,
    slug: slugify(text(form, "slug") || title),
    excerpt: text(form, "excerpt"),
    content: text(form, "content"),
    coverImage: text(form, "coverImage"),
    published,
    publishedAt: published ? new Date(text(form, "publishedAt") || Date.now()) : null,
  };

  if (id) {
    await prisma.post.update({ where: { id }, data });
    refreshPublicPages();
    redirect(`/admin/posts/${id}?saved=1`);
  }

  const post = await prisma.post.create({ data });
  refreshPublicPages();
  redirect(`/admin/posts/${post.id}?saved=1`);
}

export async function deletePost(form: FormData) {
  await requireAdmin();
  await prisma.post.delete({ where: { id: text(form, "id") } });
  refreshPublicPages();
  redirect("/admin/posts");
}

/* --------------------------------------------------------------- messages */

export async function toggleMessageRead(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const message = await prisma.message.findUnique({ where: { id } });
  if (message) {
    await prisma.message.update({ where: { id }, data: { read: !message.read } });
  }
  revalidatePath("/admin/messages");
}

export async function deleteMessage(form: FormData) {
  await requireAdmin();
  await prisma.message.delete({ where: { id: text(form, "id") } });
  revalidatePath("/admin/messages");
}
