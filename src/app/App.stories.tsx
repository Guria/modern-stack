import { expect, waitFor } from 'storybook/test'

import preview from '#.storybook/preview'

import { App } from './App'

const meta = preview.meta({ component: App })

export default meta

export const Default = meta.story({})

Default.test('renders the application title', async ({ canvas }) => {
	const title = await canvas.getByRole('heading', { name: 'Modern Stack' })
	expect(title).toBeInTheDocument()
})

Default.test('renders counter with initial value of 10', async ({ canvas }) => {
	const counterValue = await canvas.getByRole('status')
	expect(counterValue).toHaveTextContent('10')
})

Default.test('counter is functional in app context', async ({ canvas }) => {
	const incrementButton = await canvas.getByRole('button', { name: '+' })
	const counterValue = await canvas.getByRole('status')

	await incrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('11'))
})
