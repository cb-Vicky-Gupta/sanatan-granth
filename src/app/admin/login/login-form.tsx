"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const initial: LoginState = { error: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-ink-2">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 rounded-md border border-line-2 bg-white px-4 text-[15px] outline-none focus:border-brand"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-ink-2">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 rounded-md border border-line-2 bg-white px-4 text-[15px] outline-none focus:border-brand"
        />
      </label>

      {state.error && (
        <p className="rounded-md bg-[#f6e3dd] px-4 py-3 text-[14px] text-[#7a2a16]">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-md bg-brand text-[16px] text-cream transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
