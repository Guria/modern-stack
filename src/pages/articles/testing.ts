import { backButton, button, createActor, heading, link, role, text } from '#shared/test'

export const articlesLoc = {
	detailLoading: role('status', 'Loading article detail'),
}

export const articlesActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load articles').wait())
		await I.see(role('alert'))
		await I.see(button('Try again'))
	},
	seeLoading: async () => {
		await I.see(role('status', 'Loading articles page').wait())
		await I.dontSee(role('alert'))
	},
	goBack: async () => {
		await I.click(backButton('articles'))
	},
	seeArticleList: async () => {
		await I.see(link(/Quarterly report/i).wait())
		await I.see(link(/Hiring plan/i))
		await I.see(link(/Roadmap draft/i))
		await I.see(link(/Security audit/i))
		await I.see(link(/Design system update/i))
	},
	seeStatusBadges: async () => {
		await I.see(text('Done').all().wait())
		await I.see(text('In Progress').all())
		await I.see(text('Draft').all())
	},
}))
