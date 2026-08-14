/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [
    'rc-util',
    'rc-pagination',
    'rc-picker',
    '@babel/runtime',
    '@ant-design/icons-svg',
    'antd',
    'rc-motion',
    'rc-field-form',
    'rc-input',
    'rc-select',
    'rc-tree',
    'rc-table'
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  experimental: {
    esmExternals: 'loose'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
