import type { Connection } from '#entities/connection'

import { m } from '#paraglide/messages.js'
import { Button, toaster } from '#shared/components'
import { styled } from '#styled-system/jsx'

import { ConnectionStatusBadge } from './components/ConnectionStatusBadge'
import { ConnectionTypeBadge } from './components/ConnectionTypeBadge'

export function ConnectionDetail({ connection }: { connection: Connection }) {
	const handleTest = () => {
		const id = toaster.create({ title: m.connection_testing(), type: 'loading', closable: false })
		setTimeout(() => {
			toaster.update(id, {
				title: m.connection_successful(),
				description: connection.name,
				type: 'success',
			})
		}, 1500)
	}

	const handleReconnect = () => {
		const id = toaster.create({
			title: m.connection_reconnecting(),
			type: 'loading',
			closable: false,
		})
		setTimeout(() => {
			toaster.update(id, {
				title: m.connection_reconnected_successfully(),
				description: connection.name,
				type: 'success',
			})
		}, 1500)
	}

	return (
		<styled.div p="8">
			<styled.div display="flex" alignItems="center" gap="3" mb="6" flexWrap="wrap">
				<styled.h1 fontSize="2xl" fontWeight="bold" flex="1">
					{connection.name}
				</styled.h1>
				<ConnectionTypeBadge type={connection.type} />
				<ConnectionStatusBadge status={connection.status} />
				{connection.status === 'error' && (
					<Button size="sm" onClick={handleReconnect}>
						{m.connection_reconnect()}
					</Button>
				)}
				<Button size="sm" variant="outline" onClick={handleTest}>
					{m.connection_test()}
				</Button>
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
		</styled.div>
	)
}
