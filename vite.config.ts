import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import  path from 'path'
// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return {
    base: './',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        "@server": path.resolve(__dirname, './server')
      }
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入 （不建议如此）
      // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // define: {
    //   'process.env': {}
    // }
  }
})