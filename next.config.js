/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle undici module compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Add rule to transpile undici
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-class-properties']
        }
      }
    });

    return config;
  },
};

module.exports = nextConfig;
