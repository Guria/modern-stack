import { styled } from '#styled-system/jsx'

export function ItemNotFound({ itemId }: { itemId: string }) {
	return (
		<styled.div p="8" color="gray.11" fontSize="sm">
			Item "{itemId}" was not found.
		</styled.div>
	)
}
