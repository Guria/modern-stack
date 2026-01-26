import { defineMain } from '@storybook/react-vite/node'
import assert from 'node:assert'

const base = process.env['STORYBOOK_BASE_URL']
assert(base, 'STORYBOOK_BASE_URL env var is not set')

export default defineMain({
	framework: '@storybook/react-vite',
	features: {
		experimentalTestSyntax: true,
		sidebarOnboardingChecklist: false,
	},
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
	viteFinal: (config) => {
		config.base = base
		return config
	},
})
