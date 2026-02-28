import type { StoryContext } from '@storybook/react-vite'

export type Canvas = NonNullable<StoryContext['canvas']>

export type Locator = (canvas: Canvas) => HTMLElement | null | Promise<HTMLElement | null>
export type DefiniteLocator = (canvas: Canvas) => HTMLElement | Promise<HTMLElement>
export type ArrayLocator = (canvas: Canvas) => Array<HTMLElement> | Promise<Array<HTMLElement>>
export type AnyLocator = Locator | DefiniteLocator | ArrayLocator

type WithinScope = HTMLElement | 'global'

type Refined<L extends AnyLocator> = L & {
	within: (element: WithinScope) => Refined<L>
	__within?: WithinScope
}

export function loc(fn: DefiniteLocator, scope?: WithinScope): Refined<DefiniteLocator>
export function loc(fn: ArrayLocator, scope?: WithinScope): Refined<ArrayLocator>
export function loc(fn: Locator, scope?: WithinScope): Refined<Locator>
export function loc(fn: AnyLocator, scope?: WithinScope): Refined<AnyLocator> {
	return Object.assign(((canvas: Canvas) => fn(canvas)) as AnyLocator, {
		within: (element: WithinScope) => loc(fn as Locator, element),
		__within: scope,
	}) as Refined<AnyLocator>
}

type NameOption = string | RegExp

export const heading = (name: NameOption) => loc((canvas) => canvas.findByRole('heading', { name }))

export const button = (name: NameOption) => loc((canvas) => canvas.findByRole('button', { name }))

export const link = (name: NameOption) => loc((canvas) => canvas.findByRole('link', { name }))

export const text = (value: NameOption) => loc((canvas) => canvas.findByText(value))

export const textAll = (value: NameOption) => loc((canvas) => canvas.findAllByText(value))
