import type { NextConfig } from "next";
import { POST_AUTH_ROUTE } from "./lib/routes";

// The API (api.patchapp.ir) sends no CORS headers, so the browser can't call it
// directly. Proxy same-origin /api/v1/* to it server-side — no CORS, and the
// Authorization header + request bodies (incl. multipart) pass straight through.
const API_BASE_URL = process.env.API_BASE_URL ?? "https://api.patchapp.ir";

const nextConfig: NextConfig = {
  // LAN IPs allowed to load dev resources (phones on the local network).
  // Add your machine's current LAN IP here if it changes (DHCP).
  allowedDevOrigins: ["192.168.1.36", "192.168.1.44", "10.59.1.155", "172.20.10.2", "10.64.123.155"],
  output: "standalone",
  // There is no discover page — BottomNav's tabs are /matches, /clubs,
  // /activity and /profile. Redirect here rather than from the page so the
  // PWA cold launch (manifest start_url is "/") never paints an empty shell.
  async redirects() {
    return [{ source: "/", destination: POST_AUTH_ROUTE, permanent: false }];
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_BASE_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
