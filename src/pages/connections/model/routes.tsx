import type { ReactElement } from 'react'

import { retryComputed, wrap } from '@reatom/core'

import { fetchConnectionById, fetchConnections } from '#entities/connection'
import { m } from '#paraglide/messages.js'
import { getFirstOutletChild, rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'

import { ConnectionDetail } from '../ui/ConnectionDetail'
import { ConnectionDetailLoadingState } from '../ui/ConnectionDetailLoadingState'
import { ConnectionNoSelection } from '../ui/ConnectionNoSelection'
import { ConnectionNotFound } from '../ui/ConnectionNotFound'
import { ConnectionsPage } from '../ui/ConnectionsPage'
import { ConnectionsPageLoading } from '../ui/ConnectionsPageLoading'

export const connectionsRoute = rootRoute.reatomRoute(
	{
		path: 'connections',
		loader: fetchConnections,
		render: (self): ReactElement => {
			const selectedConnectionId = connectionDetailRoute()?.connectionId
			const loaderStatus = self.loader.status()
			const connections = self.loader.data()
			if (loaderStatus.isFirstPending || (loaderStatus.isPending && connections == null)) {
				return <ConnectionsPageLoading showDetail={selectedConnectionId !== undefined} />
			}

			if (connections == null) {
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
					detail={getFirstOutletChild(self, <ConnectionNoSelection />)}
				/>
			)
		},
	},
	'connections',
)

export const connectionDetailRoute = connectionsRoute.reatomRoute(
	{
		path: ':connectionId',
		loader: ({ connectionId }) => fetchConnectionById(connectionId),
		render: (self) => {
			const isLoadingConnection = self.loader.pending() > 0
			if (isLoadingConnection) {
				return <ConnectionDetailLoadingState />
			}

			const connection = self.loader.data()
			return connection ? (
				<ConnectionDetail connection={connection} />
			) : (
				<ConnectionNotFound connectionId={self().connectionId} />
			)
		},
	},
	'connectionDetail',
)
