import { http, HttpResponse } from 'msw'
import { expect, within } from 'storybook/test'

import preview from '#.storybook/preview'
import { App } from '#app/App'
import { handlersArray } from '#app/mocks/handlers'
import { ARTICLES_API_PATH } from '#entities/article'
import { composeApiUrl } from '#shared/api'
import { neverResolve } from '#shared/mocks/utils'
import { createMyself, type Locator } from '#shared/test'

const articlesApiUrl = composeApiUrl(ARTICLES_API_PATH)
const articleDetailApiUrl = composeApiUrl(`${ARTICLES_API_PATH}/:articleId`)

const to500 = () => new HttpResponse(null, { status: 500 })

const loc = {
	noSelectionMessageAppears: (canvas) => canvas.findByText('Select an article to view details.'),
	articlesLoadingStateAppears: (canvas) =>
		canvas.findByRole('status', { name: 'Loading articles page' }),
	articlesErrorHeadingAppears: (canvas) =>
		canvas.findByRole('heading', { name: 'Could not load articles' }),
	maybeArticlesErrorHeading: (canvas) =>
		canvas.queryByRole('heading', { name: 'Could not load articles' }),
	articlesAlertRegionAppears: (canvas) => canvas.findByRole('alert'),
	retryButtonAppears: (canvas) => canvas.findByRole('button', { name: 'Try again' }),
	detailRegionAppears: (canvas) => canvas.findByRole('main'),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	goBackToArticles: async () => {
		await I.click((canvas) => canvas.findByLabelText('Back to articles'))
	},
	clickArticle: async (name: string | RegExp) => {
		const pattern = typeof name === 'string' ? new RegExp(name, 'i') : name
		await I.click((canvas) => canvas.findByRole('link', { name: pattern }))
	},
	seeArticleList: async () => {
		await I.see((canvas) => canvas.findByRole('link', { name: /Quarterly report/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /Hiring plan/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /Roadmap draft/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /Security audit/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /Design system update/i }))
	},
	seeStatusBadges: async () => {
		await I.see((canvas) => canvas.findAllByText('Done').then((els: HTMLElement[]) => els[0]!))
		await I.see((canvas) =>
			canvas.findAllByText('In Progress').then((els: HTMLElement[]) => els[0]!),
		)
		await I.see((canvas) => canvas.findAllByText('Draft').then((els: HTMLElement[]) => els[0]!))
	},
	seeArticleDetail: async (name: string | RegExp) => {
		await I.see((canvas) => canvas.findByRole('heading', { name }))
	},
	seeArticlesError: async () => {
		await I.see(loc.articlesErrorHeadingAppears)
		await I.see(loc.articlesAlertRegionAppears)
		await I.see(loc.retryButtonAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'articles' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders article list with all articles', async () => {
	await I.seeArticleList()
})

Default.test('shows no-selection message when no article selected', async () => {
	await I.see(loc.noSelectionMessageAppears)
})

Default.test('shows article detail when article is clicked', async () => {
	await I.clickArticle('Quarterly report')
	await I.seeArticleDetail('Quarterly report')
})

Default.test('shows all content paragraphs in article detail', async () => {
	await I.clickArticle('Quarterly report')

	const detail = await I.resolveLocator(loc.detailRegionAppears)
	const detailCanvas = within(detail)
	await detailCanvas.findByRole('heading', { name: 'Quarterly report' })
	await detailCanvas.findByText(/Regional performance remained strongest/)
	await detailCanvas.findByText(/EMEA showed stable retention/)
	await detailCanvas.findByText(/APAC growth accelerated/)
	await detailCanvas.findByText(/Gross margin improved/)
	await detailCanvas.findByText(/next planning cycle should prioritize/)
})

Default.test('displays correct status badges for different statuses', async () => {
	await I.seeStatusBadges()
})

Default.test('can select different articles', async () => {
	await I.clickArticle('Quarterly report')
	await I.seeArticleDetail('Quarterly report')

	await I.clickArticle('Hiring plan')
	await I.seeArticleDetail('Hiring plan')
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders article list with all articles', async () => {
	await I.seeArticleList()
})

DefaultMobile.test('[mobile] shows article list when no article is selected', async () => {
	await I.seeArticleList()
})

DefaultMobile.test('[mobile] shows article detail when article is clicked', async () => {
	await I.clickArticle('Quarterly report')
	await I.seeArticleDetail('Quarterly report')
})

DefaultMobile.test('[mobile] shows all content paragraphs in article detail', async () => {
	await I.clickArticle('Quarterly report')

	const detail = await I.resolveLocator(loc.detailRegionAppears)
	const detailCanvas = within(detail)
	await detailCanvas.findByRole('heading', { name: 'Quarterly report' })
	await detailCanvas.findByText(/Regional performance remained strongest/)
	await detailCanvas.findByText(/EMEA showed stable retention/)
	await detailCanvas.findByText(/APAC growth accelerated/)
	await detailCanvas.findByText(/Gross margin improved/)
	await detailCanvas.findByText(/next planning cycle should prioritize/)
})

DefaultMobile.test('[mobile] displays correct status badges for different statuses', async () => {
	await I.seeStatusBadges()
})

DefaultMobile.test('[mobile] can select different articles', async () => {
	await I.clickArticle('Quarterly report')
	await I.seeArticleDetail('Quarterly report')

	await I.goBackToArticles()

	await I.clickArticle('Hiring plan')
	await I.seeArticleDetail('Hiring plan')
})

export const HandlesArticlesLoadServerError = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(articlesApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesArticlesLoadServerError.test('shows error state when articles request fails', async () => {
	await I.seeArticlesError()
	await I.see((canvas) =>
		canvas.findByText("We couldn't load the article list. Try again in a moment."),
	)
})

HandlesArticlesLoadServerError.test('renders as an alert region', async () => {
	await I.see(loc.articlesAlertRegionAppears)
})

HandlesArticlesLoadServerError.test('shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const HandlesArticlesLoadServerErrorMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(articlesApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesArticlesLoadServerErrorMobile.test(
	'[mobile] shows error state when articles request fails',
	async () => {
		await I.seeArticlesError()
		await I.see((canvas) =>
			canvas.findByText("We couldn't load the article list. Try again in a moment."),
		)
	},
)

HandlesArticlesLoadServerErrorMobile.test('[mobile] renders as an alert region', async () => {
	await I.see(loc.articlesAlertRegionAppears)
})

HandlesArticlesLoadServerErrorMobile.test('[mobile] shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const KeepsLoadingWhenArticlesRequestNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(articlesApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenArticlesRequestNeverResolves.test(
	'keeps loading state for pending articles request',
	async () => {
		await I.see(loc.articlesLoadingStateAppears)
		await I.dontSee(loc.maybeArticlesErrorHeading)
	},
)

export const KeepsLoadingWhenArticlesRequestNeverResolvesMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(articlesApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenArticlesRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending articles request',
	async () => {
		await I.see(loc.articlesLoadingStateAppears)
		await I.dontSee(loc.maybeArticlesErrorHeading)
	},
)

export const HandlesArticleDetailServerError = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(articleDetailApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesArticleDetailServerError.test(
	'shows not found when article detail request fails',
	async () => {
		await I.clickArticle('Quarterly report')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		await detailCanvas.findByRole('heading', { name: 'Article not found' })
		await detailCanvas.findByText('No article exists for id "1".')
	},
)

export const HandlesArticleDetailServerErrorMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(articleDetailApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesArticleDetailServerErrorMobile.test(
	'[mobile] shows not found when article detail request fails',
	async () => {
		await I.clickArticle('Quarterly report')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		await detailCanvas.findByRole('heading', { name: 'Article not found' })
		await detailCanvas.findByText('No article exists for id "1".')
	},
)

export const KeepsLoadingWhenArticleDetailNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(articleDetailApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenArticleDetailNeverResolves.test(
	'shows detail loading state while article detail is pending',
	async () => {
		await I.clickArticle('Quarterly report')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		const loadingState = await detailCanvas.findByRole('status', {
			name: 'Loading article detail',
		})
		expect(loadingState).toBeInTheDocument()
		expect(
			detailCanvas.queryByRole('heading', { name: 'Quarterly report' }),
		).not.toBeInTheDocument()
		expect(detailCanvas.queryByText('Article not found')).not.toBeInTheDocument()
	},
)

export const KeepsLoadingWhenArticleDetailNeverResolvesMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(articleDetailApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenArticleDetailNeverResolvesMobile.test(
	'[mobile] shows detail loading state while article detail is pending',
	async () => {
		await I.clickArticle('Quarterly report')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		const loadingState = await detailCanvas.findByRole('status', {
			name: 'Loading article detail',
		})
		expect(loadingState).toBeInTheDocument()
		expect(
			detailCanvas.queryByRole('heading', { name: 'Quarterly report' }),
		).not.toBeInTheDocument()
		expect(detailCanvas.queryByText('Article not found')).not.toBeInTheDocument()
	},
)
