import { reatomComponent } from '@reatom/react'
import { type ReactNode } from 'react'

import type { Connection } from '#entities/connection'

import { MasterDetails } from '#widgets/master-details'

import { ConnectionList } from './components/ConnectionList'

type ConnectionsPageProps = {
	connections: Connection[]
	selectedConnectionId: string | undefined
	getConnectionHref: (connectionId: string) => string
	detail: ReactNode
}

export const ConnectionsPage = reatomComponent(function ConnectionsPage({
	connections,
	selectedConnectionId,
	getConnectionHref,
	detail,
}: ConnectionsPageProps) {
	const hasDetail = selectedConnectionId !== undefined

	return (
		<MasterDetails
			isDetailVisible={hasDetail}
			master={
				<ConnectionList
					connections={connections}
					selectedId={selectedConnectionId}
					getConnectionHref={getConnectionHref}
				/>
			}
			detail={detail}
		/>
	)
})
