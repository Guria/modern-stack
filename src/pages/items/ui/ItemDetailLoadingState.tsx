import { Skeleton } from '#shared/components'
import { styled } from '#styled-system/jsx'

export function ItemDetailLoadingState() {
	return (
		<styled.div p="8" display="flex" flexDirection="column" gap="4">
			<Skeleton h="8" w="48" />
			<Skeleton h="4" w="24" />
			<Skeleton h="4" w="full" />
		</styled.div>
	)
}
