/** @type {import('next').NextConfig} */
import withTM from 'next-transpile-modules';

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({ 'onnxruntime-node': 'commonjs onnxruntime-node' });
    }

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    return config;
  },
};

export default withTM(['onnxruntime-node'])(nextConfig);
