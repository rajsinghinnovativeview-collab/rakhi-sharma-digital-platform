/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // `npm run build` runs the standalone strict TypeScript gate first.
  // This avoids Next's redundant --showConfig subprocess in restricted runners.
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
