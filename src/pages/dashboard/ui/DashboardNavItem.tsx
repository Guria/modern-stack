import { reatomComponent } from '@reatom/react'
import { LayoutDashboard } from 'lucide-react'

import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { dashboardRoute } from '../model/routes'

export const DashboardNavItem = reatomComponent(
	() => (
		<a href={dashboardRoute.path()}>
			<SideNavButton active={dashboardRoute.match()}>
				<SideNavItemContent Icon={LayoutDashboard} label="Dashboard" />
			</SideNavButton>
		</a>
	),
	'DashboardNavItem',
)
