import { reatomBoolean, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import {
	Github,
	Languages,
	Menu as MenuIcon,
	Monitor,
	Moon,
	PanelLeft,
	Search,
	Sun,
} from 'lucide-react'
import { type ReactNode } from 'react'

import { m } from '#paraglide/messages.js'
import { Drawer, IconButton, Input, Menu } from '#shared/components'
import {
	localeAtom,
	resolvedThemeAtom,
	showGithubLinkInTopBarAtom,
	showLanguageSwitcherInTopBarAtom,
	showThemeSwitcherInTopBarAtom,
	themePreferenceAtom,
} from '#shared/model'
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

const sidebarAtom = reatomBoolean(false, 'sidebar.open')
const desktopSidebarCollapsedAtom = reatomBoolean(false, 'desktopSidebar.collapsed')

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
							<MenuIcon className={css({ w: '5', h: '5' })} />
						</IconButton>
						<styled.div w="1px" h="5" bg="gray.5" flexShrink={0} />
						<styled.div display={{ base: 'flex', md: 'none' }} alignItems="center">
							{mobileHeader}
						</styled.div>
						<styled.div
							display={{ base: 'none', md: 'flex' }}
							alignItems="center"
							flex="1"
							gap="2"
							maxW="480px"
						>
							<Search className={css({ w: '4', h: '4', color: 'gray.10', flexShrink: 0 })} />
							<Input
								placeholder={m.topbar_search_placeholder()}
								size="sm"
								variant="outline"
								bg="transparent"
								borderWidth="0"
								_focus={{ borderWidth: '0', outline: 'none', boxShadow: 'none' }}
							/>
							<styled.kbd fontSize="xs" color="gray.9" flexShrink={0}>
								⌘K
							</styled.kbd>
						</styled.div>
						<styled.div ml="auto" />
						{showGithubLinkInTopBarAtom() && (
							<IconButton
								variant="plain"
								size="sm"
								display={{ base: 'none', md: 'inline-flex' }}
								asChild
								aria-label={m.topbar_github_link_label()}
							>
								<a
									href="https://github.com/guria/modern-stack"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className={css({ w: '4', h: '4' })} />
								</a>
							</IconButton>
						)}
						{showLanguageSwitcherInTopBarAtom() && (
							<Menu.Root positioning={{ placement: 'bottom-end' }}>
								<Menu.Trigger asChild>
									<IconButton
										variant="plain"
										size="sm"
										display={{ base: 'none', md: 'inline-flex' }}
										aria-label={m.topbar_language_switcher_label()}
									>
										<Languages className={css({ w: '4', h: '4' })} />
									</IconButton>
								</Menu.Trigger>
								<Menu.Positioner>
									<Menu.Content>
										<Menu.RadioItemGroup
											id="locale"
											value={localeAtom()}
											onValueChange={wrap(({ value }) => void localeAtom.set(value))}
										>
											{localeAtom.locales.map((locale) => (
												<Menu.RadioItem key={locale} value={locale}>
													<Menu.ItemText>{localeAtom.label(locale)()}</Menu.ItemText>
													<Menu.ItemIndicator />
												</Menu.RadioItem>
											))}
										</Menu.RadioItemGroup>
									</Menu.Content>
								</Menu.Positioner>
							</Menu.Root>
						)}
						{showThemeSwitcherInTopBarAtom() && (
							<IconButton
								variant="plain"
								size="sm"
								display={{ base: 'none', md: 'inline-flex' }}
								onClick={wrap(() => {
									const next = { system: 'light', light: 'dark', dark: 'system' } as const
									themePreferenceAtom.set(next[themePreferenceAtom()])
								})}
								aria-label={m.topbar_toggle_theme_label()}
							>
								{themePreferenceAtom() === 'system' ? (
									<Monitor className={css({ w: '4', h: '4' })} />
								) : resolvedThemeAtom() === 'dark' ? (
									<Moon className={css({ w: '4', h: '4' })} />
								) : (
									<Sun className={css({ w: '4', h: '4' })} />
								)}
							</IconButton>
						)}
					</styled.header>
					{children}
				</styled.div>
				<GlobalLoader />
			</styled.div>
		)
	},
	'AppShell',
)
