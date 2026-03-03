import { button, createActor, heading, link, role, text } from '#shared/test'

export const articlesActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load articles'))
		await I.see(role('alert'))
		await I.see(button('Try again'))
	},
	seeLoading: async () => {
		await I.see(role('status', 'Loading articles page'))
		await I.dontSee(role('alert'))
	},
	goBack: async () => {
		await I.click((canvas) => canvas.findByLabelText('Back to articles'))
	},
	seeArticleList: async () => {
		await I.see(link(/Quarterly report/i))
		await I.see(link(/Hiring plan/i))
		await I.see(link(/Roadmap draft/i))
		await I.see(link(/Security audit/i))
		await I.see(link(/Design system update/i))
	},
	seeStatusBadges: async () => {
		await I.see(text('Done').all())
		await I.see(text('In Progress').all())
		await I.see(text('Draft').all())
	},
}))
