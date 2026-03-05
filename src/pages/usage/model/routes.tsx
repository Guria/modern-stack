import { rootRoute } from '#shared/router'

import { UsagePage } from '../ui/UsagePage'

export const usageRoute = rootRoute.reatomRoute(
	{
		path: 'usage',
		render: () => <UsagePage />,
	},
	'usage',
)
