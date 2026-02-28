import preview from '#.storybook/preview'
import { App } from '#app/App'
import { articleDetail, articleList } from '#entities/article/mocks/handlers'
import { articlesActor as I, articlesLoc as loc } from '#pages/articles/testing'

const meta = preview.meta({
	title: 'Integration/Articles',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'articles' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders article list with all articles', async () => {
	await I.seeArticleList()
})

Default.test('shows no-selection message when no article selected', async () => {
	await I.see(loc.noSelectionMessageAppears)
})

Default.test('shows article detail when article is clicked', async () => {
	await I.clickItem('Quarterly report')
	await I.seeDetail('Quarterly report')
})

Default.test('shows all content paragraphs in article detail', async () => {
	await I.clickItem('Quarterly report')

	const detail = await I.see(loc.detailRegionAppears)
	await I.see(loc.articleHeading('Quarterly report').within(detail))
	await I.seeText(/Regional performance remained strongest/, detail)
	await I.seeText(/EMEA showed stable retention/, detail)
	await I.seeText(/APAC growth accelerated/, detail)
	await I.seeText(/Gross margin improved/, detail)
	await I.seeText(/next planning cycle should prioritize/, detail)
})

Default.test('displays correct status badges for different statuses', async () => {
	await I.seeStatusBadges()
})

Default.test('can select different articles', async () => {
	await I.clickItem('Quarterly report')
	await I.seeDetail('Quarterly report')

	await I.clickItem('Hiring plan')
	await I.seeDetail('Hiring plan')
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] shows article list when no article is selected', async () => {
	await I.seeArticleList()
})

DefaultMobile.test('[mobile] shows article detail when article is clicked', async () => {
	await I.clickItem('Quarterly report')
	await I.seeDetail('Quarterly report')
})

DefaultMobile.test('[mobile] shows all content paragraphs in article detail', async () => {
	await I.clickItem('Quarterly report')

	const detail = await I.see(loc.detailRegionAppears)
	await I.see(loc.articleHeading('Quarterly report').within(detail))
	await I.seeText(/Regional performance remained strongest/, detail)
	await I.seeText(/EMEA showed stable retention/, detail)
	await I.seeText(/APAC growth accelerated/, detail)
	await I.seeText(/Gross margin improved/, detail)
	await I.seeText(/next planning cycle should prioritize/, detail)
})

DefaultMobile.test('[mobile] displays correct status badges for different statuses', async () => {
	await I.seeStatusBadges()
})

DefaultMobile.test('[mobile] can select different articles', async () => {
	await I.clickItem('Quarterly report')
	await I.seeDetail('Quarterly report')

	await I.goBack()

	await I.clickItem('Hiring plan')
	await I.seeDetail('Hiring plan')
})

export const HandlesArticlesLoadServerError = meta.story({
	name: 'Articles Load Server Error',
	parameters: {
		msw: {
			handlers: { articleList: articleList.error },
		},
	},
})

HandlesArticlesLoadServerError.test('shows error state when articles request fails', async () => {
	await I.seeError()
	await I.seeText("We couldn't load the article list. Try again in a moment.")
})

export const HandlesArticlesLoadServerErrorMobile = meta.story({
	name: 'Articles Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesArticlesLoadServerError.input.parameters,
})

HandlesArticlesLoadServerErrorMobile.test(
	'[mobile] shows error state when articles request fails',
	async () => {
		await I.seeError()
		await I.seeText("We couldn't load the article list. Try again in a moment.")
	},
)

export const KeepsLoadingWhenArticlesRequestNeverResolves = meta.story({
	name: 'Articles Request Loading State',
	parameters: {
		msw: {
			handlers: { articleList: articleList.loading },
		},
	},
})

KeepsLoadingWhenArticlesRequestNeverResolves.test(
	'keeps loading state for pending articles request',
	async () => {
		await I.seeLoading()
	},
)

export const KeepsLoadingWhenArticlesRequestNeverResolvesMobile = meta.story({
	name: 'Articles Request Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenArticlesRequestNeverResolves.input.parameters,
})

KeepsLoadingWhenArticlesRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending articles request',
	async () => {
		await I.seeLoading()
	},
)

export const HandlesArticleDetailServerError = meta.story({
	name: 'Article Detail Server Error',
	parameters: {
		msw: {
			handlers: { articleDetail: articleDetail.error },
		},
	},
})

HandlesArticleDetailServerError.test(
	'shows not found when article detail request fails',
	async () => {
		await I.clickItem('Quarterly report')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.articleHeading('Article not found').within(detail))
		await I.seeText(/No article exists for id/, detail)
	},
)

export const HandlesArticleDetailServerErrorMobile = meta.story({
	name: 'Article Detail Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesArticleDetailServerError.input.parameters,
})

HandlesArticleDetailServerErrorMobile.test(
	'[mobile] shows not found when article detail request fails',
	async () => {
		await I.clickItem('Quarterly report')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.articleHeading('Article not found').within(detail))
		await I.seeText(/No article exists for id/, detail)
	},
)

export const KeepsLoadingWhenArticleDetailNeverResolves = meta.story({
	name: 'Article Detail Loading State',
	parameters: {
		msw: {
			handlers: { articleDetail: articleDetail.loading },
		},
	},
})

KeepsLoadingWhenArticleDetailNeverResolves.test(
	'shows detail loading state while article detail is pending',
	async () => {
		await I.clickItem('Quarterly report')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.articleDetailLoading.within(detail))
		await I.dontSee(loc.maybeArticleHeading('Quarterly report').within(detail))
		await I.dontSeeText('Article not found', detail)
	},
)

export const KeepsLoadingWhenArticleDetailNeverResolvesMobile = meta.story({
	name: 'Article Detail Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenArticleDetailNeverResolves.input.parameters,
})

KeepsLoadingWhenArticleDetailNeverResolvesMobile.test(
	'[mobile] shows detail loading state while article detail is pending',
	async () => {
		await I.clickItem('Quarterly report')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.articleDetailLoading.within(detail))
		await I.dontSee(loc.maybeArticleHeading('Quarterly report').within(detail))
		await I.dontSeeText('Article not found', detail)
	},
)
