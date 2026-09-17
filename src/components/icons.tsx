type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LotusMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 46 40" className={className} aria-hidden="true" {...base} strokeWidth={1.5}>
      <path d="M23 6c-3.2 4-4.6 8.2-4.6 12.6 0 4 1.6 7.4 4.6 10.4 3-3 4.6-6.4 4.6-10.4C27.6 14.2 26.2 10 23 6z" />
      <path d="M14.2 11.8c-1 4.6-.5 8.6 1.5 12.2 1.6 2.9 4.1 5 7.3 6.4" />
      <path d="M31.8 11.8c1 4.6.5 8.6-1.5 12.2-1.6 2.9-4.1 5-7.3 6.4" />
      <path d="M5.5 18.4c.6 4.8 2.7 8.3 6.1 10.6 2.9 2 6.6 2.9 11.4 3" />
      <path d="M40.5 18.4c-.6 4.8-2.7 8.3-6.1 10.6-2.9 2-6.6 2.9-11.4 3" />
    </svg>
  );
}

const glyphs: Record<string, React.ReactNode> = {
  lotus: (
    <>
      <path d="M12 4c-1.8 2.4-2.6 4.8-2.6 7.2 0 2.3.9 4.2 2.6 6 1.7-1.8 2.6-3.7 2.6-6C14.6 8.8 13.8 6.4 12 4z" />
      <path d="M6.2 8.4c-.6 2.7-.2 5 1.2 6.9 1 1.5 2.5 2.6 4.6 3.3" />
      <path d="M17.8 8.4c.6 2.7.2 5-1.2 6.9-1 1.5-2.5 2.6-4.6 3.3" />
      <path d="M2.4 12.2c.4 2.6 1.7 4.4 3.8 5.6 1.7 1 3.6 1.5 5.8 1.5" />
      <path d="M21.6 12.2c-.4 2.6-1.7 4.4-3.8 5.6-1.7 1-3.6 1.5-5.8 1.5" />
    </>
  ),
  diya: (
    <>
      <path d="M12 3c-1.4 2.2-2 3.8-2 5.2 0 1.4.8 2.3 2 3.1 1.2-.8 2-1.7 2-3.1 0-1.4-.6-3-2-5.2z" />
      <path d="M4.5 14.5h15c-.6 3.4-3.6 5.5-7.5 5.5s-6.9-2.1-7.5-5.5z" />
      <path d="M9 12.6h6" />
    </>
  ),
  chakra: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 3.6v3M12 17.4v3M3.6 12h3M17.4 12h3M6.1 6.1l2.1 2.1M15.8 15.8l2.1 2.1M17.9 6.1l-2.1 2.1M8.2 15.8l-2.1 2.1" />
    </>
  ),
  book: (
    <>
      <path d="M6 5.5h10.5a2 2 0 0 1 2 2v11H8a2 2 0 0 0-2 2z" />
      <path d="M6 5.5a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2" />
      <path d="M9.5 9.5h6M9.5 13h4" />
    </>
  ),
  mind: (
    <>
      <path d="M12 4.5c-2.6 0-4.4 1.7-4.4 4 0 1.6.8 2.7 1.7 3.6.7.7 1.1 1.4 1.1 2.4h3.2c0-1 .4-1.7 1.1-2.4.9-.9 1.7-2 1.7-3.6 0-2.3-1.8-4-4.4-4z" />
      <path d="M10.4 17h3.2M11 19.5h2" />
    </>
  ),
  temple: (
    <>
      <path d="M4 8.5l8-4 8 4" />
      <path d="M5.5 8.5v10M18.5 8.5v10M9.5 8.5v10M14.5 8.5v10" />
      <path d="M3.5 19.5h17" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.9" />
    </>
  ),
  heart: <path d="M12 20.5s-7.2-4.2-7.2-9.4A4.3 4.3 0 0 1 12 8.4a4.3 4.3 0 0 1 7.2 2.7c0 5.2-7.2 9.4-7.2 9.4z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5z" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8L20 20" />
    </>
  ),
  arrow: <path d="M4 12h14M13 7l5 5-5 5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  speaker: (
    <>
      <path d="M5 9.5v5h3.5l4.5 3.5V6l-4.5 3.5H5z" />
      <path d="M16.5 9a4.5 4.5 0 0 1 0 6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.8 7l8.2 6 8.2-6" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4l10-10-4-4L4 16z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
};

export type IconName = keyof typeof glyphs;

export const iconNames = Object.keys(glyphs) as IconName[];

export function Icon({ name, className }: { name: string; className?: string }) {
  const glyph = glyphs[name] ?? glyphs.lotus;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      {glyph}
    </svg>
  );
}

export function SocialIcon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    youtube: (
      <>
        <rect x="2" y="5" width="16" height="10" rx="3" />
        <path d="M8.5 7.8l4 2.2-4 2.2z" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="14" height="14" rx="4" />
        <circle cx="10" cy="10" r="3.4" />
        <circle cx="14.3" cy="5.8" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
    facebook: (
      <>
        <path d="M12.4 4.2h-1.6c-1.5 0-2.4 1-2.4 2.5V8.6H6.6v2.4h1.8v5.8" />
        <path d="M6.6 11h5.4" />
      </>
    ),
    twitter: <path d="M5 5l10 10M15 5L5 15" />,
    linkedin: (
      <>
        <path d="M5.5 8.4v6.4M5.5 5.4v.1" />
        <path d="M9.4 14.8V8.4M9.4 10.8c0-1.5 1-2.4 2.4-2.4s2.4.9 2.4 2.4v4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" {...base} strokeWidth={1.4}>
      {paths[name] ?? paths.twitter}
    </svg>
  );
}
