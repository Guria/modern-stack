import react from '@vitejs/plugin-react'
import assert from 'node:assert'
import { defineConfig } from 'vite'

const outDir = process.env['WEBAPP_OUT_DIR']
const base = process.env['WEBAPP_BASE_URL']
assert(outDir, 'WEBAPP_OUT_DIR env var is not set')
assert(base, 'WEBAPP_BASE_URL env var is not set')

export default defineConfig(() => ({
	build: { outDir },
	plugins: [react()],
	base,
}))
