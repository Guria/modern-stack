import type { ReactElement } from 'react'

import { retryComputed, wrap } from '@reatom/core'

import { fetchItems, fetchItemById } from '#entities/item'
import { getFirstOutletChild, rootRoute } from '#shared/router'

import { ItemDetail } from '../ui/ItemDetail'
import { ItemDetailLoadingState } from '../ui/ItemDetailLoadingState'
import { ItemNotFound } from '../ui/ItemNotFound'
import { ItemsPage } from '../ui/ItemsPage'
import { ItemsPageError } from '../ui/ItemsPageError'
import { ItemsPageLoading } from '../ui/ItemsPageLoading'

export const itemsRoute = rootRoute.reatomRoute(
	{
		path: 'items',
		loader: fetchItems,
		render: (self): ReactElement => {
			const loaderStatus = self.loader.status()
			const data = self.loader.data()
			if (loaderStatus.isFirstPending || (loaderStatus.isPending && data == null)) {
				return <ItemsPageLoading />
			}
			if (data == null) {
				return <ItemsPageError onRetry={wrap(() => retryComputed(self.loader))} />
			}
			// If a child route is active (e.g. /items/:id), render it full page
			if (itemDetailRoute()) {
				return getFirstOutletChild(self)
			}
			// Otherwise render the full-width list
			return <ItemsPage items={data} getItemHref={(itemId) => itemDetailRoute.path({ itemId })} />
		},
	},
	'items',
)

export const itemDetailRoute = itemsRoute.reatomRoute(
	{
		path: ':itemId',
		loader: ({ itemId }) => fetchItemById(itemId),
		render: (self) => {
			if (self.loader.pending() > 0) return <ItemDetailLoadingState />
			const item = self.loader.data()
			return item ? (
				<ItemDetail item={item} itemsHref={itemsRoute.path()} />
			) : (
				<ItemNotFound itemId={self().itemId} />
			)
		},
	},
	'itemDetail',
)
