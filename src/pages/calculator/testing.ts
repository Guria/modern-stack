import { button, createActor, heading } from '#shared/test'

export const calculatorLoc = {
	headingAppears: heading('Calculator'),
	acButtonAppears: button('AC'),
	equalsButtonAppears: button('='),
	zeroButtonAppears: button('0'),
}

export const calculatorActor = createActor().extend((I) => ({
	seeCalculatorContent: async () => {
		await I.see(calculatorLoc.headingAppears)
		await I.see(calculatorLoc.acButtonAppears)
		await I.see(calculatorLoc.equalsButtonAppears)
		await I.see(calculatorLoc.zeroButtonAppears)
	},
}))
