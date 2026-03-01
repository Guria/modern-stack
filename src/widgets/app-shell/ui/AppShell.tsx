import { reatomBoolean, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { Github, Languages, Monitor, Moon, PanelLeft, Search, Sun } from 'lucide-react'
import { type ReactNode } from 'react'

import { m } from '#paraglide/messages.js'
import { IconButton, Input, Menu } from '#shared/components'
import {
	localeAtom,
	showGithubLinkInTopBarAtom,
	showLanguageSwitcherInTopBarAtom,
	showThemeSwitcherInTopBarAtom,
	themePreferenceAtom,
} from '#shared/model'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

import { GlobalLoader } from './GlobalLoader'
import { SidebarDrawer } from './sidebar'

type AppShellProps = {
	appName: string
	sidebarContent: ReactNode
	sidebarFooter: ReactNode
	mobileHeader: ReactNode
	breadcrumbs: ReactNode
	children: ReactNode
}

const desktopSidebarCollapsedAtom = reatomBoolean(false, 'desktopSidebar.collapsed')

export const AppShell = reatomComponent(
	({
		appName,
		sidebarContent,
		sidebarFooter,
		mobileHeader,
		breadcrumbs,
		children,
	}: AppShellProps) => {
		const isCollapsed = desktopSidebarCollapsedAtom()

		const sidebarInner = (
			<>
				<styled.div mb="3" px="2" h="10" display="flex" alignItems="center">
					<styled.h2
						fontSize="lg"
						fontWeight="bold"
						className={css({
							opacity: 1,
							visibility: 'visible',
							whiteSpace: 'nowrap',
							transition: 'opacity 0.12s ease',
							transitionDelay: '0.2s',
							'[data-sidebar-collapsed] &': {
								opacity: 0,
								visibility: 'hidden',
								transitionDelay: '0s',
							},
						})}
					>
						{appName}
					</styled.h2>
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
				<SidebarDrawer>{sidebarInner}</SidebarDrawer>

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
				<styled.div display="flex" flex="1" flexDirection="column" minW="0" isolation="isolate">
					<styled.header
						display="flex"
						alignItems="center"
						gap="2"
						px={{ base: '3', md: '6' }}
						h="14"
						borderBottomWidth="1px"
						borderColor="gray.4"
						position="sticky"
						top="0"
						zIndex="sticky"
						bg="gray.1"
					>
						<styled.div
							display={{ base: 'flex', md: 'none' }}
							alignItems="center"
							flex="1"
							minW="0"
						>
							{mobileHeader}
						</styled.div>
						{/* Desktop: toggle sidebar on seam */}
						<IconButton
							variant="plain"
							size="xs"
							display={{ base: 'none', md: 'inline-flex' }}
							position="absolute"
							left="0"
							top="50%"
							bg="gray.1"
							borderWidth="1px"
							borderColor="gray.4"
							borderRadius="full"
							aria-label={m.topbar_toggle_sidebar()}
							onClick={wrap(desktopSidebarCollapsedAtom.toggle)}
							className={css({ transform: 'translate(-50%, -50%)' })}
						>
							<PanelLeft className={css({ w: '4', h: '4' })} />
						</IconButton>
						{/* Desktop: breadcrumbs */}
						<styled.div display={{ base: 'none', md: 'flex' }} alignItems="center" minW="0">
							{breadcrumbs}
						</styled.div>
						<styled.div ml="auto" />
						{/* Desktop: compact search (intermediate viewports) */}
						<IconButton
							variant="plain"
							size="sm"
							display={{ base: 'none', md: 'inline-flex', xl: 'none' }}
							aria-label={m.topbar_search_placeholder()}
						>
							<Search className={css({ w: '4', h: '4' })} />
						</IconButton>
						{/* Desktop: compact search */}
						<styled.div display={{ base: 'none', xl: 'flex' }} alignItems="center" gap="2">
							<Search className={css({ w: '4', h: '4', color: 'gray.10', flexShrink: 0 })} />
							<Input
								placeholder={m.topbar_search_placeholder()}
								size="sm"
								variant="outline"
								bg="transparent"
								borderWidth="0"
								w="180px"
								_focus={{ borderWidth: '0', outline: 'none', boxShadow: 'none' }}
							/>
							<styled.kbd fontSize="xs" color="gray.9" flexShrink={0}>
								⌘K
							</styled.kbd>
						</styled.div>
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
								) : themePreferenceAtom() === 'dark' ? (
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
