import { reatomComponent } from '@reatom/react'
import { type ReactNode } from 'react'

import { MasterDetails } from '#widgets/master-details'

import { ConnectionList, type ConnectionListRow } from './list/ConnectionList'

type Props = {
	connections: ConnectionListRow[]
	selectedConnectionId: string | undefined
	detail: ReactNode
}

export const ConnectionsPage = reatomComponent(function ConnectionsPage({
	connections,
	selectedConnectionId,
	detail,
}: Props) {
	const hasDetail = selectedConnectionId !== undefined

	return (
		<MasterDetails
			isDetailVisible={hasDetail}
			master={<ConnectionList connections={connections} selectedId={selectedConnectionId} />}
			detail={detail}
		/>
	)
})
