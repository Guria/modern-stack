import { urlAtom, withChangeHook } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Toaster } from '#shared/components'
import { localeAtom } from '#shared/model'
import { styled } from '#styled-system/jsx'
import { AppShell } from '#widgets/app-shell'

import { HeaderBreadcrumbs } from './HeaderBreadcrumbs'
import { MobileHeader } from './MobileHeader'
import { OrgSwitcher } from './OrgSwitcher'
import { dashboardRoute, rootRoute } from './routes'
import { SidebarFooterNavigation } from './SidebarFooterNavigation'
import { SidebarNavigation } from './SidebarNavigation'

urlAtom.extend(
	withChangeHook(() => {
		if (rootRoute.exact()) {
			dashboardRoute.go(undefined, true)
		}
	}),
)

export const App = reatomComponent(() => {
	localeAtom()
	return (
		<>
			<AppShell
				appName={m.app_name()}
				sidebarContent={<SidebarNavigation />}
				sidebarFooter={
					<styled.div display="flex" flexDirection="column" gap="3">
						<SidebarFooterNavigation />
						<OrgSwitcher />
					</styled.div>
				}
				mobileHeader={<MobileHeader />}
				breadcrumbs={<HeaderBreadcrumbs />}
			>
				{rootRoute.render()}
			</AppShell>
			<Toaster />
		</>
	)
}, 'App')
