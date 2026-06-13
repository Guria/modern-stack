import { assertNoRouteLoaderAbortErrors } from '#.storybook/abortErrorGuard'
import preview from '#.storybook/preview'
import { App } from '#app/App'
import { articlesActor as I } from '#pages/articles/testing'
import { role } from '#shared/test'

const meta = preview.meta({
	title: 'Integration/Articles/List',
	component: App,
	parameters: {
		layout: 'fullscreen',
		initialPath: 'articles',
	},
	loaders: [(ctx) => I.init(ctx)],
})

export default meta

const assertExpectedDetailTeardown = async () => {
	await assertNoRouteLoaderAbortErrors('articleDetail')
}

export const Default = meta.story({
	name: 'Default',
	play: () => I.waitExit(role('status')),
})

Default.test('renders article list with no selection message', async () => {
	await I.seeNoSelection()
	await I.seeArticleList()
	await I.seeStatusBadges()
})

Default.test('shows search toolbar with new article button', async () => {
	await I.seeSearchToolbar()
})

Default.test('shows article descriptions in list items', async () => {
	await I.seeArticleDescription(/Revenue overview and growth metrics/)
	await I.seeArticleDescription(/Engineering headcount proposal/)
})

Default.test('shows article detail when article is clicked', async () => {
	await I.openArticle(/Quarterly report/i)
	await I.seeArticleDetail('Quarterly report')
})

Default.test('shows all content paragraphs in article detail', async () => {
	await I.openArticle(/Quarterly report/i)
	await I.seeArticleDetail('Quarterly report')
	await I.seeArticleDetailContent()
})

Default.test('shows edit button and status badge in article detail', async () => {
	await I.openArticle(/Quarterly report/i)
	await I.seeArticleDetail('Quarterly report')
	await I.seeArticleDetailStatus('Done')
})

Default.test('shows article description in detail view', async () => {
	await I.openArticle(/Quarterly report/i)
	await I.seeArticleDetailDescription(
		'Revenue overview and growth metrics for Q3 across all regions.',
	)
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	play: () => I.waitExit(role('status')),
})

DefaultMobile.test('[mobile] shows article list when no article is selected', async () => {
	await I.seeArticleList()
})

DefaultMobile.test('[mobile] shows search toolbar with new article button', async () => {
	await I.seeSearchToolbar()
})

DefaultMobile.test('[mobile] shows article detail when article is clicked', async () => {
	await I.openArticle(/Quarterly report/i)
	await I.seeArticleDetail('Quarterly report')
})

DefaultMobile.test('[mobile] shows all content paragraphs in article detail', async () => {
	await I.openArticle(/Quarterly report/i)
	await I.seeArticleDetail('Quarterly report')
	await I.seeArticleDetailContent()
})

DefaultMobile.test('[mobile] displays correct status badges for different statuses', async () => {
	await I.seeStatusBadges()
})

DefaultMobile.test('[mobile] can navigate back to article list', async () => {
	await I.openArticle(/Quarterly report/i)
	await I.seeArticleDetail('Quarterly report')
	await I.goBack()
	await I.see(role('list', 'Articles').wait())
	await assertExpectedDetailTeardown()
})
