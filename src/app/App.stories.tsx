import { http, HttpResponse } from 'msw'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import preview from '#.storybook/preview'
import { composeApiUrl } from '#shared/api'
import { neverResolve, to500 } from '#shared/mocks/utils'

import { App } from './App'

const meta = preview.meta({ component: App })

export default meta

const baseCountersPayload = [
	{ id: 'counter-1', label: 'Main counter', value: 10 },
	{ id: 'counter-2', label: 'Secondary counter', value: 20 },
] as const

const listCountersSuccessHandler = http.get(composeApiUrl('/counters'), async () =>
	HttpResponse.json({ data: baseCountersPayload }),
)

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

Default.test('creates a new counter from form values', async ({ canvas }) => {
	const nameInput = (await canvas.findByLabelText('Counter name')) as HTMLInputElement
	const initialValueInput = (await canvas.findByLabelText('Initial value')) as HTMLInputElement

	await userEvent.clear(nameInput)
	await userEvent.type(nameInput, 'Story counter')

	await userEvent.clear(initialValueInput)
	await userEvent.type(initialValueInput, '42')

	const submitButton = await canvas.findByRole('button', { name: 'Add counter' })
	await submitButton.click()

	await canvas.findByRole('heading', { name: 'Story counter' })
	expect(canvas.queryByText(/missing async stack/i)).not.toBeInTheDocument()

	await waitFor(async () => {
		const response = await fetch('/api/counters')
		const payload = (await response.json()) as { data: Array<{ label: string; value: number }> }
		expect(
			payload.data.some((counter) => counter.label === 'Story counter' && counter.value === 42),
		).toBe(true)
	})
})

Default.test('deletes a counter', async ({ canvas }) => {
	const counter1Heading = await canvas.findByRole('heading', { name: 'Main counter' })
	const counterSection = counter1Heading.closest('div')
	expect(counterSection).not.toBeNull()

	const deleteButton = within(counterSection!).getByRole('button', { name: 'Delete' })
	await deleteButton.click()

	await waitFor(() => {
		expect(canvas.queryByRole('heading', { name: 'Main counter' })).not.toBeInTheDocument()
	})

	const response = await fetch('/api/counters/counter-1')
	expect(response.status).toBe(404)
})

export const HandlesCountersLoadServerError = meta.story({
	parameters: {
		msw: {
			handlers: {
				listCountersHandler: http.get(composeApiUrl('/counters'), to500),
			},
		},
	},
})

HandlesCountersLoadServerError.test(
	'shows load error when counters request fails',
	async ({ canvas }) => {
		await canvas.findByRole('heading', { name: 'Modern Stack' })
		await canvas.findByText('Failed to load counters.')
	},
)

export const KeepsLoadingWhenCountersRequestNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: {
				listCountersHandler: http.get(composeApiUrl('/counters'), neverResolve),
			},
		},
	},
})

KeepsLoadingWhenCountersRequestNeverResolves.test(
	'keeps loading state for pending counters request',
	async ({ canvas }) => {
		await canvas.findByRole('heading', { name: 'Modern Stack' })
		await canvas.findByText('Loading counters...')
	},
)

export const HandlesCreateCounterServerError = meta.story({
	parameters: {
		msw: {
			handlers: {
				listCountersHandler: listCountersSuccessHandler,
				createCounterHandler: http.post(composeApiUrl('/counters'), to500),
			},
		},
	},
})

HandlesCreateCounterServerError.test('shows submit error on create failure', async ({ canvas }) => {
	const nameInput = (await canvas.findByLabelText('Counter name')) as HTMLInputElement
	const initialValueInput = (await canvas.findByLabelText('Initial value')) as HTMLInputElement

	await userEvent.clear(nameInput)
	await userEvent.type(nameInput, 'Will fail')
	await userEvent.clear(initialValueInput)
	await userEvent.type(initialValueInput, '7')

	const submitButton = await canvas.findByRole('button', { name: 'Add counter' })
	await submitButton.click()

	await canvas.findByText(/status 500/i)
	expect(canvas.queryByText(/missing async stack/i)).not.toBeInTheDocument()
	expect(canvas.queryByRole('heading', { name: 'Will fail' })).not.toBeInTheDocument()
})

export const DisablesCreateCounterDuringSubmitTimeout = meta.story({
	parameters: {
		msw: {
			handlers: {
				listCountersHandler: listCountersSuccessHandler,
				createCounterHandler: http.post(composeApiUrl('/counters'), neverResolve),
			},
		},
	},
})

DisablesCreateCounterDuringSubmitTimeout.test(
	'disables form submit while create request is pending',
	async ({ canvas }) => {
		const nameInput = (await canvas.findByLabelText('Counter name')) as HTMLInputElement
		await userEvent.clear(nameInput)
		await userEvent.type(nameInput, 'Pending counter')

		const submitButton = await canvas.findByRole('button', { name: 'Add counter' })
		await submitButton.click()

		await waitFor(() => {
			expect(submitButton).toBeDisabled()
		})
	},
)

export const KeepsCounterWhenDeleteFails = meta.story({
	parameters: {
		msw: {
			handlers: {
				listCountersHandler: listCountersSuccessHandler,
				deleteCounterHandler: http.delete(composeApiUrl('/counters/:counterId'), to500),
			},
		},
	},
})

KeepsCounterWhenDeleteFails.test(
	'does not remove counter from ui when delete request fails',
	async ({ canvas }) => {
		const counter1Heading = await canvas.findByRole('heading', { name: 'Main counter' })
		const counterSection = counter1Heading.closest('div')
		expect(counterSection).not.toBeNull()

		const deleteButton = within(counterSection!).getByRole('button', { name: 'Delete' })
		await deleteButton.click()

		await waitFor(() => {
			expect(canvas.getByRole('heading', { name: 'Main counter' })).toBeInTheDocument()
		})
	},
)
