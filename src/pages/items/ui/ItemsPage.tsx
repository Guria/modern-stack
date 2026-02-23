import { createListCollection } from '@ark-ui/react/select'
import { reatomEnum, withSearchParams, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import type { Category, Item } from '#entities/item'

import { m } from '#paraglide/messages.js'
import { Badge, Button, Select } from '#shared/components'
import { reatomLoc } from '#shared/model'
import { styled } from '#styled-system/jsx'

import { CategoryBadge } from './components/CategoryBadge'

const sortFieldCollection = reatomLoc(
	(m) =>
		createListCollection({
			items: [
				{ label: m.items_sort_name(), value: 'name' },
				{ label: m.items_sort_price(), value: 'price' },
			] as const satisfies ReadonlyArray<{ label: string; value: 'name' | 'price' }>,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'items.sortFieldCollection',
)

const categoryCollection = reatomLoc(
	(m) =>
		createListCollection({
			items: [
				{ label: m.items_filter_all(), value: 'all' },
				{ label: m.items_category_electronics(), value: 'electronics' },
				{ label: m.items_category_furniture(), value: 'furniture' },
				{ label: m.items_category_clothing(), value: 'clothing' },
				{ label: m.items_category_food(), value: 'food' },
			] as const satisfies ReadonlyArray<{ label: string; value: Category | 'all' }>,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'items.categoryCollection',
)

const stockCollection = reatomLoc(
	(m) =>
		createListCollection({
			items: [
				{ label: m.items_filter_all(), value: 'all' },
				{ label: m.items_stock_in_stock(), value: 'in-stock' },
				{ label: m.items_stock_out_of_stock(), value: 'out-of-stock' },
			] as const satisfies ReadonlyArray<{
				label: string
				value: 'all' | 'in-stock' | 'out-of-stock'
			}>,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'items.stockCollection',
)

const sortFieldAtom = reatomEnum(['name', 'price'], 'items.sortField').extend(
	withSearchParams('sort'),
)

const sortDirAtom = reatomEnum(['asc', 'desc'], 'items.sortDir').extend(withSearchParams('dir'))

const categoryFilterAtom = reatomEnum(
	['all', 'electronics', 'furniture', 'clothing', 'food'],
	'items.categoryFilter',
).extend(withSearchParams('category'))

const stockFilterAtom = reatomEnum(['all', 'in-stock', 'out-of-stock'], 'items.stockFilter').extend(
	withSearchParams('stock'),
)

type ItemsPageProps = {
	items: Item[]
	getItemHref: (itemId: string) => string
}

export const ItemsPage = reatomComponent(({ items, getItemHref }: ItemsPageProps) => {
	const sortField = sortFieldAtom()
	const sortDir = sortDirAtom()
	const categoryFilter = categoryFilterAtom()
	const stockFilter = stockFilterAtom()

	let filtered = items.filter((item) => {
		if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
		if (stockFilter === 'in-stock' && !item.inStock) return false
		if (stockFilter === 'out-of-stock' && item.inStock) return false
		return true
	})

	filtered = [...filtered].sort((left, right) => {
		const directionMultiplier = sortDir === 'asc' ? 1 : -1
		if (sortField === 'name') return directionMultiplier * left.name.localeCompare(right.name)
		return directionMultiplier * (left.price - right.price)
	})

	return (
		<styled.div p="6">
			<styled.h1 fontSize="2xl" fontWeight="bold" mb="6">
				{m.items_title()}
			</styled.h1>

			<styled.div display="flex" flexWrap="wrap" gap="3" mb="6" alignItems="center">
				<styled.label fontSize="sm" fontWeight="medium" display="flex" alignItems="center" gap="2">
					{m.items_sort_by()}
					<Select.Root
						collection={sortFieldCollection()}
						size="sm"
						value={[sortField]}
						onValueChange={wrap((details: Select.ValueChangeDetails) => {
							const value = details.value[0]
							if (value) sortFieldAtom.set(value as keyof typeof sortFieldAtom.enum)
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
								{sortFieldCollection().items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
						<Select.HiddenSelect />
					</Select.Root>
				</styled.label>

				<Button
					variant="outline"
					size="sm"
					onClick={wrap(() => sortDirAtom.set(sortDirAtom() === 'asc' ? 'desc' : 'asc'))}
				>
					{sortDir === 'asc' ? m.items_sort_asc() : m.items_sort_desc()}
				</Button>

				<styled.label fontSize="sm" fontWeight="medium" display="flex" alignItems="center" gap="2">
					{m.items_label_category()}
					<Select.Root
						collection={categoryCollection()}
						size="sm"
						value={[categoryFilter]}
						onValueChange={wrap((details: Select.ValueChangeDetails) => {
							const value = details.value[0]
							if (value) categoryFilterAtom.set(value as keyof typeof categoryFilterAtom.enum)
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
								{categoryCollection().items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
						<Select.HiddenSelect />
					</Select.Root>
				</styled.label>

				<styled.label fontSize="sm" fontWeight="medium" display="flex" alignItems="center" gap="2">
					{m.items_label_stock()}
					<Select.Root
						collection={stockCollection()}
						size="sm"
						value={[stockFilter]}
						onValueChange={wrap((details: Select.ValueChangeDetails) => {
							const value = details.value[0]
							if (value) stockFilterAtom.set(value as keyof typeof stockFilterAtom.enum)
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
								{stockCollection().items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
						<Select.HiddenSelect />
					</Select.Root>
				</styled.label>
			</styled.div>

			<styled.p fontSize="sm" color="gray.11" mb="3">
				{m.items_found({ count: filtered.length })}
			</styled.p>

			<styled.div display="grid" gap="3">
				{filtered.map((item) => (
					<styled.a
						key={item.id}
						href={getItemHref(item.id)}
						display="flex"
						alignItems="center"
						justifyContent="space-between"
						px="4"
						py="3"
						borderWidth="1px"
						borderColor="gray.4"
						borderRadius="lg"
						textDecoration="none"
						color="inherit"
						_hover={{ bg: 'gray.3' }}
					>
						<styled.div display="flex" alignItems="center" gap="3">
							<styled.span fontWeight="medium" fontSize="sm">
								{item.name}
							</styled.span>
							<CategoryBadge category={item.category} />
							{!item.inStock && (
								<Badge
									size="sm"
									bg="red.subtle.bg"
									color="red.subtle.fg"
									borderWidth="1px"
									borderColor="red.6"
								>
									{m.items_stock_out_of_stock()}
								</Badge>
							)}
						</styled.div>
						<styled.span fontWeight="semibold" fontSize="sm" fontVariantNumeric="tabular-nums">
							${item.price.toFixed(2)}
						</styled.span>
					</styled.a>
				))}
				{filtered.length === 0 && (
					<styled.p color="gray.11" fontSize="sm" py="8" textAlign="center">
						{m.items_no_results()}
					</styled.p>
				)}
			</styled.div>
		</styled.div>
	)
})
