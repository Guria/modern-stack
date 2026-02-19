import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function PricingBanner({ active }: { active?: boolean }) {
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
			<styled.div fontWeight="medium" fontSize="sm" color="gray.12" mb="0.5">
				Upgrade to Pro
			</styled.div>
			<styled.div fontSize="xs" color="gray.11" mb="2">
				Unlimited storage &amp; more
			</styled.div>
			<styled.div
				fontSize="xs"
				fontWeight="medium"
				color="blue.subtle.fg"
				bg="blue.subtle.bg"
				px="2"
				py="0.5"
				borderRadius="sm"
				display="inline-block"
			>
				View plans →
			</styled.div>
		</styled.div>
	)
}
