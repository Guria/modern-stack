import type { BaseActor } from './actor'
import { button, role } from './loc'

export const withRetryAndLoading =
	(loadingLabel: string) => (I: Pick<BaseActor, 'click' | 'dontSee' | 'see'>) => ({
		retry: () => I.click(button('Try again')),
		seeLoading: async () => {
			await I.see(role('status', loadingLabel))
			await I.dontSee(role('alert'))
		},
	})
