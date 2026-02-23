import { MessageSquare } from 'lucide-react'

import { m } from '#paraglide/messages.js'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function MessageThreadNoSelection() {
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
			<MessageSquare className={css({ w: '10', h: '10', color: 'gray.subtle.fg' })} />
			<styled.p fontWeight="medium" fontSize="sm">
				{m.chat_no_selection()}
			</styled.p>
			<styled.p fontSize="xs">{m.chat_no_selection_desc()}</styled.p>
		</styled.div>
	)
}
