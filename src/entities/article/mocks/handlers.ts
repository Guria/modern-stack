import { assert } from '@reatom/core'
import { HttpResponse, delay, http } from 'msw'

import { articlesMockData } from '#entities/article/mocks/data'
import { composeApiUrl } from '#shared/api'
import { Error404 } from '#shared/mocks'
import { neverResolve, to500 } from '#shared/mocks/utils'

import { ARTICLES_API_PATH } from '../api/articlesApi'

const listUrl = composeApiUrl(ARTICLES_API_PATH)
const detailUrl = composeApiUrl(`${ARTICLES_API_PATH}/:articleId`)

export const articleList = {
	default: http.get(listUrl, async () => {
		await delay()

		return HttpResponse.json(
			articlesMockData.map(({ content, ...rest }) => ({ ...rest, content: [content[0]] })),
		)
	}),
	error: http.get(listUrl, () => to500()),
	loading: http.get(listUrl, neverResolve),
}

export const articleDetail = {
	default: http.get(detailUrl, async ({ params }) => {
		await delay()

		const articleId = params['articleId']
		const article = articlesMockData.find((article) => article.id === articleId)
		assert(article, `Article with id ${articleId} not found in mock data`, Error404)

		return HttpResponse.json(article)
	}),
	error: http.get(detailUrl, () => to500()),
	loading: http.get(detailUrl, neverResolve),
}

export const articleHandlers = [articleList.default, articleDetail.default]
