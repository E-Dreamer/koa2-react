import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import viteEslint from 'vite-plugin-eslint'
import path from 'path'
// https://vitejs.dev/config/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return {
    base: './',
    plugins: [react(),viteEslint({failOnError:false})],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        "@server": path.resolve(__dirname, './server')
      },
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入 （不建议如此）
      // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', 'scss']
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3123',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
    // define: {
    //   'process.env': {}
    // }
  }
})