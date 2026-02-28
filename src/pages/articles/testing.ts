import { createActor, link, textAll } from '#shared/test'
import { dataPage, dataPageLoc } from '#widgets/data-page/testing'
import { masterDetail, masterDetailLoc } from '#widgets/master-details/testing'

const mdLoc = masterDetailLoc('article')

export const articlesLoc = {
	...dataPageLoc('articles'),
	...mdLoc,
	noSelectionMessageAppears: mdLoc.noSelectionMessageAppears,
	articleHeading: mdLoc.detailHeading,
	maybeArticleHeading: mdLoc.maybeDetailHeading,
	articleDetailLoading: mdLoc.detailLoading,
}

export const articlesActor = createActor()
	.extend(dataPage(articlesLoc))
	.extend(masterDetail('articles'))
	.extend((I) => ({
		seeArticleList: async () => {
			await I.see(link(/Quarterly report/i))
			await I.see(link(/Hiring plan/i))
			await I.see(link(/Roadmap draft/i))
			await I.see(link(/Security audit/i))
			await I.see(link(/Design system update/i))
		},
		seeStatusBadges: async () => {
			await I.see(textAll('Done'))
			await I.see(textAll('In Progress'))
			await I.see(textAll('Draft'))
		},
	}))
