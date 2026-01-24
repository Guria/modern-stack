import { defineMain } from '@storybook/react-vite/node'

export default defineMain({
	framework: '@storybook/react-vite',
	features: { experimentalTestSyntax: true },
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
})
