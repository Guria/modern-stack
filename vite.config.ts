import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isCi = process.env['CI'] === 'true'

export default defineConfig(({ command }) => ({
	plugins: [react()],
	base: command === 'build' && isCi ? '/modern-stack/' : '/',
}))
