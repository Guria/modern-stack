import { m } from '#paraglide/messages.js'
import {
	button,
	createActor,
	heading,
	link,
	role,
	text,
	withDetailError,
	withPageError,
	withRetryAndLoading,
} from '#shared/test'

const ARTICLE_LINKS = [
	/Quarterly report/i,
	/Hiring plan/i,
	/Roadmap draft/i,
	/Security audit/i,
	/Design system update/i,
] as const

export const articlesActor = createActor()
	.extend(withRetryAndLoading('Loading articles page'))
	.extend(
		withPageError({
			title: 'Could not load articles',
			description: "We couldn't load the article list. Try again in a moment.",
		}),
	)
	.extend(
		withDetailError({
			title: 'Could not load article',
			description: "We couldn't load this article. Try again in a moment.",
		}),
	)
	.extend((I) => ({
		goBack: async () => {
			await I.click((canvas) => canvas.findByLabelText('Back to articles'))
		},
		seeArticleList: async () => {
			await I.scope(role('list', 'Articles'), async () => {
				await Promise.all(ARTICLE_LINKS.map((name) => I.see(link(name))))
			})
		},
		seeStatusBadges: async () => {
			await I.see(text('Done').all())
			await I.see(text('In Progress').all())
			await I.see(text('Draft').all())
		},
		seeSearchToolbar: async () => {
			await I.scope(role('navigation', m.nav_articles()), async () => {
				await I.see((canvas) => canvas.getByPlaceholderText(m.article_search_placeholder()))
				await I.see(button('Filters'))
				await I.see(button('New article'))
			})
		},
		seeArticleDetail: async (title: string) => {
			await I.see(heading(title))
			await I.see(button('Edit'))
		},
		seeArticleNotFound: async (articleId: string) => {
			await I.see(heading('Article not found'))
			await I.see(text(`No article exists for id "${articleId}".`))
		},
		seeArticleDescription: async (pattern: RegExp) => {
			await I.see(text(pattern))
		},
	}))
