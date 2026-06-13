import preview from '#.storybook/preview'
import { App } from '#app/App'
import { articleDetail } from '#entities/article/mocks/handlers'
import { articlesActor as I } from '#pages/articles/testing'
import { heading, role } from '#shared/test'

const meta = preview.meta({
	title: 'Integration/Articles/Detail',
	component: App,
	parameters: {
		layout: 'fullscreen',
		initialPath: 'articles/1',
	},
	loaders: [(ctx) => I.init(ctx)],
})

export default meta

export const HandlesArticleDetailServerError = meta.story({
	name: 'Article Detail Server Error',
	play: () => I.waitExit(role('status')),
	parameters: {
		msw: {
			handlers: { articleDetail: articleDetail.error },
		},
	},
})

HandlesArticleDetailServerError.test(
	'shows error state when article detail request fails',
	async () => {
		await I.scope(role('main'), async () => {
			await I.seeDetailError()
		})
	},
)

HandlesArticleDetailServerError.test('keeps detail error state when retry also fails', async () => {
	await I.scope(role('main'), async () => {
		await I.seeDetailError()
		await I.retry()
		await I.waitExit(role('status'))
		await I.seeDetailError()
	})
})

export const RecoversAfterArticleDetailRetry = meta.story({
	name: 'Article Detail Retry Success',
	play: () => I.waitExit(role('status')),
	parameters: {
		msw: {
			handlers: { articleDetail: articleDetail.retrySucceeds() },
		},
	},
})

RecoversAfterArticleDetailRetry.test('loads article detail after retry succeeds', async () => {
	await I.scope(role('main'), async () => {
		await I.seeDetailError()
		await I.retry()
		await I.waitExit(role('status'))
		await I.see(heading('Quarterly report').wait())
		await I.seeArticleDetail('Quarterly report')
	})
})

export const HandlesArticleDetailServerErrorMobile = meta.story({
	name: 'Article Detail Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesArticleDetailServerError.input.parameters,
	play: () => I.waitExit(role('status')),
})

HandlesArticleDetailServerErrorMobile.test(
	'[mobile] shows error state when article detail request fails',
	async () => {
		await I.scope(role('main'), async () => {
			await I.seeDetailError()
		})
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
		const detail = await I.see(role('main'))
		await I.seeDetailLoading(detail)
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
		const detail = await I.see(role('main'))
		await I.seeDetailLoading(detail)
	},
)
