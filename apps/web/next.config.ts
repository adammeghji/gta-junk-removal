import type { NextConfig } from "next";

const isPagesExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isPagesExport && {
    output: "export",
    basePath: "/gta-junk-removal",
    trailingSlash: true,
  }),
};

export default nextConfig;
