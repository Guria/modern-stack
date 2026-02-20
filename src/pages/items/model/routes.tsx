import type { ReactElement } from 'react'

import { retryComputed, wrap } from '@reatom/core'

import { fetchItems, fetchItemById } from '#entities/item'
import { getFirstOutletChild, rootRoute } from '#shared/router'

import { ItemDetail } from '../ui/ItemDetail'
import { ItemDetailLoadingState } from '../ui/ItemDetailLoadingState'
import { ItemNoSelection } from '../ui/ItemNoSelection'
import { ItemNotFound } from '../ui/ItemNotFound'
import { ItemsPage } from '../ui/ItemsPage'
import { ItemsPageError } from '../ui/ItemsPageError'
import { ItemsPageLoading } from '../ui/ItemsPageLoading'

export const itemsRoute = rootRoute.reatomRoute(
	{
		path: 'items',
		loader: fetchItems,
		render: (self): ReactElement => {
			const selectedItemId = itemDetailRoute()?.itemId
			const loaderStatus = self.loader.status()
			const data = self.loader.data()
			if (loaderStatus.isFirstPending || (loaderStatus.isPending && data == null)) {
				return <ItemsPageLoading />
			}
			if (data == null) {
				return <ItemsPageError onRetry={wrap(() => retryComputed(self.loader))} />
			}
			return (
				<ItemsPage
					items={data}
					selectedItemId={selectedItemId}
					getItemHref={(itemId) => itemDetailRoute.path({ itemId })}
					detail={getFirstOutletChild(self, <ItemNoSelection />)}
				/>
			)
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
			return item ? <ItemDetail item={item} /> : <ItemNotFound itemId={self().itemId} />
		},
	},
	'itemDetail',
)
