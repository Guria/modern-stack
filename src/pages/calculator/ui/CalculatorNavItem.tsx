import { reatomComponent } from '@reatom/react'
import { Calculator } from 'lucide-react'

import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { calculatorRoute } from '../model/routes'

export const CalculatorNavItem = reatomComponent(
	() => (
		<a href={calculatorRoute.path()}>
			<SideNavButton active={calculatorRoute.match()}>
				<SideNavItemContent Icon={Calculator} label="Calculator" />
			</SideNavButton>
		</a>
	),
	'CalculatorNavItem',
)
