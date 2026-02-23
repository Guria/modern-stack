import { reatomComponent } from '@reatom/react'
import { MessageCircle } from 'lucide-react'

import { conversationUnreadCountAtom } from '#entities/conversation'
import { m } from '#paraglide/messages.js'
import { Badge } from '#shared/components'
import { SideNavButton, SideNavItemContent } from '#widgets/layout'

import { chatRoute } from '../model/routes'

export const ChatNavItem = reatomComponent(() => {
	const routeUnreadCount =
		chatRoute.loader
			.data()
			?.reduce((totalUnread, conversation) => totalUnread + conversation.unread, 0) ?? null
	const unreadCount = routeUnreadCount ?? conversationUnreadCountAtom.data() ?? 0
	const unreadBadge =
		unreadCount > 0 ? (
			<Badge
				size="sm"
				bg="indigo.subtle.bg"
				color="indigo.subtle.fg"
				borderRadius="full"
				minW="5"
				textAlign="center"
			>
				{unreadCount > 99 ? '99+' : unreadCount}
			</Badge>
		) : null

	return (
		<a href={chatRoute.path({})}>
			<SideNavButton active={chatRoute.match()}>
				<SideNavItemContent Icon={MessageCircle} label={m.nav_chat()} trailing={unreadBadge} />
			</SideNavButton>
		</a>
	)
}, 'ChatNavItem')
