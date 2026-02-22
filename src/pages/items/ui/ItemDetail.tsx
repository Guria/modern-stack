import type { Item } from '#entities/item'

import { Badge, Breadcrumb } from '#shared/components'
import { styled } from '#styled-system/jsx'

import { itemsRoute } from '../model/routes'
import { CategoryBadge } from './components/CategoryBadge'

export function ItemDetail({ item }: { item: Item }) {
	return (
		<styled.div p="8" maxW="600px">
			<Breadcrumb.Root mb="6">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href={itemsRoute.path()}>Items</Breadcrumb.Link>
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
						Out of Stock
					</Badge>
				)}
			</styled.div>

			<styled.div display="grid" gap="3">
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						Price
					</styled.span>
					<styled.span fontSize="sm" fontWeight="semibold" fontVariantNumeric="tabular-nums">
						${item.price.toFixed(2)}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						Category
					</styled.span>
					<styled.span fontSize="sm" textTransform="capitalize">
						{item.category}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						Stock
					</styled.span>
					<styled.span fontSize="sm">{item.inStock ? 'In stock' : 'Out of stock'}</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						ID
					</styled.span>
					<styled.span fontSize="sm" color="gray.11" fontVariantNumeric="tabular-nums">
						{item.id}
					</styled.span>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}
