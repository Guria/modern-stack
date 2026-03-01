import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Breadcrumb, Skeleton } from '#shared/components'

import { chatConversationRoute, chatRoute } from '../model/routes'

export const ChatConversationBreadcrumbs = reatomComponent(() => {
	const conversation = chatConversationRoute.loader.data()
	const isLoading = chatConversationRoute.loader.pending() > 0
	return (
		<Breadcrumb.Root size="sm">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href={chatRoute.path()} color="fg.muted">
						{m.nav_chat()}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item aria-current="page" fontWeight="semibold" color="fg.default">
					{isLoading ? (
						<Skeleton h="4" w="20" borderRadius="sm" />
					) : (
						(conversation?.name ?? m.chat_not_found())
					)}
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	)
}, 'ChatConversationBreadcrumbs')
