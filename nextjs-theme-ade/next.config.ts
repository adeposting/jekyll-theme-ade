import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for optimal performance
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Bundle analyzer configuration
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
          reportFilename: isServer ? '../analyze/server.html' : '../analyze/client.html'
        })
      );
    }
    
    // Performance optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  
  // MDX support
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

export default nextConfig;
