import { wrap } from '@reatom/core'

import { fetchDashboardData } from '#entities/dashboard'
import { m } from '#paraglide/messages.js'
import { rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'

import { DashboardPage } from '../ui/DashboardPage'
import { DashboardPageLoading } from '../ui/DashboardPageLoading'

export const dashboardRoute = rootRoute.reatomRoute(
	{
		path: 'dashboard',
		loader: fetchDashboardData,
		render: (self) => {
			const loaderStatus = self.loader.status()
			const data = self.loader.data()
			if (loaderStatus.isFirstPending || (loaderStatus.isPending && data == null)) {
				return <DashboardPageLoading />
			}
			if (data == null) {
				return (
					<PageError
						title={m.dashboard_error_title()}
						description={m.dashboard_error_description()}
						onRetry={wrap(self.loader.retry)}
					/>
				)
			}
			return <DashboardPage data={data} />
		},
	},
	'dashboard',
)
