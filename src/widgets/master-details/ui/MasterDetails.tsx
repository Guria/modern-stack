import { type ReactNode } from 'react'

import { styled } from '#styled-system/jsx'

type Props = {
	master: ReactNode
	detail: ReactNode
	isDetailVisible: boolean
	masterWidth?: string
}

export function MasterDetails({ master, detail, isDetailVisible, masterWidth = '300px' }: Props) {
	return (
		<styled.div>
			<styled.div display={{ base: 'block', md: 'flex' }}>
				<styled.section
					display={isDetailVisible ? 'none' : 'block'}
					md={{
						display: 'block',
						width: masterWidth,
						flexShrink: 0,
						alignSelf: 'flex-start',
						position: 'sticky',
						top: 'var(--app-header-h, 0px)',
						h: 'calc(100dvh - var(--app-header-h, 0px))',
						borderRightWidth: '1px',
						borderColor: 'border',
						overflowY: 'auto',
					}}
					p={0.5}
				>
					{master}
				</styled.section>
				<styled.main
					display={isDetailVisible ? 'block' : 'none'}
					md={{
						display: 'block',
						flex: '1',
						minW: '0',
						mx: 'auto',
					}}
				>
					{detail}
				</styled.main>
			</styled.div>
		</styled.div>
	)
}
