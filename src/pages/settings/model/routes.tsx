import { abortVar, effect } from '@reatom/core'

import { m } from '#paraglide/messages.js'
import { setBreadcrumb } from '#shared/model'
import { rootRoute } from '#shared/router'

import { SettingsPage } from '../ui/SettingsPage'

export const settingsRoute = rootRoute.reatomRoute(
	{
		path: 'settings',
		loader: async () => {
			effect(() => {
				const dispose = setBreadcrumb(1, { label: () => m.nav_settings() })
				abortVar.subscribe(dispose)
			})
			return {}
		},
		render: () => <SettingsPage />,
	},
	'settings',
)
