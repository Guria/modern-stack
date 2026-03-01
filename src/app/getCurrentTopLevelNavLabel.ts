import { m } from '#paraglide/messages.js'

import {
	articlesRoute,
	calculatorRoute,
	chatRoute,
	connectionsRoute,
	dashboardRoute,
	itemsRoute,
	pricingRoute,
	settingsRoute,
	timelineRoute,
	timerRoute,
	usageRoute,
} from './routes'

export const getCurrentTopLevelNavLabel = () => {
	if (dashboardRoute.match()) return m.nav_dashboard()
	if (articlesRoute.exact()) return m.nav_articles()
	if (connectionsRoute.exact()) return m.nav_connections()
	if (itemsRoute.match()) return m.nav_items()
	if (chatRoute.exact()) return m.nav_chat()
	if (timelineRoute.match()) return m.nav_timeline()
	if (calculatorRoute.match()) return m.nav_calculator()
	if (timerRoute.match()) return m.nav_timer()
	if (settingsRoute.match()) return m.nav_settings()
	if (usageRoute.match()) return m.nav_usage()
	if (pricingRoute.match()) return m.nav_pricing()
	return null
}
