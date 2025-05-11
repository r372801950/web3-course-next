// next.config.mjs
import { codeInspectorPlugin } from "code-inspector-plugin";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    config.plugins.push(codeInspectorPlugin({ bundler: "webpack" }));
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 其他配置选项...
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);