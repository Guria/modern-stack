import { m } from '#paraglide/messages.js'
import { styled } from '#styled-system/jsx'

export function ItemNotFound({ itemId }: { itemId: string }) {
	return (
		<styled.div p="8" color="gray.11" fontSize="sm">
			{m.item_not_found_description({ itemId })}
		</styled.div>
	)
}
