import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Covers and hero art can be uploaded locally or pasted in as a URL
    // from the admin panel, so remote hosts are allowed over https.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
