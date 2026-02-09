import { noop } from '@reatom/core'
import { HttpResponse, type JsonBodyType } from 'msw'

export const getParam = (param: string | readonly string[] | undefined): string | undefined => {
	if (typeof param === 'string') {
		return param
	}
	if (Array.isArray(param)) {
		return param[0]
	}
	return undefined
}

export const to404 = (payload: JsonBodyType = { error: [] }) =>
	HttpResponse.json(payload, { status: 404 })

export class Error404 extends Error {
	readonly response: ReturnType<typeof to404>

	constructor(...args: ConstructorParameters<typeof Error>) {
		super(...args)
		this.name = 'Error404'
		this.response = to404({ error: { message: args[0] } })
	}
}

export const to400 = (payload: JsonBodyType = { error: [] }) =>
	HttpResponse.json(payload, { status: 400 })

export class Error400 extends Error {
	readonly response: ReturnType<typeof to400>

	constructor(...args: ConstructorParameters<typeof Error>) {
		super(...args)
		this.name = 'Error400'
		this.response = to400({ error: { message: args[0] } })
	}
}

export const to500 = (payload: JsonBodyType = { error: ['Server error'] }) =>
	HttpResponse.json(payload, { status: 500 })

export class Error500 extends Error {
	readonly response: ReturnType<typeof to500>

	constructor(...args: ConstructorParameters<typeof Error>) {
		super(...args)
		this.name = 'Error500'
		this.response = to500({ error: { message: args[0] } })
	}
}

export const neverResolve = async (): Promise<never> => new Promise(noop)
