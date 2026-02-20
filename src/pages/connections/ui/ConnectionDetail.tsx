import type { Connection } from '#entities/connection'

import { Button } from '#shared/components'
import { styled } from '#styled-system/jsx'

import { ConnectionStatusBadge } from './components/ConnectionStatusBadge'
import { ConnectionTypeBadge } from './components/ConnectionTypeBadge'

export function ConnectionDetail({ connection }: { connection: Connection }) {
	return (
		<styled.div p="8">
			<styled.div display="flex" alignItems="center" gap="3" mb="6">
				<styled.h1 fontSize="2xl" fontWeight="bold">
					{connection.name}
				</styled.h1>
				<ConnectionTypeBadge type={connection.type} />
				<ConnectionStatusBadge status={connection.status} />
			</styled.div>
			<styled.p color="gray.11" fontSize="sm" lineHeight="relaxed">
				{connection.description}
			</styled.p>
			<styled.div display="grid" gap="4" mt="6">
				{connection.details.map((paragraph, index) => (
					<styled.p key={index} color="gray.11" fontSize="sm" lineHeight="relaxed">
						{paragraph}
					</styled.p>
				))}
			</styled.div>
			<styled.div display="flex" gap="2" mt="8">
				{connection.status === 'error' && <Button size="sm">Reconnect</Button>}
				<Button size="sm" variant="outline">
					Test connection
				</Button>
			</styled.div>
		</styled.div>
	)
}
