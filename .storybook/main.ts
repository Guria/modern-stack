import { defineMain } from '@storybook/react-vite/node'

export default defineMain({
	core: { disableTelemetry: true },
	framework: '@storybook/react-vite',
	features: {
		experimentalTestSyntax: true,
		sidebarOnboardingChecklist: false,
	},
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
	viteFinal: (config, { configType }) => {
		if (process.env['CI'] === 'true' && configType === 'PRODUCTION') {
			config.base = '/modern-stack/storybook/'
		} else {
			config.base = '/'
		}
		return config
	},
})
