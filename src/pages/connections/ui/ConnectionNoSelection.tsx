import { Link2 } from 'lucide-react'

import { m } from '#paraglide/messages.js'
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
				{m.connection_no_selection()}
			</styled.p>
			<styled.p fontSize="xs">{m.connection_no_selection_desc()}</styled.p>
		</styled.div>
	)
}
