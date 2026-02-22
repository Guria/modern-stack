import { reatomComponent } from '@reatom/react'
import { Clock } from 'lucide-react'

import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { timelineRoute } from '../model/routes'

export const TimelineNavItem = reatomComponent(
	() => (
		<a href={timelineRoute.path()}>
			<SideNavButton active={timelineRoute.match()}>
				<SideNavItemContent Icon={Clock} label="Timeline" />
			</SideNavButton>
		</a>
	),
	'TimelineNavItem',
)
