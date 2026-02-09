import { expect, waitFor, within } from 'storybook/test'

import preview from '#.storybook/preview'

import { App } from './App'

const meta = preview.meta({ component: App })

export default meta

export const Default = meta.story({})

Default.test('renders counters and the application title', async ({ canvas }) => {
	const counters = await canvas.findAllByRole('status')
	expect(counters).toHaveLength(2)

	const title = await canvas.findByRole('heading', { name: 'Modern Stack' })
	expect(title).toBeInTheDocument()
})

Default.test('counters has initial values', async ({ canvas }) => {
	const counter1 = await canvas.findByTestId('counter@counter1')
	const counter1Value = within(counter1).getByRole('status')
	expect(counter1Value).toHaveTextContent('10')

	const counter2 = await canvas.findByTestId('counter@counter2')
	const counter2Value = within(counter2).getByRole('status')
	expect(counter2Value).toHaveTextContent('20')
})

Default.test('counters are independent', async ({ canvas }) => {
	const counter1 = await canvas.findByTestId('counter@counter1')
	const counter1Value = within(counter1).getByRole('status')
	expect(counter1Value).toHaveTextContent('10')

	const counter2 = await canvas.findByTestId('counter@counter2')
	const counter2Value = within(counter2).getByRole('status')
	expect(counter2Value).toHaveTextContent('20')

	const incrementButton1 = within(counter1).getByRole('button', { name: '+' })
	await incrementButton1.click()
	await waitFor(() => {
		expect(counter1Value).toHaveTextContent('11')
		expect(counter2Value).toHaveTextContent('20')
	})

	const decrementButton2 = within(counter2).getByRole('button', { name: '-' })
	await decrementButton2.click()
	await waitFor(() => {
		expect(counter1Value).toHaveTextContent('11')
		expect(counter2Value).toHaveTextContent('19')
	})
})

Default.test('submits updated counter value to mocked api', async ({ canvas }) => {
	const counter1 = await canvas.findByTestId('counter@counter1')
	const incrementButton1 = within(counter1).getByRole('button', { name: '+' })
	await incrementButton1.click()

	await waitFor(async () => {
		const response = await fetch('/api/counters/counter-1')
		const payload = (await response.json()) as { data: { value: number } }
		expect(payload.data.value).toBe(11)
	})
})
