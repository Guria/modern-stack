import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isCI = process.env['CI'] === 'true'

export default defineConfig(({ command }) => ({
	plugins: [react()],
	base: command === 'build' && isCI ? '/modern-stack/' : '/',
}))
