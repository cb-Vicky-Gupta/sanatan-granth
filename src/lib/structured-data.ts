import "server-only";
import { absoluteUrl } from "@/lib/seo";
import { excerptFrom } from "@/lib/utils";

type Settings = {
  siteName: string;
  tagline: string;
  footerAbout: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  metaDescription: string;
  defaultOgImage: string;
  organizationType: string;
  youtube: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
};

/** Every social profile the site knows about — Google uses these to link entities. */
function sameAs(settings: Settings) {
  return [settings.youtube, settings.instagram, settings.facebook, settings.twitter, settings.linkedin]
    .map((value) => value.trim())
    .filter(Boolean);
}

/**
 * The publishing organisation. Referenced by @id from every other node so the
 * whole site resolves to a single entity in Google's knowledge graph.
 */
export function organizationSchema(settings: Settings, origin: string) {
  const type = settings.organizationType || "Organization";
  return {
    "@type": type,
    "@id": `${origin}/#organization`,
    name: settings.siteName,
    url: origin,
    description: excerptFrom(settings.metaDescription || settings.footerAbout || settings.tagline, 250),
    logo: {
      "@type": "ImageObject",
      "@id": `${origin}/#logo`,
      url: absoluteUrl(settings.defaultOgImage || "/opengraph-image", origin),
      caption: settings.siteName,
    },
    image: { "@id": `${origin}/#logo` },
    ...(sameAs(settings).length ? { sameAs: sameAs(settings) } : {}),
    ...(settings.contactEmail || settings.contactPhone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
            ...(settings.contactPhone ? { telephone: settings.contactPhone } : {}),
            availableLanguage: ["en", "hi", "sa"],
          },
        }
      : {}),
    ...(settings.contactAddress
      ? { address: { "@type": "PostalAddress", streetAddress: settings.contactAddress } }
      : {}),
  };
}

/** The site itself, plus the sitelinks search box Google may render. */
export function websiteSchema(settings: Settings, origin: string) {
  return {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: origin,
    name: settings.siteName,
    description: excerptFrom(settings.metaDescription || settings.tagline, 250),
    publisher: { "@id": `${origin}/#organization` },
    inLanguage: ["en", "hi", "sa"],
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${origin}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[], origin: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(crumbs[crumbs.length - 1]?.path ?? "/", origin)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, origin),
    })),
  };
}

type BookLike = {
  title: string;
  slug: string;
  sanskritTitle: string;
  subtitle: string;
  description: string;
  coverImage: string;
  ogImage: string;
  language: string;
  author: string;
  datePublished: string;
  pdfUrl: string;
  updatedAt: Date;
  category?: { name: string } | null;
  chapters: { number: number; title: string; summary: string }[];
};

/**
 * A Book node with its chapters as hasPart, and a free Offer so the price of
 * zero is machine-readable rather than only stated in prose.
 */
export function bookSchema(book: BookLike, settings: Settings, origin: string) {
  const url = `${origin}/books/${book.slug}`;
  const image = absoluteUrl(book.ogImage || book.coverImage || settings.defaultOgImage || "/opengraph-image", origin);

  return {
    "@type": "Book",
    "@id": `${url}#book`,
    url,
    name: book.title,
    ...(book.sanskritTitle ? { alternateName: book.sanskritTitle } : {}),
    headline: book.subtitle || book.title,
    description: excerptFrom(book.description, 300),
    image,
    inLanguage: book.language
      .split(/[·,|]/)
      .map((value) => value.trim())
      .filter(Boolean),
    bookFormat: "https://schema.org/EBook",
    isAccessibleForFree: true,
    ...(book.author ? { author: { "@type": "Person", name: book.author } } : {}),
    publisher: { "@id": `${origin}/#organization` },
    ...(book.datePublished ? { datePublished: book.datePublished } : {}),
    dateModified: book.updatedAt.toISOString(),
    ...(book.category ? { genre: book.category.name } : {}),
    numberOfPages: book.chapters.length || undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url,
    },
    ...(book.pdfUrl
      ? {
          workExample: {
            "@type": "Book",
            bookFormat: "https://schema.org/EBook",
            encodingFormat: "application/pdf",
            url: absoluteUrl(book.pdfUrl, origin),
            isAccessibleForFree: true,
          },
        }
      : {}),
    ...(book.chapters.length
      ? {
          hasPart: book.chapters.map((chapter) => ({
            "@type": "Chapter",
            position: chapter.number,
            name: chapter.title,
            ...(chapter.summary ? { description: excerptFrom(chapter.summary, 200) } : {}),
            url: `${url}/${chapter.number}`,
          })),
        }
      : {}),
  };
}

export function chapterSchema(
  book: { title: string; slug: string },
  chapter: { number: number; title: string; summary: string; content: string },
  origin: string,
) {
  const url = `${origin}/books/${book.slug}/${chapter.number}`;
  return {
    "@type": "Chapter",
    "@id": `${url}#chapter`,
    url,
    name: chapter.title,
    position: chapter.number,
    description: excerptFrom(chapter.summary || chapter.content, 250),
    isPartOf: { "@id": `${origin}/books/${book.slug}#book` },
    publisher: { "@id": `${origin}/#organization` },
    isAccessibleForFree: true,
  };
}

type PostLike = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  ogImage: string;
  author: string;
  publishedAt: Date | null;
  updatedAt: Date;
};

export function articleSchema(post: PostLike, settings: Settings, origin: string) {
  const url = `${origin}/blog/${post.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: excerptFrom(post.title, 110),
    description: excerptFrom(post.excerpt || post.content, 250),
    image: absoluteUrl(post.ogImage || post.coverImage || settings.defaultOgImage || "/opengraph-image", origin),
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@id": `${origin}/#organization` },
    publisher: { "@id": `${origin}/#organization` },
    ...(post.publishedAt ? { datePublished: post.publishedAt.toISOString() } : {}),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "en",
    isAccessibleForFree: true,
    /** Word count is a weak but real quality signal for article-rich results. */
    wordCount: post.content.trim().split(/\s+/).filter(Boolean).length,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[], origin: string) {
  return {
    "@type": "FAQPage",
    "@id": `${origin}/faqs#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function collectionSchema(
  options: { path: string; name: string; description: string; items: { name: string; path: string }[] },
  origin: string,
) {
  const url = absoluteUrl(options.path, origin);
  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: options.name,
    description: excerptFrom(options.description, 250),
    isPartOf: { "@id": `${origin}/#website` },
    publisher: { "@id": `${origin}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: options.items.length,
      itemListElement: options.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path, origin),
      })),
    },
  };
}

/** Wraps nodes in a single @graph so one script tag carries the whole page. */
export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
