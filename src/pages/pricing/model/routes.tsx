import { rootRoute } from '#shared/router'

import { PricingPage } from '../ui/PricingPage'

export const pricingRoute = rootRoute.reatomRoute(
	{
		path: 'pricing',
		render: () => <PricingPage />,
	},
	'pricing',
)
