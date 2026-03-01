import type { ChangeEvent } from 'react'

import { createListCollection } from '@ark-ui/react/select'
import { atom, reatomEnum, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Button, Input, Select, Switch, VisuallyHidden } from '#shared/components'
import {
	localeAtom,
	reatomLoc,
	showGithubLinkInTopBarAtom,
	showLanguageSwitcherInTopBarAtom,
	showThemeSwitcherInTopBarAtom,
	themePreferenceAtom,
} from '#shared/model'
import { withCoerce } from '#shared/reatom'
import { styled } from '#styled-system/jsx'

import { FieldRow } from './components/FieldRow'
import { Section } from './components/Section'

// Profile atoms
const displayNameAtom = atom('Alex Johnson', 'settings.displayName')
const emailAtom = atom('alex@example.com', 'settings.email')
const profileDirtyAtom = atom(false, 'settings.profileDirty')

// Notifications atoms
const emailNotifAtom = reatomEnum(['all', 'important', 'none'], 'settings.emailNotif').extend(
	withCoerce('all'),
)
const desktopNotifAtom = reatomEnum(['enabled', 'disabled'], 'settings.desktopNotif').extend(
	withCoerce('enabled'),
)
const notifDirtyAtom = atom(false, 'settings.notifDirty')

// Appearance atoms
const densityAtom = reatomEnum(['compact', 'comfortable', 'spacious'], 'settings.density').extend(
	withCoerce('compact'),
)

const emailNotificationsCollection = reatomLoc(
	() =>
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

const desktopNotificationsCollection = reatomLoc(
	() =>
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

const themeCollection = reatomLoc(
	() =>
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

const densityCollection = reatomLoc(
	() =>
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

const languageCollection = reatomLoc(
	() =>
		createListCollection({
			items: localeAtom.locales.map((locale) => ({
				label: localeAtom.label(locale)(),
				value: locale,
			})),
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'settings.languageCollection',
)

export const SettingsPage = reatomComponent(() => {
	return (
		<styled.div p="8" maxW="800px">
			<VisuallyHidden as="h1">{m.settings_title()}</VisuallyHidden>

			<Section
				title={m.settings_profile()}
				footer={
					profileDirtyAtom() ? (
						<Button size="sm" onClick={wrap(() => profileDirtyAtom.set(false))}>
							{m.settings_save_changes()}
						</Button>
					) : null
				}
			>
				<FieldRow label={m.settings_display_name()} description={m.settings_display_name_desc()}>
					<Input
						value={displayNameAtom()}
						size="sm"
						onChange={wrap((e: ChangeEvent<HTMLInputElement>) => {
							displayNameAtom.set(e.target.value)
							profileDirtyAtom.set(true)
						})}
					/>
				</FieldRow>
				<FieldRow label={m.settings_email()} description={m.settings_email_desc()}>
					<Input
						value={emailAtom()}
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
					notifDirtyAtom() ? (
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
						value={[emailNotifAtom()]}
						onValueChange={wrap(({ value }) => {
							emailNotifAtom.set(value[0])
							notifDirtyAtom.set(true)
						})}
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
						value={[desktopNotifAtom()]}
						onValueChange={wrap(({ value }) => {
							desktopNotifAtom.set(value[0])
							notifDirtyAtom.set(true)
						})}
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
						checked={showLanguageSwitcherInTopBarAtom()}
						onCheckedChange={wrap(({ checked }) => showLanguageSwitcherInTopBarAtom.set(checked))}
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
						checked={showGithubLinkInTopBarAtom()}
						onCheckedChange={wrap(({ checked }) => showGithubLinkInTopBarAtom.set(checked))}
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
						checked={showThemeSwitcherInTopBarAtom()}
						onCheckedChange={wrap(({ checked }) => showThemeSwitcherInTopBarAtom.set(checked))}
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
						value={[themePreferenceAtom()]}
						onValueChange={wrap(({ value }) => void themePreferenceAtom.set(value[0]))}
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
						value={[densityAtom()]}
						onValueChange={wrap(({ value }) => void densityAtom.set(value[0]))}
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
						value={[localeAtom()]}
						onValueChange={wrap((details) => void localeAtom.set(details.value[0]))}
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
