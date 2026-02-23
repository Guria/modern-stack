import { Send } from 'lucide-react'

import type { Conversation } from '#entities/conversation'

import { m } from '#paraglide/messages.js'
import { Button, Input } from '#shared/components'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

import { ConversationHeaderContent } from './ConversationHeaderContent'

export function MessageThread({ conversation }: { conversation: Conversation }) {
	return (
		<styled.div display="flex" flexDirection="column" h="calc(100dvh - 3.5rem)">
			<styled.div
				px="6"
				py="3"
				borderBottomWidth="1px"
				borderColor="gray.4"
				display={{ base: 'none', md: 'flex' }}
				alignItems="center"
				flexShrink={0}
			>
				<ConversationHeaderContent conversation={conversation} />
			</styled.div>

			<styled.div flex="1" overflowY="auto" p="6" display="flex" flexDirection="column">
				<styled.div mt="auto" display="flex" flexDirection="column" gap="4">
					{conversation.messages.map((message) => (
						<styled.div
							key={message.id}
							display="flex"
							flexDirection="column"
							alignItems={message.isOwn ? 'flex-end' : 'flex-start'}
							maxW="75%"
							alignSelf={message.isOwn ? 'flex-end' : 'flex-start'}
						>
							{!message.isOwn && (
								<styled.span fontSize="xs" fontWeight="medium" mb="1" color="gray.11">
									{message.sender}
								</styled.span>
							)}
							<styled.div
								px="4"
								py="2.5"
								borderRadius="xl"
								bg={message.isOwn ? 'colorPalette.9' : 'gray.3'}
								color={message.isOwn ? 'white' : 'inherit'}
								fontSize="sm"
								lineHeight="relaxed"
								borderBottomRightRadius={message.isOwn ? 'sm' : 'xl'}
								borderBottomLeftRadius={message.isOwn ? 'xl' : 'sm'}
							>
								{message.text}
							</styled.div>
							<styled.span fontSize="2xs" color="gray.11" mt="1">
								{message.time}
							</styled.span>
						</styled.div>
					))}
				</styled.div>
			</styled.div>

			<styled.div px="4" py="3" borderTopWidth="1px" borderColor="gray.4" flexShrink={0}>
				<styled.div display="flex" gap="2" alignItems="center">
					<Input placeholder={m.chat_message_placeholder()} size="sm" flex="1" />
					<Button size="sm" variant="solid">
						<Send className={css({ w: '4', h: '4' })} />
					</Button>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}
