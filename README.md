# Sanatan Granth

A free digital library for Indian scripture — the Vedas, Bhagavad Gita, Upanishads, Puranas and more.
Every text is free to read and download; there is no cart, no price and no payment anywhere in the app.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma 6 · SQLite**.

---

## Quick start

```bash
npm install          # also runs `prisma generate`
npm run setup        # creates the database and fills it with content (only needed once)
npm run dev
```

Open <http://localhost:3000>.

Admin panel: <http://localhost:3000/admin>

```
email:    admin@sanatangranth.in
password: admin1234
```

Change that password from **Settings** the first time you sign in, and change `AUTH_SECRET`
in `.env` before you deploy anywhere.

---

## What is in the box

### Public site

| Route | What it is |
| --- | --- |
| `/` | Homepage — hero, category strip, featured books, verse of the day, about block, promises strip |
| `/books` | Full library with category filter chips |
| `/books/[slug]` | Book page — cover, description, contents, PDF download |
| `/books/[slug]/[chapter]` | Reading view with previous / next navigation |
| `/about` | About the project, how each text is presented, licensing |
| `/blog`, `/blog/[slug]` | Notes and essays |
| `/faqs` | Accordion of common questions |
| `/contact` | Contact form; submissions land in the admin panel |
| `/search?q=` | Searches book titles, descriptions and posts |

### Admin panel (`/admin`)

| Section | What you can change |
| --- | --- |
| Dashboard | Counts and the five most recent messages |
| Books & chapters | Add, edit, delete books; upload covers; write chapters; set featured / published |
| Categories | The round icons on the homepage and the filter chips |
| Homepage content | Every string and image in the hero, featured and about blocks |
| Verse of the day | Keep a pool of verses, mark one live |
| Promises strip | The four items above the footer |
| Blog posts | Write, publish, unpublish, delete |
| FAQs | Add, reorder, edit |
| Messages | Read, mark read/unread, delete |
| Settings | Site name, tagline, footer, contact details, social links, your password |

Editing anything in the admin panel updates the public site immediately — the site pages read
live data and `revalidatePath` is called after every write.

---

## Images

Two illustrations ship in `public/images/` (`hero.svg`, `about.svg`) so the site looks complete out
of the box. Replace them with real photography whenever you have it — a wide shot of a ghat, a
temple or a manuscript works well for the hero.

Anywhere an image is used you can either **upload a file** or **paste a URL**:

- Uploads go to `public/uploads/` through `POST /api/upload` (signed-in admins only, 5 MB limit,
  PNG / JPG / WebP / GIF / SVG).
- Remote URLs over `https` are allowed by `next.config.ts`.

Book covers are optional. Without one, the app draws a typographic cover from the book's
Devanagari title and its cover colour, so the grid never has a hole in it.

---

## Content formatting

Descriptions, chapters and blog posts accept a small markdown subset:

```
## Heading
### Smaller heading

A normal paragraph. A blank line starts a new one.

> कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
> मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥

*A line wrapped in asterisks becomes an italic display line — good for transliteration.*

- list item
- list item
```

Lines starting with `>` render as a Devanagari verse block on a cream panel.

---

## Project structure

```
prisma/
  schema.prisma          data model
  seed.ts                categories, 8 books, chapters, verses, FAQs, posts, admin user
src/
  app/
    (site)/              public website
    admin/
      login/             sign-in
      (panel)/           everything behind auth
      actions.ts         every admin mutation (server actions)
    api/upload/          image upload endpoint
  components/            shared UI + admin form primitives
  lib/
    auth.ts              bcrypt + JWT session cookie
    prisma.ts            Prisma singleton
    site.ts              data access for public pages
    utils.ts             slugify, dates, the markdown subset
```

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run setup` | generate + push schema + seed (first run) |
| `npm run db:push` | Apply schema changes to the database |
| `npm run db:seed` | Re-run the seed (safe — it upserts) |
| `npm run db:studio` | Prisma Studio, a GUI over the data |
| `npm run lint` | ESLint |

---

## Going to production

The defaults are chosen so the project runs with zero setup. Two of them should change before
a real deployment:

**1. Database.** SQLite is a single file (`prisma/dev.db`). To move to Postgres, edit
`prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

then set `DATABASE_URL` to your connection string and run `npm run db:push && npm run db:seed`.
No application code changes.

**2. Uploads.** `POST /api/upload` writes to the local filesystem, which works on a VPS, Railway,
Render or any long-running Node host, but **not** on Vercel's serverless functions, where the
filesystem is read-only and ephemeral. If you deploy to Vercel, swap that route for
S3 / Cloudflare R2 / UploadThing — it is about twenty lines, and nothing else has to change
because every image field already accepts a plain URL.

Also set a long random `AUTH_SECRET` (`openssl rand -base64 32`) and change the admin password.

---

## Licence and content

The scriptures themselves are in the public domain. The translations and summaries included in
the seed are original paraphrases written for this project; replace or extend them freely.
# sanatan-granth
