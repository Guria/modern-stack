import { expect, waitFor } from 'storybook/test'

import preview from '#.storybook/preview'

import { Counter } from './Counter'

const meta = preview.meta({ component: Counter })

export default meta

export const Default = meta.story({})

Default.test('increments and decrements the counter', async ({ canvas }) => {
	const decrementButton = await canvas.getByRole('button', { name: '-' })
	const incrementButton = await canvas.getByRole('button', { name: '+' })
	const counterValue = await canvas.getByTestId('counter-value')

	expect(counterValue).toHaveTextContent('0')

	await incrementButton.click()
	await incrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('2'))

	await decrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('1'))
})

Default.test('can decrement below zero', async ({ canvas }) => {
	const decrementButton = await canvas.getByRole('button', { name: '-' })
	const counterValue = await canvas.getByTestId('counter-value')

	await decrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('-1'))

	await decrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('-2'))
})

Default.test('can handle multiple increments', async ({ canvas }) => {
	const incrementButton = await canvas.getByRole('button', { name: '+' })
	const counterValue = await canvas.getByTestId('counter-value')

	await incrementButton.click()
	await incrementButton.click()
	await incrementButton.click()
	await incrementButton.click()
	await incrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('5'))
})

export const WithInitialValue = meta.story({
	args: { initial: 10 },
})

WithInitialValue.test('starts with the provided initial value', async ({ canvas }) => {
	const counterValue = await canvas.getByTestId('counter-value')
	expect(counterValue).toHaveTextContent('10')
})

WithInitialValue.test('can increment from initial value', async ({ canvas }) => {
	const incrementButton = await canvas.getByRole('button', { name: '+' })
	const counterValue = await canvas.getByTestId('counter-value')

	await incrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('11'))
})

WithInitialValue.test('can decrement from initial value', async ({ canvas }) => {
	const decrementButton = await canvas.getByRole('button', { name: '-' })
	const counterValue = await canvas.getByTestId('counter-value')

	await decrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('9'))
})

export const WithNegativeInitial = meta.story({
	args: { initial: -5 },
})

WithNegativeInitial.test('handles negative initial value', async ({ canvas }) => {
	const counterValue = await canvas.getByTestId('counter-value')
	expect(counterValue).toHaveTextContent('-5')
})

WithNegativeInitial.test('can increment from negative value', async ({ canvas }) => {
	const incrementButton = await canvas.getByRole('button', { name: '+' })
	const counterValue = await canvas.getByTestId('counter-value')

	await incrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('-4'))
})

WithNegativeInitial.test('can decrement from negative value', async ({ canvas }) => {
	const decrementButton = await canvas.getByRole('button', { name: '-' })
	const counterValue = await canvas.getByTestId('counter-value')

	await decrementButton.click()
	await waitFor(() => expect(counterValue).toHaveTextContent('-6'))
})
