import { reatomComponent } from '@reatom/react'

import { Skeleton } from '#shared/components'
import { BackButton, MobileHeaderTitle } from '#widgets/layout'

import { connectionDetailRoute, connectionsRoute } from '../model/routes'

export const ConnectionDetailMobileHeader = reatomComponent(() => {
	if (!connectionDetailRoute.match()) return null
	const item = connectionDetailRoute.loader.data()
	const isLoading = connectionDetailRoute.loader.pending() > 0
	return (
		<>
			<BackButton href={connectionsRoute.path()} label="Back to connections" />
			{isLoading ? (
				<Skeleton h="5" w="28" borderRadius="sm" />
			) : (
				<MobileHeaderTitle label={item?.name ?? 'Connection not found'} />
			)}
		</>
	)
}, 'ConnectionDetailMobileHeader')
