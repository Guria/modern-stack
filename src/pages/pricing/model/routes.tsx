import { abortVar, effect } from '@reatom/core'

import { m } from '#paraglide/messages.js'
import { setBreadcrumb } from '#shared/model'
import { rootRoute } from '#shared/router'

import { PricingPage } from '../ui/PricingPage'

export const pricingRoute = rootRoute.reatomRoute(
	{
		path: 'pricing',
		loader: async () => {
			effect(() => {
				const dispose = setBreadcrumb(1, { label: () => m.nav_pricing() })
				abortVar.subscribe(dispose)
			})
			return {}
		},
		render: () => <PricingPage />,
	},
	'pricing',
)
