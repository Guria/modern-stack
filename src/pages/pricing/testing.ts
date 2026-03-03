import { createActor, heading, text } from '#shared/test'

export const pricingLoc = {
	heading: heading('Pricing'),
	freePlanPrice: text('$0/mo'),
	proPlanPrice: text('$12/mo'),
	teamPlanPrice: text('$29/mo'),
}

export const pricingActor = createActor().extend((I) => ({
	seePricingContent: async () => {
		await I.see(pricingLoc.heading)
		await I.see(pricingLoc.freePlanPrice)
		await I.see(pricingLoc.proPlanPrice)
		await I.see(pricingLoc.teamPlanPrice)
	},
}))
