import { ChevronsUpDown } from 'lucide-react'

import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function OrgSwitcher() {
	return (
		<styled.button
			display="flex"
			alignItems="center"
			gap="2"
			w="100%"
			px="2"
			py="2"
			borderRadius="md"
			cursor="pointer"
			bg="transparent"
			border="none"
			color="inherit"
			_hover={{ bg: 'colorPalette.surface.bg.active' }}
			className={css({ '[data-sidebar-collapsed] &': { justifyContent: 'center' } })}
		>
			<styled.div
				w="8"
				h="8"
				borderRadius="md"
				bg="colorPalette.3"
				flexShrink={0}
				display="flex"
				alignItems="center"
				justifyContent="center"
				fontSize="xs"
				fontWeight="bold"
				color="colorPalette.11"
			>
				A
			</styled.div>
			<styled.div
				flex="1"
				minW="0"
				textAlign="left"
				className={css({ '[data-sidebar-collapsed] &': { display: 'none' } })}
			>
				<styled.div fontSize="sm" fontWeight="medium" truncate>
					Acme Inc
				</styled.div>
				<styled.div fontSize="xs" color="muted" truncate>
					alex@acme.io
				</styled.div>
			</styled.div>
			<ChevronsUpDown
				className={css({
					w: '4',
					h: '4',
					color: 'muted',
					flexShrink: '0',
					'[data-sidebar-collapsed] &': { display: 'none' },
				})}
			/>
		</styled.button>
	)
}
