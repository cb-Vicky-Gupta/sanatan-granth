import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Crumb } from "@/lib/structured-data";

/**
 * Visible breadcrumb trail. Google wants the markup and the on-page trail to
 * agree, so this renders the same list the BreadcrumbList schema describes.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[14px] text-muted">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 && <Icon name="arrow" className="h-3 w-3 shrink-0 text-line-2" aria-hidden="true" />}
              {last ? (
                <span aria-current="page" className="text-ink-2">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="transition-colors hover:text-brand">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
