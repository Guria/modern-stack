import { reatomComponent } from '@reatom/react'

import { ArticleDetailBreadcrumbs } from '#pages/articles'
import { ChatConversationBreadcrumbs } from '#pages/chat'
import { ConnectionDetailBreadcrumbs } from '#pages/connections'
import { ItemDetailBreadcrumbs } from '#pages/items'
import { Breadcrumb } from '#shared/components'

import { getCurrentTopLevelNavLabel } from './getCurrentTopLevelNavLabel'
import {
	articleDetailRoute,
	chatConversationRoute,
	connectionDetailRoute,
	itemDetailRoute,
} from './routes'

function SimpleBreadcrumb({ label }: { label: string }) {
	return (
		<Breadcrumb.Root size="sm">
			<Breadcrumb.List>
				<Breadcrumb.Item aria-current="page" fontWeight="semibold" color="fg.default">
					{label}
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	)
}

export const HeaderBreadcrumbs = reatomComponent(() => {
	if (articleDetailRoute.match()) return <ArticleDetailBreadcrumbs />
	if (connectionDetailRoute.match()) return <ConnectionDetailBreadcrumbs />
	if (chatConversationRoute.match()) return <ChatConversationBreadcrumbs />
	if (itemDetailRoute.match()) return <ItemDetailBreadcrumbs />
	const label = getCurrentTopLevelNavLabel()
	return label ? <SimpleBreadcrumb label={label} /> : null
}, 'HeaderBreadcrumbs')
