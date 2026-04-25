/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  // Static export + basePath only for GitHub Pages CI.
  // Vercel deploys at root with full Next.js support, so neither is needed there.
  ...(isGithubPages && {
    output: "export",
    basePath: "/drip-wise",
  }),
  images: { unoptimized: true },
};

export default nextConfig;
