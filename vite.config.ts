import { defineConfig } from 'vite'
import { resolve } from "path"
import vue from '@vitejs/plugin-vue'
import vueSetupExtend from "vite-plugin-vue-setup-extend"
import electron from 'vite-plugin-electron'

// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
  plugins: [
		vue(),
		// 支持vue script设置name属性
		// [https://github.com/vbenjs/vite-plugin-vue-setup-extend]
		vueSetupExtend(),
		electron([
			{
				entry: 'electron/index.js',
				vite: {
					build: {
						outDir: 'dist-electron',
					},
				},
			}
		]),
	],
	server: {
		port: 8000,
		cors: true,
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"), //名字替代
			// remove i18n waring
			"vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
		},
	}
})
