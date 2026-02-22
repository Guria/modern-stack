import { reatomComponent } from '@reatom/react'
import { Link2 } from 'lucide-react'

import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { connectionsRoute } from '../model/routes'

export const ConnectionsNavItem = reatomComponent(
	() => (
		<a href={connectionsRoute.path()}>
			<SideNavButton active={connectionsRoute.match()}>
				<SideNavItemContent Icon={Link2} label="Connections" />
			</SideNavButton>
		</a>
	),
	'ConnectionsNavItem',
)
