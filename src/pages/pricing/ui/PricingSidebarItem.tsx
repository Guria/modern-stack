import { reatomComponent } from '@reatom/react'

import { pricingRoute } from '../model/routes'
import { PricingBanner } from './PricingBanner'

export const PricingSidebarItem = reatomComponent(
	() => (
		<a href={pricingRoute.path()} aria-current={pricingRoute.match() ? 'page' : undefined}>
			<PricingBanner active={pricingRoute.match()} />
		</a>
	),
	'PricingSidebarItem',
)
