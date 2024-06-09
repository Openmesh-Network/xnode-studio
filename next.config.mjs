/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => [
    {
      source: '/xue-signer/:call*',
      destination: 'https://remote-signer.plopmenz.com/xue-signer/:call*',
    },
    {
      basePath: false,
      source: '/',
      destination: process.env.NEXT_PUBLIC_PREFIX ?? '/',
    },
    {
      basePath: false,
      source: '/:call*',
      destination: process.env.NEXT_PUBLIC_PREFIX
        ? `${process.env.NEXT_PUBLIC_PREFIX}/:call*`
        : '/:call*',
    },
  ],
  basePath: process.env.NEXT_PUBLIC_PREFIX,
  reactStrictMode: false,
}

export default nextConfig
