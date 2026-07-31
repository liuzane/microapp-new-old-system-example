// 基础模块
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// 类型
import type { ConfigEnv } from 'vite';

// 插件
import vue from '@vitejs/plugin-vue';
import federation from './module-federation.config.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const env: Record<string, string> = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_BASE,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.VITE_PORT),
      open: true,
    },
    build: {
      emptyOutDir: true,
      outDir: '../dist',
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag: string) => /^micro-app/.test(tag),
          },
        },
      }),
      federation(env),
    ],
  };
});
