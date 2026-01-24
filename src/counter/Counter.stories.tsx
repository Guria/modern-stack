import { expect, waitFor } from 'storybook/test'

import preview from '#.storybook/preview'

import { Counter } from './Counter'

const meta = preview.meta({ component: Counter })

export const Default = meta.story({})

Default.test('increments and decrements the counter', async ({ canvas }) => {
	const decrementButton = await canvas.getByRole('button', { name: '-' })
	const incrementButton = await canvas.getByRole('button', { name: '+' })
	const counterValue = await canvas.getByText('0')

	await incrementButton.click()
	await incrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('2'))

	await decrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('1'))
})

export const WithInitialValue = meta.story({
	args: { initial: 10 },
})
