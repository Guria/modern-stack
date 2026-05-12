import { assert } from '@reatom/core'
import { HttpResponse, delay, http } from 'msw'

import { DASHBOARD_API_PATH } from '#entities/dashboard/api/dashboardApi'
import { dashboardMockData } from '#entities/dashboard/mocks/data'
import { composeApiUrl } from '#shared/api'
import { Error500 } from '#shared/mocks'
import { neverResolve, to500 } from '#shared/mocks/utils'

const url = composeApiUrl(DASHBOARD_API_PATH)

export const dashboardStats = {
	default: http.get(url, async () => {
		await delay()

		return HttpResponse.json(dashboardMockData)
	}),
	error: http.get(url, () => to500()),
	retrySucceeds: () => {
		let errorCount = 0
		return http.get(url, async () => {
			assert(errorCount++ >= 2, 'Simulated server error', Error500)

			await delay()
			return HttpResponse.json(dashboardMockData)
		})
	},
	loading: http.get(url, neverResolve),
}

export const dashboardHandlers = [dashboardStats.default]
