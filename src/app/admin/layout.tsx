import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Sanatan Granth",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f7f3ea]">{children}</div>;
}
