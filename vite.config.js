import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/L19/' : '/',
  plugins: process.env.GITHUB_ACTIONS ? [{
    name: 'github-pages-root-assets',
    generateBundle(_, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === 'asset' && typeof item.source === 'string') item.source = item.source.replace(/(["'(])\/(images\/|laboratory-logo\.svg|favicon[^"')]+)/g, '$1/L19/$2');
        if (item.type === 'chunk') item.code = item.code.replace(/(["'(])\/(images\/|laboratory-logo\.svg|favicon[^"')]+)/g, '$1/L19/$2');
      }
    },
  }] : [],
  server: {
    port: 5173,
    proxy: { '/api': 'http://127.0.0.1:8001' },
  },
});
