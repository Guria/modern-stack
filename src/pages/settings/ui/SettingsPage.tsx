import type { ChangeEvent } from 'react'

import { createListCollection } from '@ark-ui/react/select'
import { atom, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { isLocale } from '#paraglide/runtime.js'
import { Button, Input, Select, Switch } from '#shared/components'
import {
	localeAtom,
	reatomM,
	showGithubLinkInTopBarAtom,
	showLanguageSwitcherInTopBarAtom,
	showThemeSwitcherInTopBarAtom,
	themePreferenceAtom,
} from '#shared/model'
import { styled } from '#styled-system/jsx'

import { FieldRow } from './components/FieldRow'
import { Section } from './components/Section'

// Profile atoms
const displayNameAtom = atom('Alex Johnson', 'settings.displayName')
const emailAtom = atom('alex@example.com', 'settings.email')
const profileDirtyAtom = atom(false, 'settings.profileDirty')

// Notifications atoms
const emailNotifAtom = atom('important', 'settings.emailNotif')
const desktopNotifAtom = atom('enabled', 'settings.desktopNotif')
const notifDirtyAtom = atom(false, 'settings.notifDirty')

// Appearance atoms
const densityAtom = atom('comfortable', 'settings.density')

const emailNotificationsCollection = reatomM(
	(m) =>
		createListCollection({
			items: [
				{ label: m.settings_notif_all(), value: 'all' },
				{ label: m.settings_notif_important(), value: 'important' },
				{ label: m.settings_notif_none(), value: 'none' },
			],
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'settings.emailNotificationsCollection',
)

const desktopNotificationsCollection = reatomM(
	(m) =>
		createListCollection({
			items: [
				{ label: m.settings_notif_enabled(), value: 'enabled' },
				{ label: m.settings_notif_disabled(), value: 'disabled' },
			],
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'settings.desktopNotificationsCollection',
)

const themeCollection = reatomM(
	(m) =>
		createListCollection({
			items: [
				{ label: m.settings_theme_light(), value: 'light' },
				{ label: m.settings_theme_dark(), value: 'dark' },
				{ label: m.settings_theme_system(), value: 'system' },
			],
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'settings.themeCollection',
)

const densityCollection = reatomM(
	(m) =>
		createListCollection({
			items: [
				{ label: m.settings_density_compact(), value: 'compact' },
				{ label: m.settings_density_comfortable(), value: 'comfortable' },
				{ label: m.settings_density_spacious(), value: 'spacious' },
			],
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'settings.densityCollection',
)

const languageCollection = reatomM(
	(m) =>
		createListCollection({
			items: [
				{ label: m.language_en(), value: 'en' },
				{ label: m.language_es(), value: 'es' },
			],
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'settings.languageCollection',
)

export const SettingsPage = reatomComponent(() => {
	const displayName = displayNameAtom()
	const email = emailAtom()
	const profileDirty = profileDirtyAtom()

	const emailNotif = emailNotifAtom()
	const desktopNotif = desktopNotifAtom()
	const notifDirty = notifDirtyAtom()

	const theme = themePreferenceAtom()
	const density = densityAtom()
	const locale = localeAtom()
	const showLanguageSwitcher = showLanguageSwitcherInTopBarAtom()
	const showGithubLink = showGithubLinkInTopBarAtom()
	const showThemeSwitcher = showThemeSwitcherInTopBarAtom()

	return (
		<styled.div p="8" maxW="800px">
			<styled.h1 fontSize="2xl" fontWeight="bold" mb="8">
				{m.settings_title()}
			</styled.h1>

			<Section
				title={m.settings_profile()}
				footer={
					profileDirty ? (
						<Button size="sm" onClick={wrap(() => profileDirtyAtom.set(false))}>
							{m.settings_save_changes()}
						</Button>
					) : null
				}
			>
				<FieldRow label={m.settings_display_name()} description={m.settings_display_name_desc()}>
					<Input
						value={displayName}
						size="sm"
						onChange={wrap((e: ChangeEvent<HTMLInputElement>) => {
							displayNameAtom.set(e.target.value)
							profileDirtyAtom.set(true)
						})}
					/>
				</FieldRow>
				<FieldRow label={m.settings_email()} description={m.settings_email_desc()}>
					<Input
						value={email}
						size="sm"
						onChange={wrap((e: ChangeEvent<HTMLInputElement>) => {
							emailAtom.set(e.target.value)
							profileDirtyAtom.set(true)
						})}
					/>
				</FieldRow>
				<FieldRow label={m.settings_role()}>
					<styled.span fontSize="sm" color="gray.11">
						{m.settings_role_admin()}
					</styled.span>
				</FieldRow>
			</Section>

			<Section
				title={m.settings_notifications()}
				footer={
					notifDirty ? (
						<Button size="sm" onClick={wrap(() => notifDirtyAtom.set(false))}>
							{m.settings_save_changes()}
						</Button>
					) : null
				}
			>
				<FieldRow
					label={m.settings_email_notifications()}
					description={m.settings_email_notifications_desc()}
				>
					<Select.Root
						collection={emailNotificationsCollection()}
						size="sm"
						w="100%"
						value={[emailNotif]}
						onValueChange={wrap(
							(details: Select.ValueChangeDetails<{ label: string; value: string }>) => {
								const val = details.value[0]
								if (val !== undefined) {
									emailNotifAtom.set(val)
									notifDirtyAtom.set(true)
								}
							},
						)}
						positioning={{ sameWidth: true }}
					>
						<Select.Control>
							<Select.Trigger>
								<Select.ValueText />
								<Select.IndicatorGroup>
									<Select.Indicator />
								</Select.IndicatorGroup>
							</Select.Trigger>
						</Select.Control>
						<Select.Positioner>
							<Select.Content>
								{emailNotificationsCollection().items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
						<Select.HiddenSelect />
					</Select.Root>
				</FieldRow>
				<FieldRow
					label={m.settings_desktop_notifications()}
					description={m.settings_desktop_notifications_desc()}
				>
					<Select.Root
						collection={desktopNotificationsCollection()}
						size="sm"
						w="100%"
						value={[desktopNotif]}
						onValueChange={wrap(
							(details: Select.ValueChangeDetails<{ label: string; value: string }>) => {
								const val = details.value[0]
								if (val !== undefined) {
									desktopNotifAtom.set(val)
									notifDirtyAtom.set(true)
								}
							},
						)}
						positioning={{ sameWidth: true }}
					>
						<Select.Control>
							<Select.Trigger>
								<Select.ValueText />
								<Select.IndicatorGroup>
									<Select.Indicator />
								</Select.IndicatorGroup>
							</Select.Trigger>
						</Select.Control>
						<Select.Positioner>
							<Select.Content>
								{desktopNotificationsCollection().items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
						<Select.HiddenSelect />
					</Select.Root>
				</FieldRow>
			</Section>

			<Section title={m.settings_top_bar()}>
				<FieldRow
					label={m.settings_show_language_switcher()}
					description={m.settings_show_language_switcher_desc()}
				>
					<Switch.Root
						checked={showLanguageSwitcher}
						onCheckedChange={wrap(({ checked }: { checked: boolean }) =>
							showLanguageSwitcherInTopBarAtom.set(checked),
						)}
					>
						<Switch.HiddenInput />
						<Switch.Control />
					</Switch.Root>
				</FieldRow>
				<FieldRow
					label={m.settings_show_github_link()}
					description={m.settings_show_github_link_desc()}
				>
					<Switch.Root
						checked={showGithubLink}
						onCheckedChange={wrap(({ checked }: { checked: boolean }) =>
							showGithubLinkInTopBarAtom.set(checked),
						)}
					>
						<Switch.HiddenInput />
						<Switch.Control />
					</Switch.Root>
				</FieldRow>
				<FieldRow
					label={m.settings_show_theme_switcher()}
					description={m.settings_show_theme_switcher_desc()}
				>
					<Switch.Root
						checked={showThemeSwitcher}
						onCheckedChange={wrap(({ checked }: { checked: boolean }) =>
							showThemeSwitcherInTopBarAtom.set(checked),
						)}
					>
						<Switch.HiddenInput />
						<Switch.Control />
					</Switch.Root>
				</FieldRow>
			</Section>

			<Section title={m.settings_appearance()}>
				<FieldRow label={m.settings_theme()} description={m.settings_theme_desc()}>
					<Select.Root
						collection={themeCollection()}
						size="sm"
						w="100%"
						value={[theme]}
						onValueChange={wrap(
							(details: Select.ValueChangeDetails<{ label: string; value: string }>) => {
								const val = details.value[0]
								if (val !== undefined) {
									themePreferenceAtom.set(val as 'system' | 'light' | 'dark')
								}
							},
						)}
						positioning={{ sameWidth: true }}
					>
						<Select.Control>
							<Select.Trigger>
								<Select.ValueText />
								<Select.IndicatorGroup>
									<Select.Indicator />
								</Select.IndicatorGroup>
							</Select.Trigger>
						</Select.Control>
						<Select.Positioner>
							<Select.Content>
								{themeCollection().items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
						<Select.HiddenSelect />
					</Select.Root>
				</FieldRow>
				<FieldRow label={m.settings_density()} description={m.settings_density_desc()}>
					<Select.Root
						collection={densityCollection()}
						size="sm"
						w="100%"
						value={[density]}
						onValueChange={wrap(
							(details: Select.ValueChangeDetails<{ label: string; value: string }>) => {
								const val = details.value[0]
								if (val !== undefined) {
									densityAtom.set(val)
								}
							},
						)}
						positioning={{ sameWidth: true }}
					>
						<Select.Control>
							<Select.Trigger>
								<Select.ValueText />
								<Select.IndicatorGroup>
									<Select.Indicator />
								</Select.IndicatorGroup>
							</Select.Trigger>
						</Select.Control>
						<Select.Positioner>
							<Select.Content>
								{densityCollection().items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
						<Select.HiddenSelect />
					</Select.Root>
				</FieldRow>
				<FieldRow label={m.settings_language()} description={m.settings_language_desc()}>
					<Select.Root
						collection={languageCollection()}
						size="sm"
						w="100%"
						value={[locale]}
						onValueChange={wrap(
							(details: Select.ValueChangeDetails<{ label: string; value: string }>) => {
								const val = details.value[0]
								if (isLocale(val)) localeAtom.set(val)
							},
						)}
						positioning={{ sameWidth: true }}
					>
						<Select.Control>
							<Select.Trigger>
								<Select.ValueText />
								<Select.IndicatorGroup>
									<Select.Indicator />
								</Select.IndicatorGroup>
							</Select.Trigger>
						</Select.Control>
						<Select.Positioner>
							<Select.Content>
								{languageCollection().items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
						<Select.HiddenSelect />
					</Select.Root>
				</FieldRow>
			</Section>
		</styled.div>
	)
}, 'SettingsPage')
