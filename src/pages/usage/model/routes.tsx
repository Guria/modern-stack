import { abortVar, effect } from '@reatom/core'

import { m } from '#paraglide/messages.js'
import { setBreadcrumb } from '#shared/model'
import { rootRoute } from '#shared/router'

import { UsagePage } from '../ui/UsagePage'

export const usageRoute = rootRoute.reatomRoute(
	{
		path: 'usage',
		loader: async () => {
			effect(() => {
				const dispose = setBreadcrumb(1, { label: () => m.nav_usage() })
				abortVar.subscribe(dispose)
			})
			return {}
		},
		render: () => <UsagePage />,
	},
	'usage',
)
