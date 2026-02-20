import { Link2 } from 'lucide-react'

import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function ConnectionNoSelection() {
	return (
		<styled.div
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			h="100%"
			gap="3"
			p="8"
			textAlign="center"
			color="gray.11"
		>
			<Link2 className={css({ w: '10', h: '10', color: 'gray.subtle.fg' })} />
			<styled.p fontWeight="medium" fontSize="sm">
				No connection selected
			</styled.p>
			<styled.p fontSize="xs">Choose a connection from the list to view its details.</styled.p>
		</styled.div>
	)
}
