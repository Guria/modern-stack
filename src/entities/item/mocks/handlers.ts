import { assert } from '@reatom/core'
import { HttpResponse, delay, http } from 'msw'

import { itemsMockData } from '#entities/item/mocks/data'
import { composeApiUrl } from '#shared/api'
import { Error404 } from '#shared/mocks'
import { neverResolve, to500 } from '#shared/mocks/utils'

import { ITEMS_API_PATH } from '../api/itemsApi'

const listUrl = composeApiUrl(ITEMS_API_PATH)
const detailUrl = composeApiUrl(`${ITEMS_API_PATH}/:itemId`)

export const itemList = {
	default: http.get(listUrl, async () => {
		await delay()

		return HttpResponse.json(itemsMockData)
	}),
	error: http.get(listUrl, () => to500()),
	loading: http.get(listUrl, neverResolve),
}

export const itemDetail = {
	default: http.get(detailUrl, async ({ params }) => {
		await delay()

		const itemId = params['itemId']
		const item = itemsMockData.find((item) => item.id === itemId)
		assert(item, `Item with id ${itemId} not found in mock data`, Error404)

		return HttpResponse.json(item)
	}),
}

export const itemHandlers = [itemList.default, itemDetail.default]
