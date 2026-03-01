import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Breadcrumb, Skeleton } from '#shared/components'

import { itemDetailRoute, itemsRoute } from '../model/routes'

export const ItemDetailBreadcrumbs = reatomComponent(() => {
	const item = itemDetailRoute.loader.data()
	const isLoading = itemDetailRoute.loader.pending() > 0
	const fallbackLabel = itemDetailRoute()?.itemId ?? m.nav_items()
	return (
		<Breadcrumb.Root size="sm">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href={itemsRoute.path()} color="fg.muted">
						{m.nav_items()}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item aria-current="page" fontWeight="semibold" color="fg.default">
					{isLoading ? <Skeleton h="4" w="20" borderRadius="sm" /> : (item?.name ?? fallbackLabel)}
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	)
}, 'ItemDetailBreadcrumbs')
