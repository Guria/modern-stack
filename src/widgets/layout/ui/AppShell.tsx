import { reatomBoolean, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { Menu, PanelLeft } from 'lucide-react'
import { type ReactNode } from 'react'

import { Drawer, IconButton } from '#shared/components'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

import { GlobalLoader } from './GlobalLoader'

type AppShellProps = {
	sidebarHeader: ReactNode
	sidebarContent: ReactNode
	sidebarFooter: ReactNode
	mobileHeader: ReactNode
	children: ReactNode
}

const sidebarAtom = reatomBoolean(false)
const desktopSidebarCollapsedAtom = reatomBoolean(false)

export const AppShell = reatomComponent(
	({ sidebarHeader, sidebarContent, sidebarFooter, mobileHeader, children }: AppShellProps) => {
		const isCollapsed = desktopSidebarCollapsedAtom()

		const sidebarInner = (
			<>
				<styled.div
					display="flex"
					alignItems="center"
					mb="3"
					px="2"
					className={css({ '[data-sidebar-collapsed] &': { display: 'none' } })}
				>
					{sidebarHeader}
				</styled.div>
				<styled.div
					flex="1"
					minH="0"
					overflowY="auto"
					display="flex"
					flexDirection="column"
					gap="1"
				>
					{sidebarContent}
				</styled.div>
				{sidebarFooter && (
					<styled.div mt="auto" pt="3" borderTopWidth="1px" borderColor="gray.4">
						{sidebarFooter}
					</styled.div>
				)}
			</>
		)

		return (
			<styled.div display="flex" minH="100dvh" position="relative">
				{/* Mobile Drawer */}
				<Drawer.Root
					open={sidebarAtom()}
					onOpenChange={wrap(({ open }) => void sidebarAtom.set(open))}
					placement="start"
				>
					<Drawer.Backdrop display={{ base: 'block', md: 'none' }} />
					<Drawer.Positioner display={{ base: 'flex', md: 'none' }}>
						<Drawer.Content maxW="220px" p="4" gap="1">
							{sidebarInner}
						</Drawer.Content>
					</Drawer.Positioner>
				</Drawer.Root>

				{/* Desktop Sidebar */}
				<styled.aside
					w={isCollapsed ? '60px' : '240px'}
					overflow="hidden"
					flexShrink={0}
					bg="gray.2"
					borderRightWidth="1px"
					borderColor="gray.4"
					display={{ base: 'none', md: 'flex' }}
					flexDirection="column"
					p={isCollapsed ? '2' : '4'}
					gap="1"
					position={{ md: 'sticky' }}
					top="0"
					alignSelf={{ md: 'flex-start' }}
					h="100dvh"
					className={css({ transition: 'width 0.2s ease, padding 0.2s ease' })}
					data-sidebar-collapsed={isCollapsed ? '' : undefined}
				>
					{sidebarInner}
				</styled.aside>

				{/* Main content */}
				<styled.div display="flex" flex="1" flexDirection="column" minW="0">
					<styled.header
						display="flex"
						alignItems="center"
						gap="2"
						px={{ base: '3', md: '4' }}
						h="14"
						borderBottomWidth="1px"
						borderColor="gray.4"
						position="sticky"
						top="0"
						zIndex="sticky"
						bg="gray.1"
					>
						{/* Desktop: toggle sidebar */}
						<IconButton
							variant="plain"
							size="sm"
							display={{ base: 'none', md: 'inline-flex' }}
							onClick={wrap(desktopSidebarCollapsedAtom.toggle)}
						>
							<PanelLeft className={css({ w: '5', h: '5' })} />
						</IconButton>
						{/* Mobile: open drawer */}
						<IconButton
							variant="plain"
							size="sm"
							display={{ base: 'inline-flex', md: 'none' }}
							onClick={wrap(sidebarAtom.setTrue)}
						>
							<Menu className={css({ w: '5', h: '5' })} />
						</IconButton>
						<styled.div w="1px" h="5" bg="gray.5" flexShrink={0} />
						{mobileHeader}
					</styled.header>
					{children}
				</styled.div>
				<GlobalLoader />
			</styled.div>
		)
	},
	'AppShell',
)
