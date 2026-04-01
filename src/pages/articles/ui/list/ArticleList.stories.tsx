import preview from '#.storybook/preview'
import { articlesMockData } from '#entities/article/mocks/data'
import { m } from '#paraglide/messages.js'
import { button, createActor, link, role, text } from '#shared/test'

import { ArticleList } from './ArticleList'

const I = createActor()

const articles = articlesMockData.map((article) => ({
	article,
	href: `/articles/${article.id}`,
}))

const meta = preview.meta({
	title: 'Pages/Articles/ArticleList',
	component: ArticleList,
	args: {
		articles,
		selectedId: undefined,
	},
	parameters: { layout: 'padded' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders all articles in list', async () => {
	await I.scope(role('list', 'Articles'), async () => {
		await I.see(link(/Quarterly report/i))
		await I.see(link(/Hiring plan/i))
		await I.see(link(/Roadmap draft/i))
		await I.see(link(/Security audit/i))
		await I.see(link(/Design system update/i))
	})
})

Default.test('shows search toolbar with placeholder', async () => {
	await I.see((canvas) => canvas.getByPlaceholderText(m.article_search_placeholder()))
})

Default.test('shows new article button', async () => {
	await I.see(button('New article'))
})

Default.test('shows filters button', async () => {
	await I.see(button('Filters'))
})

Default.test('displays status badges', async () => {
	await I.see(text('Done').all())
	await I.see(text('In Progress').all())
	await I.see(text('Draft').all())
})

Default.test('displays article descriptions', async () => {
	await I.see(text(/Revenue overview and growth metrics/))
	await I.see(text(/Engineering headcount proposal/))
})

export const WithSelection = meta.story({
	name: 'With Selection',
	args: {
		articles,
		selectedId: '1',
	},
})

WithSelection.test('highlights selected article', async () => {
	await I.see(link(/Quarterly report/i).options({ current: 'page' }))
	await I.dontSee(link(/Hiring plan/i).options({ current: 'page' }))
})
