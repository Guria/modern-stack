import type { StoryContext } from '@storybook/react-vite'

import { assert } from '@reatom/core'
import { expect, waitFor, within as withinElement } from 'storybook/test'

import type { AnyLocator, Canvas, DefiniteLocator, Locator } from './loc'

export { assert, waitFor }

type Refined<L> = L & { __within?: HTMLElement | 'global' }

// Inspired by codecept.js
function createBase(ctx: () => StoryContext) {
	function canvasFor(locator: AnyLocator): Canvas {
		const scope = (locator as Refined<AnyLocator>).__within
		if (scope === 'global') return withinElement(ctx().canvasElement.ownerDocument.body)
		if (scope) return withinElement(scope)
		return ctx().canvas
	}

	async function resolveLocator(locator: AnyLocator) {
		return await locator(canvasFor(locator))
	}

	const click = async (locator: DefiniteLocator) => {
		const el = await resolveLocator(locator)
		assert(el instanceof HTMLElement, 'Expected locator to resolve to an HTMLElement')
		await ctx().userEvent.click(el)
	}

	return {
		resolveLocator,
		see: async (locator: AnyLocator) => {
			const result = await resolveLocator(locator)
			const el = Array.isArray(result) ? result[0] : result
			expect(el).toBeInTheDocument()
			assert(el instanceof HTMLElement, 'Expected locator to resolve to an HTMLElement')
			return el
		},
		dontSee: async (locator: Locator) => {
			expect(await resolveLocator(locator)).toBeNull()
		},
		seeText: async (text: string | RegExp, within?: HTMLElement) => {
			const canvas = within ? withinElement(within) : ctx().canvas
			const el = await canvas.findByText(text)
			expect(el).toBeInTheDocument()
			return el
		},
		dontSeeText: async (text: string | RegExp, within?: HTMLElement) => {
			const canvas = within ? withinElement(within) : ctx().canvas
			expect(canvas.queryByText(text)).toBeNull()
		},
		seeInField: async (locator: DefiniteLocator, value: string | number) => {
			const el = await resolveLocator(locator)
			assert(el instanceof HTMLElement, 'Expected locator to resolve to an HTMLElement')
			expect(el).toHaveValue(value)
		},
		click,
		fill: async (locator: DefiniteLocator, value: string) => {
			const { userEvent } = ctx()
			await waitFor(async () => {
				const el = await resolveLocator(locator)
				assert(el instanceof HTMLInputElement, 'Expected locator to resolve to an HTMLInputElement')
				await userEvent.click(el)
				await userEvent.type(el, value, {
					initialSelectionStart: 0,
					initialSelectionEnd: el.value.length,
				})
				expect(el.value).toBe(value)
			})
			await userEvent.tab()
		},
		selectOption: async (locator: DefiniteLocator, value: string | RegExp) => {
			const rootCanvas = withinElement(ctx().canvasElement.ownerDocument.body)
			await click(locator)
			await click((_canvas) => rootCanvas.getByRole('option', { name: value }))
		},
		clear: async (locator: DefiniteLocator) => {
			const { userEvent } = ctx()
			await waitFor(async () => {
				const el = await resolveLocator(locator)
				assert(el instanceof HTMLInputElement, 'Expected locator to resolve to an HTMLInputElement')
				await userEvent.click(el)
				await userEvent.clear(el)
				expect(el.value).toBe('')
			})
		},
	}
}

export type BaseActor = ReturnType<typeof createBase>

type Actor<T extends Record<string, unknown>> = BaseActor &
	T & {
		init: (context: StoryContext) => void
		extend: <U extends Record<string, unknown>>(
			extension: (current: BaseActor & T) => U,
		) => Actor<T & U>
	}

export const createActor = () => {
	let _ctx: StoryContext | null = null

	function ctx() {
		assert(_ctx !== null, 'I.init(ctx) must be called before using I methods')
		return _ctx
	}

	function makeActor<M extends Record<string, unknown>>(methods: BaseActor & M): Actor<M> {
		return Object.assign({}, methods, {
			init: (context: StoryContext) => {
				_ctx = context
			},
			extend: <U extends Record<string, unknown>>(
				ext: (current: BaseActor & M) => U,
			): Actor<M & U> => {
				const extra = ext(methods)
				return makeActor<M & U>({ ...methods, ...extra } as BaseActor & (M & U))
			},
		})
	}

	return makeActor(createBase(ctx))
}
