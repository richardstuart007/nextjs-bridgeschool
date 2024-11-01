/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',  // Redirect all paths
        destination: 'https://nextjs14-bridgeschool.vercel.app/:path*',  // Redirect to corresponding paths on the new site
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
