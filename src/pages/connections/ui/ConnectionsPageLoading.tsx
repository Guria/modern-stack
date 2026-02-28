import { MasterDetails } from '#widgets/master-details'

import { ConnectionListLoading } from './components/ConnectionListLoading'
import { ConnectionDetailLoadingState } from './ConnectionDetailLoadingState'

type ConnectionsPageLoadingProps = {
	showDetail: boolean
}

export function ConnectionsPageLoading({ showDetail }: ConnectionsPageLoadingProps) {
	return (
		<div role="status" aria-label="Loading connections page">
			<div inert>
				<MasterDetails
					isDetailVisible={showDetail}
					master={<ConnectionListLoading />}
					detail={<ConnectionDetailLoadingState />}
				/>
			</div>
		</div>
	)
}
