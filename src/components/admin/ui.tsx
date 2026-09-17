"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-md border border-line-2 bg-white px-3.5 py-2.5 text-[15px] text-ink-2 outline-none transition-colors focus:border-brand";

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  hint,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        className={inputClass}
      />
      {hint && <span className="text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 6,
  hint,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        className={cn(inputClass, "leading-relaxed")}
      />
      {hint && <span className="text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Array<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      <select name={name} defaultValue={defaultValue ?? ""} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-line-2 bg-white px-3.5 py-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4.5 w-4.5 accent-[#8a5a24]"
      />
      <span className="flex flex-col">
        <span className="text-[15px] text-ink-2">{label}</span>
        {hint && <span className="text-[12px] text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function SubmitButton({ children = "Save changes" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 items-center justify-center rounded-md bg-brand px-6 text-[15px] text-cream transition-colors hover:bg-brand-dark disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function DangerButton({ children = "Delete" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!confirm("Delete this permanently?")) event.preventDefault();
      }}
      className="flex h-11 items-center justify-center rounded-md border border-[#c9917f] px-5 text-[15px] text-[#8d3418] transition-colors hover:bg-[#f7e7e1] disabled:opacity-60"
    >
      {pending ? "Deleting…" : children}
    </button>
  );
}
