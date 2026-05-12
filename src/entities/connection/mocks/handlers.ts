import { assert } from '@reatom/core'
import { HttpResponse, delay, http } from 'msw'

import { connectionsMockData } from '#entities/connection/mocks/data'
import { composeApiUrl } from '#shared/api'
import { Error404, Error500 } from '#shared/mocks'
import { neverResolve, to500 } from '#shared/mocks/utils'

import { CONNECTIONS_API_PATH } from '../api/connectionsApi'

const listUrl = composeApiUrl(CONNECTIONS_API_PATH)
const detailUrl = composeApiUrl(`${CONNECTIONS_API_PATH}/:connectionId`)

export const connectionList = {
	default: http.get(listUrl, async () => {
		await delay()

		return HttpResponse.json(connectionsMockData.map(({ details: _, ...rest }) => rest))
	}),
	error: http.get(listUrl, () => to500()),
	retrySucceeds: () => {
		let errorCount = 0
		return http.get(listUrl, async () => {
			assert(errorCount++ >= 2, 'Simulated server error', Error500)

			await delay()
			return HttpResponse.json(connectionsMockData.map(({ details: _, ...rest }) => rest))
		})
	},
	loading: http.get(listUrl, neverResolve),
}

export const connectionDetail = {
	default: http.get(detailUrl, async ({ params }) => {
		await delay()

		const connectionId = params['connectionId']
		const connection = connectionsMockData.find((connection) => connection.id === connectionId)
		assert(connection, `Connection with id ${connectionId} not found in mock data`, Error404)

		return HttpResponse.json(connection)
	}),
	error: http.get(detailUrl, () => to500()),
	retrySucceeds: () => {
		let errorCount = 0
		return http.get(detailUrl, async ({ params }) => {
			assert(errorCount++ >= 2, 'Simulated server error', Error500)

			await delay()
			const connectionId = params['connectionId']
			const connection = connectionsMockData.find((connection) => connection.id === connectionId)
			assert(connection, `Connection with id ${connectionId} not found in mock data`, Error404)
			return HttpResponse.json(connection)
		})
	},
	loading: http.get(detailUrl, neverResolve),
}

export const connectionHandlers = [connectionList.default, connectionDetail.default]
