import { type ReactNode } from 'react'

import { m } from '#paraglide/messages.js'
import { Button, Card } from '#shared/components'
import { styled } from '#styled-system/jsx'

type PageErrorProps = {
	title: ReactNode
	description: ReactNode
} & ({ onRetry: () => void; retryLabel?: ReactNode } | { onRetry?: never; retryLabel?: never })

export function PageError({ title, description, retryLabel, onRetry }: PageErrorProps) {
	return (
		<Card.Root
			role="alert"
			p="8"
			borderWidth="1px"
			borderColor="red.subtle.fg"
			borderRadius="xl"
			bg="red.subtle.bg"
			m="8"
		>
			<styled.h2 fontSize="lg" fontWeight="semibold" color="red.subtle.fg" mb="2">
				{title}
			</styled.h2>
			<styled.p color="red.subtle.fg" mb="4">
				{description}
			</styled.p>
			{onRetry && (
				<Button
					variant="outline"
					size="sm"
					color="red.subtle.fg"
					borderColor="red.subtle.fg"
					w="fit-content"
					onClick={onRetry}
				>
					{retryLabel ?? m.error_retry()}
				</Button>
			)}
		</Card.Root>
	)
}
