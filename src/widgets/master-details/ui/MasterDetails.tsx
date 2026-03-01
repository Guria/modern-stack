import { type ReactNode } from 'react'

import { styled } from '#styled-system/jsx'

type MasterDetailsProps = {
	master: ReactNode
	detail: ReactNode
	isDetailVisible: boolean
	masterWidth?: string
}

export function MasterDetails({
	master,
	detail,
	isDetailVisible,
	masterWidth = '300px',
}: MasterDetailsProps) {
	return (
		<styled.div>
			<styled.div display={{ base: 'none', md: 'flex' }}>
				<styled.section
					style={{ width: masterWidth }}
					flexShrink={0}
					alignSelf="flex-start"
					position="sticky"
					top="0"
					h="100dvh"
					borderRightWidth="1px"
					borderColor="border"
					overflowY="auto"
				>
					{master}
				</styled.section>
				<styled.main flex="1" minW="0">
					{detail}
				</styled.main>
			</styled.div>

			<styled.div display={{ base: 'block', md: 'none' }}>
				{isDetailVisible ? detail : master}
			</styled.div>
		</styled.div>
	)
}
