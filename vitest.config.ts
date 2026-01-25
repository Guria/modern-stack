import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const isCI = process.env['CI'] === 'true'

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	optimizeDeps: {
		include: ['react', 'react/jsx-dev-runtime'],
	},
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json-summary'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/**/*.stories.tsx',
				'src/**/*.test.{ts,tsx}',
				'src/shared/styled-system/**',
				'src/main.tsx',
			],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 75,
				statements: 80,
			},
		},
		projects: [
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({
						configDir: path.join(path.dirname(fileURLToPath(import.meta.url)), '.storybook'),
					}),
				],
				test: {
					name: 'storybook',
					testTimeout: isCI ? 60000 : 10000,
					hookTimeout: isCI ? 60000 : 10000,
					browser: {
						enabled: true,
						headless: true,
						screenshotFailures: false,
						provider: playwright({
							launchOptions: {
								args: isCI
									? [
											'--no-sandbox',
											'--disable-setuid-sandbox',
											'--disable-dev-shm-usage',
											'--disable-gpu',
										]
									: [],
							},
						}),
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
	},
})
