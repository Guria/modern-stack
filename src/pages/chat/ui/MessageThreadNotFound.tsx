import { m } from '#paraglide/messages.js'
import { styled } from '#styled-system/jsx'

export function MessageThreadNotFound({ conversationId }: { conversationId: string }) {
	return (
		<styled.div display="flex" alignItems="center" justifyContent="center" h="100%" px="6">
			<styled.div textAlign="center">
				<styled.h2 fontSize="xl" fontWeight="semibold" color="red.subtle.fg" mb="2">
					{m.chat_not_found()}
				</styled.h2>
				<styled.p color="red.subtle.fg">
					{m.chat_not_found_description({ conversationId })}
				</styled.p>
			</styled.div>
		</styled.div>
	)
}
