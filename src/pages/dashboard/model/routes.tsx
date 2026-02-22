import { urlAtom, withChangeHook, wrap } from '@reatom/core'

import { fetchDashboardData } from '#entities/dashboard'
import { rootRoute } from '#shared/router'

import { DashboardPage } from '../ui/DashboardPage'
import { DashboardPageError } from '../ui/DashboardPageError'
import { DashboardPageLoading } from '../ui/DashboardPageLoading'

urlAtom.extend(
	withChangeHook(() => {
		if (rootRoute.exact()) {
			dashboardRoute.go(undefined, true)
		}
	}),
)
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
				return <DashboardPageError onRetry={wrap(self.loader.retry)} />
			}
			return <DashboardPage data={data} />
		},
	},
	'dashboard',
)
