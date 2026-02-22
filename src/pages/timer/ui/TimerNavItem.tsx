import { reatomComponent } from '@reatom/react'

import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { formatTime, timerRemainingAtom, timerRunningAtom } from '../model/atoms'
import { timerRoute } from '../model/routes'
import { TimerRing } from './TimerRing'

const TimerTrailing = reatomComponent(() => {
	const running = timerRunningAtom()
	if (!running) return null
	return (
		<span style={{ fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>
			{formatTime(timerRemainingAtom())}
		</span>
	)
}, 'TimerTrailing')

export const TimerNavItem = reatomComponent(
	() => (
		<a href={timerRoute.path()}>
			<SideNavButton active={timerRoute.match()}>
				<SideNavItemContent Icon={() => <TimerRing />} label="Timer" trailing={<TimerTrailing />} />
			</SideNavButton>
		</a>
	),
	'TimerNavItem',
)
