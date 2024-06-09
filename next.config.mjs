const rewrites = [
  {
    source: `${process.env.NEXT_PUBLIC_PREFIX ?? ''}/xue-signer/:call*`,
    destination: 'https://remote-signer.plopmenz.com/xue-signer/:call*',
  },
]
if (process.env.NEXT_PUBLIC_BASE_PATH) {
  rewrites.push({
    source: `${process.env.NEXT_PUBLIC_PREFIX ?? ''}/api/:call*`,
    destination: `${process.env.NEXT_PUBLIC_BASE_PATH}/api/:call*`,
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => rewrites,
  assetPrefix: process.env.NEXT_PUBLIC_PREFIX,
  reactStrictMode: false,
}

export default nextConfig
