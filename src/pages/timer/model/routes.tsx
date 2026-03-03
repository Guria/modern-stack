import { abortVar, effect } from '@reatom/core'

import { m } from '#paraglide/messages.js'
import { setBreadcrumb } from '#shared/model'
import { rootRoute } from '#shared/router'

import { TimerPage } from '../ui/TimerPage'

export const timerRoute = rootRoute.reatomRoute(
	{
		path: 'timer',
		loader: async () => {
			effect(() => {
				const dispose = setBreadcrumb(1, { label: () => m.nav_timer() })
				abortVar.subscribe(dispose)
			})
			return {}
		},
		render: () => <TimerPage />,
	},
	'timer',
)
