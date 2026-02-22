import { reatomComponent } from '@reatom/react'
import { FileText } from 'lucide-react'

import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { articlesRoute } from '../model/routes'

export const ArticlesNavItem = reatomComponent(
	() => (
		<a href={articlesRoute.path()}>
			<SideNavButton active={articlesRoute.match()}>
				<SideNavItemContent Icon={FileText} label="Articles" />
			</SideNavButton>
		</a>
	),
	'ArticlesNavItem',
)
