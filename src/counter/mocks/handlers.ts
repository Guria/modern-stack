import { assert } from '@reatom/core'
import { http, HttpResponse } from 'msw'

import { composeApiUrl } from '#shared/api'
import { Error400, Error404, getParam } from '#shared/mocks/utils'

import { getCounter, listCounters, updateCounterValue } from './store'

function toErrorResponse(error: unknown): Response {
	if (error instanceof Error400 || error instanceof Error404) {
		return error.response
	}
	throw error
}

export const listCountersHandler = http.get(composeApiUrl('/counters'), async () =>
	HttpResponse.json({ data: listCounters() }),
)

export const getCounterHandler = http.get(
	composeApiUrl('/counters/:counterId'),
	async ({ params }) => {
		try {
			const counterId = getParam(params['counterId'])
			assert(counterId, 'Counter id is required.', Error400)

			const counter = getCounter(counterId)
			assert(counter, `Counter "${counterId}" was not found.`, Error404)

			return HttpResponse.json({ data: counter })
		} catch (error) {
			return toErrorResponse(error)
		}
	},
)

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
	try {
		const body = await request.json()
		return isRecord(body) ? body : null
	} catch {
		return null
	}
}

export const updateCounterValueHandler = http.patch(
	composeApiUrl('/counters/:counterId'),
	async ({ params, request }) => {
		try {
			const counterId = getParam(params['counterId'])
			assert(counterId, 'Counter id is required.', Error400)

			const payload = await readJson(request)
			assert(payload, 'Request body must be valid JSON.', Error400)

			const value = payload['value']
			assert(
				typeof value === 'number' && Number.isFinite(value),
				'Field "value" must be a finite number.',
				Error400,
			)

			const counter = updateCounterValue(counterId, value)
			assert(counter, `Counter "${counterId}" was not found.`, Error404)

			return HttpResponse.json({ data: counter })
		} catch (error) {
			return toErrorResponse(error)
		}
	},
)
