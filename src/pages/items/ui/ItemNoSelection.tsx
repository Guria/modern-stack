import { Package } from 'lucide-react'

import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function ItemNoSelection() {
	return (
		<styled.div
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			h="100%"
			gap="3"
			color="gray.11"
			p="8"
			textAlign="center"
		>
			<Package className={css({ w: '10', h: '10', color: 'gray.subtle.fg' })} />
			<styled.p fontWeight="medium" fontSize="sm">
				No item selected
			</styled.p>
			<styled.p fontSize="xs">Choose an item from the list to view its details.</styled.p>
		</styled.div>
	)
}
