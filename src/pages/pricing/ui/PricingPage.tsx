import { Badge, Button } from '#shared/components'
import { styled } from '#styled-system/jsx'

const currentPlan = 'free'

const plans = [
	{
		id: 'free',
		name: 'Free',
		price: '$0/mo',
		features: ['1 GB storage', '3 users', 'Community support'],
	},
	{
		id: 'pro',
		name: 'Pro',
		price: '$12/mo',
		features: ['10 GB storage', '10 users', 'Priority support'],
		highlighted: true,
	},
	{
		id: 'team',
		name: 'Team',
		price: '$29/mo',
		features: ['100 GB storage', 'Unlimited users', 'Dedicated support'],
	},
]

function PlanCard({
	name,
	price,
	features,
	highlighted,
	isCurrent,
}: {
	name: string
	price: string
	features: string[]
	highlighted?: boolean
	isCurrent?: boolean
}) {
	let buttonLabel: string
	if (isCurrent) {
		buttonLabel = 'Current plan'
	} else if (highlighted) {
		buttonLabel = 'Upgrade to Pro'
	} else {
		buttonLabel = `Get ${name}`
	}

	return (
		<styled.div
			p="6"
			borderWidth="1px"
			borderColor={highlighted ? 'blue.9' : 'gray.4'}
			borderRadius="lg"
			bg={highlighted ? 'blue.subtle.bg' : 'transparent'}
			display="flex"
			flexDirection="column"
			gap="4"
		>
			<styled.div>
				<styled.div display="flex" alignItems="center" gap="2" mb="1">
					<styled.span fontSize="lg" fontWeight="semibold">
						{name}
					</styled.span>
					{isCurrent && (
						<Badge
							bg="green.subtle.bg"
							color="green.subtle.fg"
							borderWidth="1px"
							borderColor="green.subtle.fg"
							size="sm"
						>
							Current plan
						</Badge>
					)}
				</styled.div>
				<styled.div fontSize="2xl" fontWeight="bold">
					{price}
				</styled.div>
			</styled.div>
			<styled.ul listStyleType="none" p="0" m="0" display="flex" flexDirection="column" gap="2">
				{features.map((f) => (
					<styled.li
						key={f}
						fontSize="sm"
						color="gray.11"
						display="flex"
						alignItems="center"
						gap="2"
					>
						<styled.span color="green.9">✓</styled.span>
						{f}
					</styled.li>
				))}
			</styled.ul>
			<Button
				mt="auto"
				w="full"
				{...(highlighted && { colorPalette: 'blue' })}
				variant={isCurrent ? 'subtle' : highlighted ? 'solid' : 'outline'}
				disabled={isCurrent}
			>
				{buttonLabel}
			</Button>
		</styled.div>
	)
}

export function PricingPage() {
	return (
		<styled.div p="8" maxW="800px">
			<styled.h1 fontSize="2xl" fontWeight="bold" mb="2">
				Pricing
			</styled.h1>
			<styled.p fontSize="sm" color="gray.11" mb="8">
				Choose the plan that works best for you.
			</styled.p>

			<styled.div
				display="grid"
				gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
				gap="4"
			>
				{plans.map((plan) => (
					<PlanCard key={plan.name} {...plan} isCurrent={plan.id === currentPlan} />
				))}
			</styled.div>
		</styled.div>
	)
}
