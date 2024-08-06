import { fileURLToPath, URL } from 'node:url'
import { defineConfig,loadEnv} from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, process.cwd(), '')
  return {
  build:{
    outDir:'../api-server/static',
    emptyOutDir:true
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // server:{
  //   proxy:{
  //     '/api': {
  //       target: env.VITE_API_URL,
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
}

})
