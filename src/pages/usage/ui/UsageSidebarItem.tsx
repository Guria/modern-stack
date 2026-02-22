import { reatomComponent } from '@reatom/react'

import { usageRoute } from '../model/routes'
import { UsageCard } from './UsageCard'

export const UsageSidebarItem = reatomComponent(
	() => (
		<a href={usageRoute.path()} aria-current={usageRoute.match() ? 'page' : undefined}>
			<UsageCard active={usageRoute.match()} />
		</a>
	),
	'UsageSidebarItem',
)
