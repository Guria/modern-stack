import { Package } from 'lucide-react'

import { m } from '#paraglide/messages.js'
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
				{m.item_no_selection()}
			</styled.p>
			<styled.p fontSize="xs">{m.item_no_selection_desc()}</styled.p>
		</styled.div>
	)
}
