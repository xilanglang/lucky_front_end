import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
// 这是 GitHub 的规则：仓库名称必须是基本路径。所以我们就把/lucky_front_end/作为项目的基础：
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/lucky_front_end/',
});
