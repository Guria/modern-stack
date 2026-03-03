import { abortVar, effect, retryComputed, wrap } from '@reatom/core'

import { fetchConnectionById, fetchConnections } from '#entities/connection'
import { m } from '#paraglide/messages.js'
import { setBreadcrumb } from '#shared/model'
import { rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'

import { ConnectionsPage } from '../ui/ConnectionsPage'
import { ConnectionsPageLoading } from '../ui/ConnectionsPageLoading'
import { ConnectionDetail } from '../ui/detail/ConnectionDetail'
import { ConnectionDetailLoadingState } from '../ui/detail/ConnectionDetailLoadingState'
import { ConnectionNoSelection } from '../ui/detail/ConnectionNoSelection'
import { ConnectionNotFound } from '../ui/detail/ConnectionNotFound'

export const connectionsRoute = rootRoute.reatomRoute(
	{
		path: 'connections',
		loader: () => {
			effect(() => {
				const dispose = setBreadcrumb(1, {
					label: () => m.nav_connections(),
					href: connectionsRoute.path(),
					backLabel: () => m.connection_back_to_connections(),
				})
				abortVar.subscribe(dispose)
			})
			return fetchConnections()
		},
		render: (self) => {
			const selectedConnectionId = connectionDetailRoute()?.connectionId
			const { isFirstPending, isPending, data: connections } = self.loader.status()
			if (isFirstPending || (isPending && !connections)) {
				return <ConnectionsPageLoading showDetail={selectedConnectionId !== undefined} />
			}

			if (!connections) {
				return (
					<PageError
						title={m.connections_error_title()}
						description={m.connections_error_description()}
						onRetry={wrap(() => retryComputed(self.loader))}
					/>
				)
			}

			return (
				<ConnectionsPage
					connections={connections}
					selectedConnectionId={selectedConnectionId}
					getConnectionHref={(connectionId: string) => connectionDetailRoute.path({ connectionId })}
					detail={self.outlet().at(0) ?? <ConnectionNoSelection />}
				/>
			)
		},
	},
	'connections',
)

export const connectionDetailRoute = connectionsRoute.reatomRoute(
	{
		path: ':connectionId',
		loader: ({ connectionId }) => {
			effect(() => {
				const dispose = setBreadcrumb(2, {
					label: () => connectionDetailRoute.loader.data()?.name ?? m.connection_not_found(),
					isLoading: () => connectionDetailRoute.loader.pending() > 0,
				})
				abortVar.subscribe(dispose)
			})
			return fetchConnectionById(connectionId)
		},
		render: (self) => {
			const { isPending, data: connection } = self.loader.status()
			if (isPending) return <ConnectionDetailLoadingState />
			return connection ? (
				<ConnectionDetail connection={connection} />
			) : (
				<ConnectionNotFound connectionId={self().connectionId} />
			)
		},
	},
	'connectionDetail',
)
