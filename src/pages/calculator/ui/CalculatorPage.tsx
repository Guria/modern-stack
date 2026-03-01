import { action, atom, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Button, VisuallyHidden } from '#shared/components'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

const displayAtom = atom('0', 'calculator.display')
const prevValueAtom = atom<number | null>(null, 'calculator.prevValue')
const operatorAtom = atom<string | null>(null, 'calculator.operator')
const resetNextAtom = atom(false, 'calculator.resetNext')

const inputDigit = action((digit: string) => {
	if (resetNextAtom()) {
		displayAtom.set(digit)
		resetNextAtom.set(false)
	} else {
		displayAtom.set(displayAtom() === '0' ? digit : displayAtom() + digit)
	}
}, 'calculator.inputDigit')

const inputDot = action(() => {
	if (resetNextAtom()) {
		displayAtom.set('0.')
		resetNextAtom.set(false)
	} else if (!displayAtom().includes('.')) {
		displayAtom.set(displayAtom() + '.')
	}
}, 'calculator.inputDot')

function calculate(left: number, op: string, right: number) {
	switch (op) {
		case '+':
			return left + right
		case '-':
			return left - right
		case '*':
			return left * right
		case '/':
			return right !== 0 ? left / right : null
		default:
			return right
	}
}

const handleOperator = action((nextOp: string) => {
	const current = parseFloat(displayAtom())
	const prev = prevValueAtom()
	const op = operatorAtom()

	if (prev !== null && op) {
		const result = calculate(prev, op, current)
		if (result === null) {
			displayAtom.set('Error')
			prevValueAtom.set(null)
			operatorAtom.set(null)
			resetNextAtom.set(true)
			return
		}
		displayAtom.set(String(result))
		prevValueAtom.set(result)
	} else {
		prevValueAtom.set(current)
	}

	operatorAtom.set(nextOp)
	resetNextAtom.set(true)
}, 'calculator.handleOperator')

const handleEquals = action(() => {
	const prev = prevValueAtom()
	const op = operatorAtom()
	if (prev !== null && op) {
		const result = calculate(prev, op, parseFloat(displayAtom()))
		displayAtom.set(result === null ? 'Error' : String(result))
		prevValueAtom.set(null)
		operatorAtom.set(null)
		resetNextAtom.set(true)
	}
}, 'calculator.handleEquals')

const handleClear = action(() => {
	displayAtom.set('0')
	prevValueAtom.set(null)
	operatorAtom.set(null)
	resetNextAtom.set(false)
}, 'calculator.handleClear')

const handlePercent = action(() => {
	displayAtom.set(String(parseFloat(displayAtom()) / 100))
}, 'calculator.handlePercent')

const handleToggleSign = action(() => {
	displayAtom.set(String(-parseFloat(displayAtom())))
}, 'calculator.handleToggleSign')

const buttonStyle = css({
	h: '14',
	fontSize: 'lg',
	fontWeight: 'medium',
	borderRadius: 'lg',
	cursor: 'pointer',
	border: 'none',
	transition: 'background 0.1s',
})

const digitStyle = css({
	bg: 'gray.3',
	color: 'gray.12',
	_hover: { bg: 'gray.4' },
	_active: { bg: 'gray.5' },
})

const operatorStyle = css({
	bg: 'colorPalette.9',
	color: 'white',
	_hover: { bg: 'colorPalette.10' },
	_active: { bg: 'colorPalette.11' },
})

const functionStyle = css({
	bg: 'gray.5',
	color: 'gray.12',
	_hover: { bg: 'gray.6' },
	_active: { bg: 'gray.7' },
})

export const CalculatorPage = reatomComponent(() => {
	return (
		<styled.div p="8" display="flex" justifyContent="center" alignItems="center" minH="100dvh">
			<styled.div w="320px">
				<VisuallyHidden as="h1">{m.calculator_title()}</VisuallyHidden>

				<styled.div bg="gray.2" borderRadius="xl" p="4" borderWidth="1px" borderColor="gray.4">
					<styled.div
						textAlign="right"
						fontSize="3xl"
						fontWeight="bold"
						fontVariantNumeric="tabular-nums"
						p="3"
						mb="3"
						bg="gray.1"
						borderRadius="lg"
						minH="14"
						display="flex"
						alignItems="center"
						justifyContent="flex-end"
						overflow="hidden"
					>
						<styled.span truncate>{displayAtom()}</styled.span>
					</styled.div>

					<styled.div display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="2">
						<Button
							className={`${buttonStyle} ${functionStyle}`}
							onClick={wrap(() => handleClear())}
						>
							AC
						</Button>
						<Button
							className={`${buttonStyle} ${functionStyle}`}
							onClick={wrap(() => handleToggleSign())}
						>
							+/−
						</Button>
						<Button
							className={`${buttonStyle} ${functionStyle}`}
							onClick={wrap(() => handlePercent())}
						>
							%
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={wrap(() => handleOperator('/'))}
						>
							÷
						</Button>

						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('7'))}
						>
							7
						</Button>
						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('8'))}
						>
							8
						</Button>
						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('9'))}
						>
							9
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={wrap(() => handleOperator('*'))}
						>
							×
						</Button>

						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('4'))}
						>
							4
						</Button>
						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('5'))}
						>
							5
						</Button>
						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('6'))}
						>
							6
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={wrap(() => handleOperator('-'))}
						>
							−
						</Button>

						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('1'))}
						>
							1
						</Button>
						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('2'))}
						>
							2
						</Button>
						<Button
							className={`${buttonStyle} ${digitStyle}`}
							onClick={wrap(() => inputDigit('3'))}
						>
							3
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={wrap(() => handleOperator('+'))}
						>
							+
						</Button>

						<Button
							className={`${buttonStyle} ${digitStyle}`}
							gridColumn="span 2"
							onClick={wrap(() => inputDigit('0'))}
						>
							0
						</Button>
						<Button className={`${buttonStyle} ${digitStyle}`} onClick={wrap(() => inputDot())}>
							.
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={wrap(() => handleEquals())}
						>
							=
						</Button>
					</styled.div>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}, 'CalculatorPage')
