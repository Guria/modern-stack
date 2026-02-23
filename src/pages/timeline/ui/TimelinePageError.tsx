import { m } from '#paraglide/messages.js'
import { Button, Card } from '#shared/components'
import { styled } from '#styled-system/jsx'

type TimelinePageErrorProps = {
	onRetry?: () => void
}

export function TimelinePageError({ onRetry }: TimelinePageErrorProps) {
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
				{m.timeline_error_title()}
			</styled.h2>
			<styled.p color="red.subtle.fg" mb="4">
				{m.timeline_error_description()}
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
					{m.timeline_error_retry()}
				</Button>
			)}
		</Card.Root>
	)
}
