import { reatomComponent } from '@reatom/react'

import { Toaster } from '#shared/components'
import { styled } from '#styled-system/jsx'
import { AppShell } from '#widgets/layout'

import { MobileHeader } from './MobileHeader'
import { OrgSwitcher } from './OrgSwitcher'
import { rootRoute } from './routes'
import { SidebarFooterNavigation } from './SidebarFooterNavigation'
import { SidebarNavigation } from './SidebarNavigation'

export const App = reatomComponent(() => {
	return (
		<>
			<AppShell
				sidebarHeader={
					<styled.h2 fontSize="lg" fontWeight="bold">
						Modern Stack
					</styled.h2>
				}
				sidebarContent={<SidebarNavigation />}
				sidebarFooter={
					<styled.div display="flex" flexDirection="column" gap="3">
						<SidebarFooterNavigation />
						<OrgSwitcher />
					</styled.div>
				}
				mobileHeader={<MobileHeader />}
			>
				{rootRoute.render()}
			</AppShell>
			<Toaster />
		</>
	)
}, 'App')
