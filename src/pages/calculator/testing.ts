import { button, createActor, heading } from '#shared/test'

export const calculatorLoc = {
	heading: heading('Calculator'),
	acButton: button('AC'),
	equalsButton: button('='),
	zeroButton: button('0'),
}

export const calculatorActor = createActor().extend((I) => ({
	seeCalculatorContent: async () => {
		await I.see(calculatorLoc.heading)
		await I.see(calculatorLoc.acButton)
		await I.see(calculatorLoc.equalsButton)
		await I.see(calculatorLoc.zeroButton)
	},
}))
