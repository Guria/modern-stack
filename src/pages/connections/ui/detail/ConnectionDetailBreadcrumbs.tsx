import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Breadcrumb, Skeleton } from '#shared/components'

import { connectionDetailRoute, connectionsRoute } from '../../model/routes'

export const ConnectionDetailBreadcrumbs = reatomComponent(() => {
	const connection = connectionDetailRoute.loader.data()
	const isLoading = connectionDetailRoute.loader.pending() > 0
	return (
		<Breadcrumb.Root size="sm">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href={connectionsRoute.path()} color="fg.muted">
						{m.nav_connections()}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item aria-current="page" fontWeight="semibold" color="fg.default">
					{isLoading ? (
						<Skeleton h="4" w="20" borderRadius="sm" />
					) : (
						(connection?.name ?? m.connection_not_found())
					)}
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	)
}, 'ConnectionDetailBreadcrumbs')
