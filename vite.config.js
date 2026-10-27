import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, transformWithOxc } from 'vite'

const SRC_JS = /\/src\/.*\.js$/

/** Komponentlər .js faylındadır — src/ içindəki .js fayllarında JSX-i çevirir. */
function jsxInJs() {
  let development = false
  return {
    name: 'jsx-in-js',
    enforce: 'pre',
    configResolved(config) {
      development = config.command === 'serve'
    },
    async transform(code, id) {
      if (!SRC_JS.test(id.split('?')[0])) return
      const result = await transformWithOxc(code, id, {
        lang: 'jsx',
        jsx: { runtime: 'automatic', development },
        sourcemap: true,
      })
      return { code: result.code, map: result.map }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [jsxInJs(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: { '.js': 'jsx' },
    },
  },
})
