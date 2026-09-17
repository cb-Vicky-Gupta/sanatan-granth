import { Sidebar } from "@/components/admin/sidebar";
import { requireAdmin, } from "@/lib/auth";
import { logout } from "@/app/admin/actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar userName={user.name} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-end gap-4 border-b border-line bg-white px-5 lg:px-8">
          <form action={logout}>
            <button
              type="submit"
              className="h-10 rounded-md border border-line-2 px-4 text-[14px] text-ink-2 transition-colors hover:border-brand hover:text-brand"
            >
              Sign out
            </button>
          </form>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
