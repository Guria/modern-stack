import { assert } from '@reatom/core'
import { HttpResponse, delay, http } from 'msw'

import { timelineEventsMockData } from '#entities/timeline-event/mocks/data'
import { composeApiUrl } from '#shared/api'
import { Error404, Error500 } from '#shared/mocks'
import { neverResolve, to500 } from '#shared/mocks/utils'

import { TIMELINE_EVENTS_API_PATH } from '../api/timelineEventsApi'

const listUrl = composeApiUrl(TIMELINE_EVENTS_API_PATH)
const detailUrl = composeApiUrl(`${TIMELINE_EVENTS_API_PATH}/:timelineEventId`)

export const timelineEventList = {
	default: http.get(listUrl, async () => {
		await delay()

		return HttpResponse.json(timelineEventsMockData.map(({ description: _, ...rest }) => rest))
	}),
	error: http.get(listUrl, () => to500()),
	retrySucceeds: () => {
		let errorCount = 0
		return http.get(listUrl, async () => {
			assert(errorCount++ >= 2, 'Simulated server error', Error500)

			await delay()
			return HttpResponse.json(timelineEventsMockData.map(({ description: _, ...rest }) => rest))
		})
	},
	loading: http.get(listUrl, neverResolve),
}

export const timelineEventDetail = {
	default: http.get(detailUrl, async ({ params }) => {
		await delay()

		const timelineEventId = params['timelineEventId']
		const timelineEvent = timelineEventsMockData.find(
			(timelineEvent) => timelineEvent.id === timelineEventId,
		)
		assert(
			timelineEvent,
			`Timeline event with id ${timelineEventId} not found in mock data`,
			Error404,
		)

		return HttpResponse.json(timelineEvent)
	}),
}

export const timelineEventHandlers = [timelineEventList.default, timelineEventDetail.default]
