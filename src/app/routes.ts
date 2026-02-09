import { reatomNumber, reatomRoute, withChangeHook, wrap } from '@reatom/core'

import { getCounters, updateCounterValue } from '#counter/api'

export const rootRoute = reatomRoute(
	{
		path: '',
		loader: async () => {
			const counters = await wrap(getCounters())
			const counterItems = counters.map((counter, index) => ({
				id: counter.id,
				label: counter.label,
				countAtom: reatomNumber(counter.value, `counter${index + 1}`).extend(
					withChangeHook((newValue) => {
						void updateCounterValue(counter.id, newValue).catch(() => undefined)
					}),
				),
			}))
			return { counters: counterItems }
		},
	},
	'rootRoute',
)
