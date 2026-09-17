import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  siteName: string;
  footnote?: string;
};

/**
 * One social card layout for the whole site, so every shared link looks like it
 * comes from the same place. Rendered at request time and cached by Next.
 *
 * Only Latin text is drawn here — `ImageResponse` has no Devanagari face
 * bundled, and a row of tofu boxes is worse than no Sanskrit line at all.
 */
export function ogImage({ eyebrow, title, subtitle, siteName, footnote }: Props) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #fbf6ea 0%, #f6e8c8 55%, #f0d9a8 100%)",
          fontFamily: "Georgia, serif",
          color: "#2b1c09",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {eyebrow ? (
            <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#9b3a1e" }}>
              {eyebrow}
            </div>
          ) : null}
          <div style={{ fontSize: title.length > 60 ? 64 : 82, fontWeight: 700, lineHeight: 1.1 }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ fontSize: 34, lineHeight: 1.35, color: "#5c4527", maxWidth: 900 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: "#9b3a1e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fdf3dc",
                fontSize: 30,
              }}
            >
              ॐ
            </div>
            <div style={{ fontSize: 32, fontWeight: 600 }}>{siteName}</div>
          </div>
          <div style={{ fontSize: 26, color: "#855321" }}>{footnote ?? "Free to read · Free to download"}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
