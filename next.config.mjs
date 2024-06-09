/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => [
    {
      source: '/xue-signer/:call*',
      destination: 'https://remote-signer.plopmenz.com/xue-signer/:call*',
    },
  ],
  basePath: process.env.NEXT_PUBLIC_PREFIX,
  images: {
    remotePatterns: [
      {
        hostname: 'flagicons.lipis.dev',
        protocol: 'https',
        pathname: '/flags/*',
      },
    ],
  },
  reactStrictMode: false,
}

export default nextConfig
