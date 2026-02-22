import { reatomComponent } from '@reatom/react'
import { Package } from 'lucide-react'

import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { itemsRoute } from '../model/routes'

export const ItemsNavItem = reatomComponent(
	() => (
		<a href={itemsRoute.path()}>
			<SideNavButton active={itemsRoute.match()}>
				<SideNavItemContent Icon={Package} label="Items" />
			</SideNavButton>
		</a>
	),
	'ItemsNavItem',
)
