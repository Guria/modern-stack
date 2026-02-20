import type { ChangeEvent } from 'react'

import { createListCollection } from '@ark-ui/react/select'
import { atom, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { Button, Input, Select } from '#shared/components'
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
const themeAtom = atom('system', 'settings.theme')
const densityAtom = atom('comfortable', 'settings.density')
const appearanceDirtyAtom = atom(false, 'settings.appearanceDirty')

const emailNotificationsCollection = createListCollection({
	items: [
		{ label: 'All activity', value: 'all' },
		{ label: 'Important only', value: 'important' },
		{ label: 'None', value: 'none' },
	] as const,
	itemToString: (item) => item.label,
	itemToValue: (item) => item.value,
})

const desktopNotificationsCollection = createListCollection({
	items: [
		{ label: 'Enabled', value: 'enabled' },
		{ label: 'Disabled', value: 'disabled' },
	] as const,
	itemToString: (item) => item.label,
	itemToValue: (item) => item.value,
})

const themeCollection = createListCollection({
	items: [
		{ label: 'Light', value: 'light' },
		{ label: 'Dark', value: 'dark' },
		{ label: 'System', value: 'system' },
	] as const,
	itemToString: (item) => item.label,
	itemToValue: (item) => item.value,
})

const densityCollection = createListCollection({
	items: [
		{ label: 'Compact', value: 'compact' },
		{ label: 'Comfortable', value: 'comfortable' },
		{ label: 'Spacious', value: 'spacious' },
	] as const,
	itemToString: (item) => item.label,
	itemToValue: (item) => item.value,
})

export const SettingsPage = reatomComponent(() => {
	const displayName = displayNameAtom()
	const email = emailAtom()
	const profileDirty = profileDirtyAtom()

	const emailNotif = emailNotifAtom()
	const desktopNotif = desktopNotifAtom()
	const notifDirty = notifDirtyAtom()

	const theme = themeAtom()
	const density = densityAtom()
	const appearanceDirty = appearanceDirtyAtom()

	return (
		<styled.div p="8" maxW="800px">
			<styled.h1 fontSize="2xl" fontWeight="bold" mb="8">
				Settings
			</styled.h1>

			<Section
				title="Profile"
				footer={
					profileDirty ? (
						<Button size="sm" onClick={wrap(() => profileDirtyAtom.set(false))}>
							Save changes
						</Button>
					) : null
				}
			>
				<FieldRow label="Display name" description="Your name as shown to other users.">
					<Input
						value={displayName}
						size="sm"
						onChange={wrap((e: ChangeEvent<HTMLInputElement>) => {
							displayNameAtom.set(e.target.value)
							profileDirtyAtom.set(true)
						})}
					/>
				</FieldRow>
				<FieldRow label="Email" description="Used for notifications and account recovery.">
					<Input
						value={email}
						size="sm"
						onChange={wrap((e: ChangeEvent<HTMLInputElement>) => {
							emailAtom.set(e.target.value)
							profileDirtyAtom.set(true)
						})}
					/>
				</FieldRow>
				<FieldRow label="Role">
					<styled.span fontSize="sm" color="gray.11">
						Admin
					</styled.span>
				</FieldRow>
			</Section>

			<Section
				title="Notifications"
				footer={
					notifDirty ? (
						<Button size="sm" onClick={wrap(() => notifDirtyAtom.set(false))}>
							Save changes
						</Button>
					) : null
				}
			>
				<FieldRow
					label="Email notifications"
					description="Receive updates about activity in your projects."
				>
					<Select.Root
						collection={emailNotificationsCollection}
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
								{emailNotificationsCollection.items.map((item) => (
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
					label="Desktop notifications"
					description="Show browser notifications for real-time alerts."
				>
					<Select.Root
						collection={desktopNotificationsCollection}
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
								{desktopNotificationsCollection.items.map((item) => (
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

			<Section
				title="Appearance"
				footer={
					appearanceDirty ? (
						<Button size="sm" onClick={wrap(() => appearanceDirtyAtom.set(false))}>
							Save changes
						</Button>
					) : null
				}
			>
				<FieldRow label="Theme" description="Choose your preferred color scheme.">
					<Select.Root
						collection={themeCollection}
						size="sm"
						w="100%"
						value={[theme]}
						onValueChange={wrap(
							(details: Select.ValueChangeDetails<{ label: string; value: string }>) => {
								const val = details.value[0]
								if (val !== undefined) {
									themeAtom.set(val)
									appearanceDirtyAtom.set(true)
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
								{themeCollection.items.map((item) => (
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
				<FieldRow label="Density" description="Adjust the spacing of UI elements.">
					<Select.Root
						collection={densityCollection}
						size="sm"
						w="100%"
						value={[density]}
						onValueChange={wrap(
							(details: Select.ValueChangeDetails<{ label: string; value: string }>) => {
								const val = details.value[0]
								if (val !== undefined) {
									densityAtom.set(val)
									appearanceDirtyAtom.set(true)
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
								{densityCollection.items.map((item) => (
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
