/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Change this before deployment?
  rewrites: () => [
    {
      source: "/xue-signer/:call*",
      destination: "https://remote-signer.plopmenz.com/xue-signer/:call*",
    },
  ],
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? 'https://openmesh-xnode.vercel.app'
      : 'http://localhost:3334',
}

module.exports = nextConfig
