import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
        {description && <p className="max-w-2xl text-[15px] text-muted">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="flex h-11 items-center rounded-md bg-brand px-5 text-[15px] text-cream transition-colors hover:bg-brand-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Saved({ show, message = "Saved." }: { show: boolean; message?: string }) {
  if (!show) return null;
  return (
    <p className="mb-6 rounded-md bg-[#e8f0e0] px-4 py-3 text-[15px] text-[#2f4a22]">{message}</p>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-white p-6 ${className}`}>{children}</div>
  );
}
