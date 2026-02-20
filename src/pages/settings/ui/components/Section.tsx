import type { ReactNode } from 'react'

import { styled } from '#styled-system/jsx'

type SectionProps = {
	title: string
	children: ReactNode
	footer?: ReactNode
}

export function Section({ title, children, footer }: SectionProps) {
	return (
		<styled.section mb="8">
			<styled.h2
				fontSize="lg"
				fontWeight="semibold"
				mb="4"
				pb="2"
				borderBottomWidth="1px"
				borderColor="gray.4"
			>
				{title}
			</styled.h2>
			<styled.div display="grid" gap="4">
				{children}
			</styled.div>
			{footer && <styled.div mt="4">{footer}</styled.div>}
		</styled.section>
	)
}
