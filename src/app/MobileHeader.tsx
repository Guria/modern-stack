import { reatomComponent } from '@reatom/react'

import { ArticleDetailMobileHeader } from '#pages/articles'
import { ChatConversationMobileHeader } from '#pages/chat'
import { ConnectionDetailMobileHeader } from '#pages/connections'
import { MobileHeader as MobileHeaderLayout, MobileHeaderTitle } from '#widgets/mobile-header'

import { getCurrentTopLevelNavLabel } from './getCurrentTopLevelNavLabel'
import { articleDetailRoute, chatConversationRoute, connectionDetailRoute } from './routes'

/**
 * Routes with child routes use `.exact()` so their condition is mutually exclusive
 * with their children — ordering of cases does not matter.
 */
export const MobileHeader = reatomComponent(() => {
	if (articleDetailRoute.match()) return <ArticleDetailMobileHeader />
	if (connectionDetailRoute.match()) return <ConnectionDetailMobileHeader />
	if (chatConversationRoute.match()) return <ChatConversationMobileHeader />
	const label = getCurrentTopLevelNavLabel()
	return (
		<MobileHeaderLayout>{label ? <MobileHeaderTitle label={label} /> : null}</MobileHeaderLayout>
	)
}, 'MobileHeader')
