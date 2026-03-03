import { abortVar, effect } from '@reatom/core'

import { m } from '#paraglide/messages.js'
import { setBreadcrumb } from '#shared/model'
import { rootRoute } from '#shared/router'

import { CalculatorPage } from '../ui/CalculatorPage'

export const calculatorRoute = rootRoute.reatomRoute(
	{
		path: 'calculator',
		loader: async () => {
			effect(() => {
				const dispose = setBreadcrumb(1, { label: () => m.nav_calculator() })
				abortVar.subscribe(dispose)
			})
			return {}
		},
		render: () => <CalculatorPage />,
	},
	'calculator',
)
