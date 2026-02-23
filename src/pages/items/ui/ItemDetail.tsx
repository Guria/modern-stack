import type { Item } from '#entities/item'

import { m } from '#paraglide/messages.js'
import { Badge, Breadcrumb } from '#shared/components'
import { styled } from '#styled-system/jsx'

import { CategoryBadge } from './components/CategoryBadge'

export function ItemDetail({ item, itemsHref }: { item: Item; itemsHref: string }) {
	return (
		<styled.div p="8" maxW="600px">
			<Breadcrumb.Root mb="6">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href={itemsHref}>{m.nav_items()}</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item aria-current="page">{item.name}</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<styled.div display="flex" alignItems="center" gap="3" mb="6">
				<styled.h1 fontSize="2xl" fontWeight="bold">
					{item.name}
				</styled.h1>
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
					<styled.span fontSize="sm" color="gray.11" w="24">
						{m.items_label_price()}
					</styled.span>
					<styled.span fontSize="sm" fontWeight="semibold" fontVariantNumeric="tabular-nums">
						${item.price.toFixed(2)}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						{m.items_label_category()}
					</styled.span>
					<styled.span fontSize="sm" textTransform="capitalize">
						{item.category}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						{m.items_label_stock()}
					</styled.span>
					<styled.span fontSize="sm">
						{item.inStock ? m.items_stock_in_stock() : m.items_stock_out_of_stock()}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						{m.items_label_id()}
					</styled.span>
					<styled.span fontSize="sm" color="gray.11" fontVariantNumeric="tabular-nums">
						{item.id}
					</styled.span>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}
