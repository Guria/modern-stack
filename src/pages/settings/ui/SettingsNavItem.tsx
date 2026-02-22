import { reatomComponent } from '@reatom/react'
import { Settings } from 'lucide-react'

import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { settingsRoute } from '../model/routes'

export const SettingsNavItem = reatomComponent(
	() => (
		<a href={settingsRoute.path()}>
			<SideNavButton active={settingsRoute.match()}>
				<SideNavItemContent Icon={Settings} label="Settings" />
			</SideNavButton>
		</a>
	),
	'SettingsNavItem',
)
