import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { join } from "path";

const { version } = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8")) as { version: string };
let piVersion = "unknown";
try {
  const piPkgPath = join(__dirname, "node_modules/@earendil-works/pi-coding-agent/package.json");
  piVersion = (JSON.parse(readFileSync(piPkgPath, "utf8")) as { version: string }).version;
} catch { /* package not found, use default */ }

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "undici",
    "@earendil-works/pi-coding-agent",
    "@earendil-works/pi-agent-core",
    "@earendil-works/pi-ai",
    "@earendil-works/pi-tui",
  ],
  //allowedDevOrigins: ['192.168.*.*'],
  allowedDevOrigins: ['192.168.*.*','100.109.93.64'],
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_PI_VERSION: piVersion,
    NEXT_PUBLIC_PI_WEB_TEXT_PREVIEW_MAX_BYTES: process.env.PI_WEB_TEXT_PREVIEW_MAX_BYTES || "",
    NEXT_PUBLIC_PI_WEB_IMAGE_PREVIEW_MAX_BYTES: process.env.PI_WEB_IMAGE_PREVIEW_MAX_BYTES || "",
    NEXT_PUBLIC_PI_WEB_DOCX_PREVIEW_MAX_BYTES: process.env.PI_WEB_DOCX_PREVIEW_MAX_BYTES || "",
    NEXT_PUBLIC_PI_WEB_MAX_UPLOAD_FILE_BYTES: process.env.PI_WEB_MAX_UPLOAD_FILE_BYTES || "",
    NEXT_PUBLIC_PI_WEB_MAX_UPLOAD_TOTAL_BYTES: process.env.PI_WEB_MAX_UPLOAD_TOTAL_BYTES || "",
  },
};

export default nextConfig;
