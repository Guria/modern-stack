import { createActor, link, textAll } from '#shared/test'
import { dataPage, dataPageLoc } from '#widgets/data-page/testing'
import { masterDetail, masterDetailLoc } from '#widgets/master-details/testing'

const mdLoc = masterDetailLoc('connection')

export const connectionsLoc = {
	...dataPageLoc('connections'),
	...mdLoc,
	noSelectionMessageAppears: mdLoc.noSelectionMessageAppears,
	connectionHeading: mdLoc.detailHeading,
	maybeConnectionHeading: mdLoc.maybeDetailHeading,
	connectionDetailLoading: mdLoc.detailLoading,
}

export const connectionsActor = createActor()
	.extend(dataPage(connectionsLoc))
	.extend(masterDetail('connections'))
	.extend((I) => ({
		seeConnectionList: async () => {
			await I.see(link(/Stripe API/i))
			await I.see(link(/Analytics DB/i))
			await I.see(link(/Slack Notifications/i))
			await I.see(link(/Auth0 SSO/i))
			await I.see(link(/S3 Data Lake/i))
		},
		seeStatusBadges: async () => {
			await I.see(textAll('Active'))
			await I.see(textAll('Inactive'))
			await I.see(textAll('Error'))
		},
		seeTypeBadges: async () => {
			await I.see(textAll('API'))
			await I.see(textAll('Database'))
			await I.see(textAll('Webhook'))
		},
	}))
