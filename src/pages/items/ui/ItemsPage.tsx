import { createListCollection } from '@ark-ui/react/select'
import { atom, withSearchParams, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { type ReactNode } from 'react'

import type { Category, Item } from '#entities/item'

import { Badge, Button, Select } from '#shared/components'
import { styled } from '#styled-system/jsx'
import { MasterDetails } from '#widgets/layout'

import { CategoryBadge } from './components/CategoryBadge'

type SortField = 'name' | 'price'
type SortDir = 'asc' | 'desc'

const sortFieldCollection = createListCollection({
	items: [
		{ label: 'Name', value: 'name' },
		{ label: 'Price', value: 'price' },
	] as const satisfies ReadonlyArray<{ label: string; value: SortField }>,
	itemToString: (item) => item.label,
	itemToValue: (item) => item.value,
})

const categoryCollection = createListCollection({
	items: [
		{ label: 'All', value: 'all' },
		{ label: 'Electronics', value: 'electronics' },
		{ label: 'Furniture', value: 'furniture' },
		{ label: 'Clothing', value: 'clothing' },
		{ label: 'Food', value: 'food' },
	] as const satisfies ReadonlyArray<{ label: string; value: Category | 'all' }>,
	itemToString: (item) => item.label,
	itemToValue: (item) => item.value,
})

const stockCollection = createListCollection({
	items: [
		{ label: 'All', value: 'all' },
		{ label: 'In Stock', value: 'in-stock' },
		{ label: 'Out of Stock', value: 'out-of-stock' },
	] as const satisfies ReadonlyArray<{
		label: string
		value: 'all' | 'in-stock' | 'out-of-stock'
	}>,
	itemToString: (item) => item.label,
	itemToValue: (item) => item.value,
})

const sortFieldAtom = atom<SortField>('name', 'items.sortField').extend(withSearchParams('sort'))
const sortDirAtom = atom<SortDir>('asc', 'items.sortDir').extend(withSearchParams('dir'))
const categoryFilterAtom = atom<Category | 'all'>('all', 'items.categoryFilter').extend(
	withSearchParams('category'),
)
const stockFilterAtom = atom<'all' | 'in-stock' | 'out-of-stock'>(
	'all',
	'items.stockFilter',
).extend(withSearchParams('stock'))

type ItemsPageProps = {
	items: Item[]
	selectedItemId: string | undefined
	getItemHref: (itemId: string) => string
	detail: ReactNode
}

export const ItemsPage = reatomComponent(
	({ items, selectedItemId, getItemHref, detail }: ItemsPageProps) => {
		const sortField = sortFieldAtom()
		const sortDir = sortDirAtom()
		const categoryFilter = categoryFilterAtom()
		const stockFilter = stockFilterAtom()
		const handleSortFieldChange = wrap((details: Select.ValueChangeDetails) => {
			const value = details.value[0]
			if (value) {
				sortFieldAtom.set(value as SortField)
			}
		})
		const handleSortDirectionClick = wrap(() => {
			sortDirAtom.set(sortDir === 'asc' ? 'desc' : 'asc')
		})
		const handleCategoryFilterChange = wrap((details: Select.ValueChangeDetails) => {
			const value = details.value[0]
			if (value) {
				categoryFilterAtom.set(value as Category | 'all')
			}
		})
		const handleStockFilterChange = wrap((details: Select.ValueChangeDetails) => {
			const value = details.value[0]
			if (value) {
				stockFilterAtom.set(value as 'all' | 'in-stock' | 'out-of-stock')
			}
		})

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
			<MasterDetails
				isDetailVisible={selectedItemId !== undefined}
				master={
					<styled.div p="6">
						<styled.h1 fontSize="2xl" fontWeight="bold" mb="6">
							Items
						</styled.h1>

						<styled.div display="flex" flexWrap="wrap" gap="3" mb="6" alignItems="center">
							<styled.label
								fontSize="sm"
								fontWeight="medium"
								display="flex"
								alignItems="center"
								gap="2"
							>
								Sort by
								<Select.Root
									collection={sortFieldCollection}
									size="sm"
									value={[sortField]}
									onValueChange={handleSortFieldChange}
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
											{sortFieldCollection.items.map((item) => (
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

							<Button variant="outline" size="sm" onClick={handleSortDirectionClick}>
								{sortDir === 'asc' ? 'Asc' : 'Desc'}
							</Button>

							<styled.label
								fontSize="sm"
								fontWeight="medium"
								display="flex"
								alignItems="center"
								gap="2"
							>
								Category
								<Select.Root
									collection={categoryCollection}
									size="sm"
									value={[categoryFilter]}
									onValueChange={handleCategoryFilterChange}
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
											{categoryCollection.items.map((item) => (
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

							<styled.label
								fontSize="sm"
								fontWeight="medium"
								display="flex"
								alignItems="center"
								gap="2"
							>
								Stock
								<Select.Root
									collection={stockCollection}
									size="sm"
									value={[stockFilter]}
									onValueChange={handleStockFilterChange}
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
											{stockCollection.items.map((item) => (
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
									bg={selectedItemId === item.id ? 'gray.3' : 'transparent'}
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
												Out of Stock
											</Badge>
										)}
									</styled.div>
									<styled.span
										fontWeight="semibold"
										fontSize="sm"
										fontVariantNumeric="tabular-nums"
									>
										${item.price.toFixed(2)}
									</styled.span>
								</styled.a>
							))}
							{filtered.length === 0 && (
								<styled.p color="gray.11" fontSize="sm" py="8" textAlign="center">
									No items match the current filters.
								</styled.p>
							)}
						</styled.div>
					</styled.div>
				}
				detail={detail}
			/>
		)
	},
)
