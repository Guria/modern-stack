import { createActor, heading, text } from '#shared/test'

export const pricingLoc = {
	headingAppears: heading('Pricing'),
	freePlanPriceAppears: text('$0/mo'),
	proPlanPriceAppears: text('$12/mo'),
	teamPlanPriceAppears: text('$29/mo'),
}

export const pricingActor = createActor().extend((I) => ({
	seePricingContent: async () => {
		await I.see(pricingLoc.headingAppears)
		await I.see(pricingLoc.freePlanPriceAppears)
		await I.see(pricingLoc.proPlanPriceAppears)
		await I.see(pricingLoc.teamPlanPriceAppears)
	},
}))
