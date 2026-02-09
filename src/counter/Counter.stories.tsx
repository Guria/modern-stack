import type { StoryContext } from '@storybook/react-vite'

import { reatomNumber, withCallHook } from '@reatom/core'
import { action as storyAction } from 'storybook/actions'
import { expect, waitFor } from 'storybook/test'

import preview from '#.storybook/preview'

import { Counter } from './Counter'

const meta = preview.meta({
	args: { initial: 0 },
	render: ({ initial }: { initial: number }, { name }: { name: string }) => {
		const countAtom = reatomNumber(initial, name)
		countAtom.decrement.extend(withCallHook(storyAction('decrement')))
		countAtom.increment.extend(withCallHook(storyAction('increment')))
		return <Counter countAtom={countAtom} />
	},
})

export default meta

const locs = {
	decrementButton: ({ canvas }) => canvas.getByRole('button', { name: '-' }),
	incrementButton: ({ canvas }) => canvas.getByRole('button', { name: '+' }),
	counterValue: ({ canvas }) => canvas.getByRole('status'),
} satisfies Record<string, (ctx: StoryContext) => Element | Promise<Element>>

async function expectCounterValue(counterValue: HTMLElement, expectedValue: number) {
	await waitFor(() => {
		expect(counterValue).toHaveTextContent(String(expectedValue))
	})
}

export const Default = meta.story({ args: { initial: 0 } })

Default.test('increments and decrements the counter', async function (ctx) {
	const decrementButton = await locs.decrementButton(ctx)
	const incrementButton = await locs.incrementButton(ctx)
	const counterValue = await locs.counterValue(ctx)

	await expectCounterValue(counterValue, 0)

	await incrementButton.click()
	await incrementButton.click()
	await expectCounterValue(counterValue, 2)

	await decrementButton.click()
	await expectCounterValue(counterValue, 1)
})

export const WithInitial = meta.story({ args: { initial: 1 } })

WithInitial.test('can decrement below zero', async function (ctx) {
	const decrementButton = await locs.decrementButton(ctx)
	const counterValue = await locs.counterValue(ctx)

	await decrementButton.click()
	await expectCounterValue(counterValue, 0)

	await decrementButton.click()
	await expectCounterValue(counterValue, -1)
})

export const WithNegativeInitial = meta.story({ args: { initial: -5 } })

WithNegativeInitial.test('handles negative initial value', async function (ctx) {
	const counterValue = await locs.counterValue(ctx)
	expect(counterValue).toHaveTextContent('-5')
})
