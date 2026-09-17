"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function ImageField({
  label,
  name,
  defaultValue = "",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: data });
      const json = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      setValue(json.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-ink-2">{label}</span>

      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-line-2 bg-cream-2">
          {value ? (
            <Image src={value} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-[12px] text-muted">No image</span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="/uploads/file.jpg or https://…"
            className="w-full rounded-md border border-line-2 bg-white px-3.5 py-2.5 text-[15px] text-ink-2 outline-none focus:border-brand"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="h-9 rounded-md border border-line-2 px-4 text-[14px] text-ink-2 transition-colors hover:border-brand disabled:opacity-60"
            >
              {busy ? "Uploading…" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="h-9 rounded-md px-3 text-[14px] text-[#8d3418] hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          {hint && <span className="text-[12px] text-muted">{hint}</span>}
          {error && <span className="text-[12px] text-[#8d3418]">{error}</span>}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
