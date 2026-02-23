import type { Connection } from '#entities/connection'

import { m } from '#paraglide/messages.js'
import { styled } from '#styled-system/jsx'

import { ConnectionStatusBadge } from './ConnectionStatusBadge'
import { ConnectionTypeBadge } from './ConnectionTypeBadge'

type ConnectionListProps = {
	connections: Connection[]
	selectedId: string | undefined
	getConnectionHref: (connectionId: string) => string
}

export function ConnectionList({
	connections,
	selectedId,
	getConnectionHref,
}: ConnectionListProps) {
	return (
		<>
			<styled.h3 fontSize="sm" fontWeight="semibold" p="4" color="gray.11">
				{m.nav_connections()}
			</styled.h3>
			{connections.map((connection) => (
				<styled.a
					key={connection.id}
					href={getConnectionHref(connection.id)}
					display="block"
					w="100%"
					textAlign="left"
					px="4"
					py="3"
					cursor="pointer"
					textDecoration="none"
					color="inherit"
					bg={selectedId === connection.id ? 'gray.3' : 'transparent'}
					_hover={{ bg: 'gray.3' }}
					borderBottomWidth="1px"
					borderColor="gray.4"
				>
					<styled.div display="flex" alignItems="center" justifyContent="space-between" gap="2">
						<styled.span fontWeight="medium" fontSize="sm" truncate>
							{connection.name}
						</styled.span>
						<ConnectionStatusBadge status={connection.status} />
					</styled.div>
					<styled.div display="flex" alignItems="center" gap="2" mt="1">
						<ConnectionTypeBadge type={connection.type} />
						<styled.span fontSize="xs" color="gray.11" lineClamp={1}>
							{connection.description}
						</styled.span>
					</styled.div>
				</styled.a>
			))}
		</>
	)
}
