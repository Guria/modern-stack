import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

import { percentage, totalGB, usedGB } from '../model/data'

export function UsageCard({ active }: { active?: boolean }) {
	return (
		<styled.div
			px="2"
			py="2"
			borderRadius="md"
			bg={active ? 'gray.4' : 'transparent'}
			_hover={{ bg: 'gray.3' }}
			cursor="pointer"
			w="full"
			className={css({ '[data-sidebar-collapsed] &': { display: 'none' } })}
		>
			<styled.div
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				mb="1"
				fontSize="xs"
				color="gray.11"
			>
				<styled.span fontWeight="medium" color="gray.12">
					Storage
				</styled.span>
				<styled.span>
					{usedGB} GB / {totalGB} GB
				</styled.span>
			</styled.div>
			<styled.div w="full" h="1.5" bg="gray.4" borderRadius="full" overflow="hidden">
				<styled.div
					h="full"
					bg={percentage >= 90 ? 'red.9' : percentage >= 70 ? 'orange.9' : 'blue.9'}
					borderRadius="full"
					style={{ width: `${percentage}%` }}
				/>
			</styled.div>
			<styled.div fontSize="xs" color="gray.11" mt="0.5">
				{percentage}% used
			</styled.div>
		</styled.div>
	)
}
