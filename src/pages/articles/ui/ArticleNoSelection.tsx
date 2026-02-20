import { FileText } from 'lucide-react'

import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function ArticleNoSelection() {
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
			<FileText className={css({ w: '10', h: '10', color: 'gray.subtle.fg' })} />
			<styled.p fontWeight="medium" fontSize="sm">
				No article selected
			</styled.p>
			<styled.p fontSize="xs">Choose an article from the list to view its content.</styled.p>
		</styled.div>
	)
}
