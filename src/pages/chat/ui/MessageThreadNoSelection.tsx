import { MessageSquare } from 'lucide-react'

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
				No conversation selected
			</styled.p>
			<styled.p fontSize="xs">Choose a conversation from the list to start reading.</styled.p>
		</styled.div>
	)
}
