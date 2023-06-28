/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      root: 'src',
      build: {
        minify: false,
        rollupOptions: {
          output: {
            dir: './dist',
          },
        },
      },
    };
  }

  return defineConfig({
    plugins: [vue()],
    build: {
      assetsInlineLimit: 0,
    },
  });
});