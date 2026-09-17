import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSettings() {
  const existing = await prisma.setting.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return prisma.setting.create({ data: { id: 1 } });
}

export async function getHomePage() {
  const existing = await prisma.homePage.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return prisma.homePage.create({ data: { id: 1 } });
}

export function getCategories() {
  return prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { books: { where: { published: true } } } } },
  });
}

export function getFeaturedBooks(take = 6) {
  return prisma.book.findMany({
    where: { published: true, featured: true },
    orderBy: [{ position: "asc" }, { title: "asc" }],
    include: { category: true },
    take,
  });
}

export function getBooks(categorySlug?: string, query?: string) {
  return prisma.book.findMany({
    where: {
      published: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { sanskritTitle: { contains: query } },
              { description: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: [{ position: "asc" }, { title: "asc" }],
    include: { category: true, _count: { select: { chapters: true } } },
  });
}

export function getBookBySlug(slug: string) {
  return prisma.book.findFirst({
    where: { slug, published: true },
    include: {
      category: true,
      chapters: { orderBy: { number: "asc" } },
    },
  });
}

export function getActiveVerse() {
  return prisma.verse.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getFeatures() {
  return prisma.feature.findMany({ orderBy: { position: "asc" } });
}

export function getFaqs() {
  return prisma.faq.findMany({ orderBy: { position: "asc" } });
}

export function getPosts(take?: number) {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export function getPostBySlug(slug: string) {
  return prisma.post.findFirst({ where: { slug, published: true } });
}
