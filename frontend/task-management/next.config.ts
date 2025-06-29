/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // <-- your backend URL and port
      },
    ];
  },
};

module.exports = nextConfig;
