import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    // Point workspace packages to their TypeScript source so Vite doesn't
    // require a pre-built dist/ in dev mode.
    alias: {
      '@rohitaggarwal/passkey-sdk': resolve(__dirname, '../../packages/passkey-sdk/src/index.ts'),
      '@rohitaggarwal/passkey-ui': resolve(__dirname, '../../packages/passkey-ui/src/index.ts'),
      '@rohitaggarwal/wallets-kit-adapter': resolve(__dirname, '../../packages/wallets-kit-adapter/src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    target: 'es2022',
  },
});
