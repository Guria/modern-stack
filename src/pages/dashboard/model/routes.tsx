import { abortVar, effect, retryComputed, wrap } from '@reatom/core'

import { fetchDashboardData } from '#entities/dashboard'
import { m } from '#paraglide/messages.js'
import { setBreadcrumb } from '#shared/model'
import { rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'

import { DashboardPage } from '../ui/DashboardPage'
import { DashboardPageLoading } from '../ui/DashboardPageLoading'

export const dashboardRoute = rootRoute.reatomRoute(
	{
		path: 'dashboard',
		loader: () => {
			effect(() => {
				const dispose = setBreadcrumb(1, { label: () => m.nav_dashboard() })
				abortVar.subscribe(dispose)
			})
			return fetchDashboardData()
		},
		render: (self) => {
			const { isFirstPending, isPending, data } = self.loader.status()
			if (isFirstPending || (isPending && !data)) {
				return <DashboardPageLoading />
			}
			if (!data) {
				return (
					<PageError
						title={m.dashboard_error_title()}
						description={m.dashboard_error_description()}
						onRetry={wrap(() => retryComputed(self.loader))}
					/>
				)
			}
			return <DashboardPage data={data} />
		},
	},
	'dashboard',
)
