import { reatomComponent } from '@reatom/react'

import { ArticleDetailMobileHeader } from '#pages/articles'
import { ChatConversationMobileHeader } from '#pages/chat'
import { ConnectionDetailMobileHeader } from '#pages/connections'
import { m } from '#paraglide/messages.js'
import { MobileHeaderTitle } from '#widgets/mobile-header'

import {
	articleDetailRoute,
	articlesRoute,
	calculatorRoute,
	chatConversationRoute,
	chatRoute,
	connectionDetailRoute,
	connectionsRoute,
	dashboardRoute,
	itemsRoute,
	pricingRoute,
	settingsRoute,
	timelineRoute,
	timerRoute,
	usageRoute,
} from './routes'

/**
 * Routes with child routes use `.exact()` so their condition is mutually exclusive
 * with their children — ordering of cases does not matter.
 */
export const MobileHeader = reatomComponent(() => {
	if (articleDetailRoute.match()) return <ArticleDetailMobileHeader />
	if (connectionDetailRoute.match()) return <ConnectionDetailMobileHeader />
	if (chatConversationRoute.match()) return <ChatConversationMobileHeader />
	if (dashboardRoute.match()) return <MobileHeaderTitle label={m.nav_dashboard()} />
	if (articlesRoute.exact()) return <MobileHeaderTitle label={m.nav_articles()} />
	if (connectionsRoute.exact()) return <MobileHeaderTitle label={m.nav_connections()} />
	if (itemsRoute.match()) return <MobileHeaderTitle label={m.nav_items()} />
	if (chatRoute.exact()) return <MobileHeaderTitle label={m.nav_chat()} />
	if (timelineRoute.match()) return <MobileHeaderTitle label={m.nav_timeline()} />
	if (calculatorRoute.match()) return <MobileHeaderTitle label={m.nav_calculator()} />
	if (timerRoute.match()) return <MobileHeaderTitle label={m.nav_timer()} />
	if (settingsRoute.match()) return <MobileHeaderTitle label={m.nav_settings()} />
	if (usageRoute.match()) return <MobileHeaderTitle label={m.nav_usage()} />
	if (pricingRoute.match()) return <MobileHeaderTitle label={m.nav_pricing()} />
	return null
}, 'MobileHeader')
