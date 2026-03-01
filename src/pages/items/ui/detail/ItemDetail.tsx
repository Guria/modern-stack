import type { Item } from '#entities/item'

import { m } from '#paraglide/messages.js'
import { Badge, Heading } from '#shared/components'
import { styled } from '#styled-system/jsx'

import { CategoryBadge } from '../CategoryBadge'

export function ItemDetail({ item }: { item: Item }) {
	return (
		<styled.div p="8" maxW="600px">
			<styled.div display="flex" alignItems="center" gap="3" mb="6">
				<Heading as="h1" fontSize="2xl" fontWeight="bold">
					{item.name}
				</Heading>
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

			<styled.div display="grid" gap="3">
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="muted" w="24">
						{m.items_label_price()}
					</styled.span>
					<styled.span fontSize="sm" fontWeight="semibold" fontVariantNumeric="tabular-nums">
						${item.price.toFixed(2)}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="muted" w="24">
						{m.items_label_category()}
					</styled.span>
					<styled.span fontSize="sm" textTransform="capitalize">
						{item.category}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="muted" w="24">
						{m.items_label_stock()}
					</styled.span>
					<styled.span fontSize="sm">
						{item.inStock ? m.items_stock_in_stock() : m.items_stock_out_of_stock()}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="muted" w="24">
						{m.items_label_id()}
					</styled.span>
					<styled.span fontSize="sm" color="muted" fontVariantNumeric="tabular-nums">
						{item.id}
					</styled.span>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}
