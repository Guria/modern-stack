import { SquarePen } from 'lucide-react'

import type { Conversation } from '#entities/conversation'

import { Avatar, Badge, IconButton, Input } from '#shared/components'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

type ConversationListProps = {
	conversations: Conversation[]
	selectedId: string | undefined
	getConversationHref: (conversationId: string) => string
}

export function ConversationList({
	conversations,
	selectedId,
	getConversationHref,
}: ConversationListProps) {
	return (
		<styled.div>
			<styled.div
				p="3"
				borderBottomWidth="1px"
				borderColor="gray.4"
				display="flex"
				gap="2"
				alignItems="center"
			>
				<Input placeholder="Search conversations..." size="sm" flex="1" />
				<IconButton size="sm" variant="plain" aria-label="New conversation">
					<SquarePen className={css({ w: '4', h: '4' })} />
				</IconButton>
			</styled.div>
			{conversations.map((conversation) => (
				<styled.a
					key={conversation.id}
					href={getConversationHref(conversation.id)}
					display="flex"
					alignItems="center"
					gap="3"
					px="4"
					py="3"
					cursor="pointer"
					textDecoration="none"
					color="inherit"
					bg={selectedId === conversation.id ? 'gray.3' : 'transparent'}
					_hover={{ bg: 'gray.3' }}
					borderBottomWidth="1px"
					borderColor="gray.4"
				>
					<styled.div position="relative" flexShrink={0}>
						<Avatar.Root w="10" h="10">
							<Avatar.Fallback
								name={conversation.name}
								bg="colorPalette.3"
								fontSize="sm"
								fontWeight="bold"
								color="colorPalette.11"
							/>
						</Avatar.Root>
						{conversation.online && (
							<styled.div
								position="absolute"
								bottom="0"
								right="0"
								w="3"
								h="3"
								borderRadius="full"
								bg="green.9"
								borderWidth="2px"
								borderColor="gray.1"
							/>
						)}
					</styled.div>

					<styled.div flex="1" minW="0">
						<styled.div display="flex" justifyContent="space-between" alignItems="center" mb="0.5">
							<styled.span fontWeight="medium" fontSize="sm" truncate>
								{conversation.name}
							</styled.span>
							<styled.span fontSize="xs" color="gray.11" flexShrink={0}>
								{conversation.time}
							</styled.span>
						</styled.div>
						<styled.div display="flex" justifyContent="space-between" alignItems="center">
							<styled.span fontSize="xs" color="gray.11" truncate>
								{conversation.lastMessage}
							</styled.span>
							{conversation.unread > 0 && (
								<Badge
									size="sm"
									bg="indigo.solid.bg"
									color="indigo.solid.fg"
									borderRadius="full"
									minW="5"
									textAlign="center"
								>
									{conversation.unread}
								</Badge>
							)}
						</styled.div>
					</styled.div>
				</styled.a>
			))}
		</styled.div>
	)
}
