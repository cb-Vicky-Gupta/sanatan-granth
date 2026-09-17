import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/seo";
import { getSettings } from "@/lib/site";
import { graph, organizationSchema, websiteSchema } from "@/lib/structured-data";

/**
 * Pages are rendered once and served from the cache until something changes.
 * Every admin mutation calls `revalidatePath("/", "layout")`, so edits still
 * appear immediately — but an ordinary visitor (and Googlebot) gets a cached
 * response instead of a fresh database round trip, which is what keeps
 * Largest Contentful Paint inside the Core Web Vitals budget.
 */
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, origin] = await Promise.all([getSettings(), getSiteUrl()]);

  /** Organization and WebSite are site-wide, so they live in the layout and
      every page's own schema references them by @id instead of repeating them. */
  const siteSchema = graph([organizationSchema(settings, origin), websiteSchema(settings, origin)]);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={siteSchema} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <SiteHeader siteName={settings.siteName} tagline={settings.tagline} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
