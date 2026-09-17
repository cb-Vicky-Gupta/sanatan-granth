"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";

const initial: ContactState = { status: "idle", message: "" };

const fieldClass =
  "h-12 w-full rounded-md border border-line-2 bg-card px-4 text-[16px] text-ink-2 outline-none transition-colors focus:border-brand";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] text-muted">Your name</span>
          <input name="name" required className={fieldClass} placeholder="Full name" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] text-muted">Email address</span>
          <input name="email" type="email" required className={fieldClass} placeholder="you@example.com" />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[14px] text-muted">Subject</span>
        <input name="subject" className={fieldClass} placeholder="Correction, contribution, question…" />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-[14px] text-muted">Message</span>
        <textarea
          name="body"
          required
          rows={7}
          className="w-full rounded-md border border-line-2 bg-card p-4 text-[16px] leading-relaxed text-ink-2 outline-none transition-colors focus:border-brand"
          placeholder="If you are reporting a mistake, please include the text, chapter and verse number."
        />
      </label>

      {state.status !== "idle" && (
        <p
          className={
            state.status === "success"
              ? "rounded-md bg-[#e8f0e0] px-4 py-3 text-[15px] text-[#2f4a22]"
              : "rounded-md bg-[#f6e3dd] px-4 py-3 text-[15px] text-[#7a2a16]"
          }
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-13 w-full items-center justify-center rounded-md bg-brand px-8 py-4 text-[16px] text-cream transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
