export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Very small markdown-ish renderer: paragraphs, headings, blockquotes, lists. */
export function renderRichText(source: string) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return { type: "empty" as const, text: "" };
    if (trimmed.startsWith("### ")) return { type: "h3" as const, text: trimmed.slice(4) };
    if (trimmed.startsWith("## ")) return { type: "h2" as const, text: trimmed.slice(3) };
    if (trimmed.startsWith("> ")) {
      return { type: "quote" as const, text: trimmed.replace(/^> ?/gm, "") };
    }
    if (/^[-*] /.test(trimmed)) {
      return {
        type: "list" as const,
        items: trimmed.split("\n").map((line) => line.replace(/^[-*] ?/, "")),
        text: "",
      };
    }
    return { type: "p" as const, text: trimmed };
  });
}

export function excerptFrom(source: string, length = 180) {
  const flat = source.replace(/\s+/g, " ").trim();
  return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat;
}
