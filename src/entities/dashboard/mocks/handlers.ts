import { HttpResponse, delay, http } from 'msw'

import { DASHBOARD_API_PATH } from '#entities/dashboard/api/dashboardApi'
import { dashboardMockData } from '#entities/dashboard/mocks/data'
import { composeApiUrl } from '#shared/api'
import { neverResolve, to500 } from '#shared/mocks/utils'

const url = composeApiUrl(DASHBOARD_API_PATH)

export const dashboardStats = {
	default: http.get(url, async () => {
		await delay()

		return HttpResponse.json(dashboardMockData)
	}),
	error: http.get(url, () => to500()),
	loading: http.get(url, neverResolve),
}

export const dashboardHandlers = [dashboardStats.default]
