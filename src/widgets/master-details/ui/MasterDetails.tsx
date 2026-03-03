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
			<styled.div display={{ base: 'block', md: 'flex' }}>
				<styled.section
					display={isDetailVisible ? 'none' : 'unset'}
					md={{
						display: 'unset',
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
				>
					{master}
				</styled.section>
				<styled.main
					display={isDetailVisible ? 'unset' : 'none'}
					md={{
						display: 'unset',
						flex: '1',
						minW: '0',
						maxW: '4xl',
						mx: 'auto',
					}}
				>
					{detail}
				</styled.main>
			</styled.div>
		</styled.div>
	)
}
