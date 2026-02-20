import { action, atom, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { Button } from '#shared/components'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

const displayAtom = atom('0', 'calculator.display')
const prevValueAtom = atom<number | null>(null, 'calculator.prevValue')
const operatorAtom = atom<string | null>(null, 'calculator.operator')
const resetNextAtom = atom(false, 'calculator.resetNext')

const inputDigit = action((digit: string) => {
	const display = displayAtom()
	const resetNext = resetNextAtom()
	if (resetNext) {
		displayAtom.set(digit)
		resetNextAtom.set(false)
	} else {
		displayAtom.set(display === '0' ? digit : display + digit)
	}
}, 'calculator.inputDigit')

const inputDot = action(() => {
	const display = displayAtom()
	const resetNext = resetNextAtom()
	if (resetNext) {
		displayAtom.set('0.')
		resetNextAtom.set(false)
	} else if (!display.includes('.')) {
		displayAtom.set(display + '.')
	}
}, 'calculator.inputDot')

function calculate(left: number, op: string, right: number): number {
	switch (op) {
		case '+':
			return left + right
		case '-':
			return left - right
		case '*':
			return left * right
		case '/':
			return right !== 0 ? left / right : 0
		default:
			return right
	}
}

const handleOperator = action((nextOp: string) => {
	const display = displayAtom()
	const prevValue = prevValueAtom()
	const operator = operatorAtom()
	const current = parseFloat(display)

	if (prevValue !== null && operator) {
		const result = calculate(prevValue, operator, current)
		displayAtom.set(String(result))
		prevValueAtom.set(result)
	} else {
		prevValueAtom.set(current)
	}

	operatorAtom.set(nextOp)
	resetNextAtom.set(true)
}, 'calculator.handleOperator')

const handleEquals = action(() => {
	const display = displayAtom()
	const prevValue = prevValueAtom()
	const operator = operatorAtom()
	const current = parseFloat(display)

	if (prevValue !== null && operator) {
		const result = calculate(prevValue, operator, current)
		displayAtom.set(String(result))
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
	const display = displayAtom()
	displayAtom.set(String(parseFloat(display) / 100))
}, 'calculator.handlePercent')

const handleToggleSign = action(() => {
	const display = displayAtom()
	displayAtom.set(String(-parseFloat(display)))
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
	const display = displayAtom()
	const handleClearClick = wrap(() => handleClear())
	const handleToggleSignClick = wrap(() => handleToggleSign())
	const handlePercentClick = wrap(() => handlePercent())
	const handleInputDotClick = wrap(() => inputDot())
	const handleEqualsClick = wrap(() => handleEquals())
	const handleOperatorClick = (operator: string) => wrap(() => handleOperator(operator))
	const handleDigitClick = (digit: string) => wrap(() => inputDigit(digit))

	return (
		<styled.div p="8" display="flex" justifyContent="center" alignItems="center" minH="100dvh">
			<styled.div w="320px">
				<styled.h1 fontSize="2xl" fontWeight="bold" mb="6">
					Calculator
				</styled.h1>

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
						<styled.span truncate>{display}</styled.span>
					</styled.div>

					<styled.div display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="2">
						<Button className={`${buttonStyle} ${functionStyle}`} onClick={handleClearClick}>
							AC
						</Button>
						<Button className={`${buttonStyle} ${functionStyle}`} onClick={handleToggleSignClick}>
							+/−
						</Button>
						<Button className={`${buttonStyle} ${functionStyle}`} onClick={handlePercentClick}>
							%
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={handleOperatorClick('/')}
						>
							÷
						</Button>

						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('7')}>
							7
						</Button>
						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('8')}>
							8
						</Button>
						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('9')}>
							9
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={handleOperatorClick('*')}
						>
							×
						</Button>

						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('4')}>
							4
						</Button>
						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('5')}>
							5
						</Button>
						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('6')}>
							6
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={handleOperatorClick('-')}
						>
							−
						</Button>

						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('1')}>
							1
						</Button>
						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('2')}>
							2
						</Button>
						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleDigitClick('3')}>
							3
						</Button>
						<Button
							className={`${buttonStyle} ${operatorStyle}`}
							onClick={handleOperatorClick('+')}
						>
							+
						</Button>

						<Button
							className={`${buttonStyle} ${digitStyle}`}
							style={{ gridColumn: 'span 2' }}
							onClick={handleDigitClick('0')}
						>
							0
						</Button>
						<Button className={`${buttonStyle} ${digitStyle}`} onClick={handleInputDotClick}>
							.
						</Button>
						<Button className={`${buttonStyle} ${operatorStyle}`} onClick={handleEqualsClick}>
							=
						</Button>
					</styled.div>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}, 'CalculatorPage')
