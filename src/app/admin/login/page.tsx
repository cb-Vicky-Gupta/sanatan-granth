import { redirect } from "next/navigation";
import { LotusMark } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 pb-8 text-center">
          <LotusMark className="h-11 w-12 text-brand" />
          <h1 className="font-display text-3xl font-bold text-ink">Sanatan Granth</h1>
          <p className="text-[15px] text-muted">Sign in to manage the library.</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_24px_60px_-40px_rgba(36,22,8,0.5)]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
