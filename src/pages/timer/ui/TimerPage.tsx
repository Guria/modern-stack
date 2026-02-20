import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { Button } from '#shared/components'
import { styled } from '#styled-system/jsx'

import {
	formatTime,
	pauseTimer,
	resetTimer,
	setDuration,
	startTimer,
	timerRemainingAtom,
	timerRunningAtom,
} from '../model/atoms'

const PRESETS = [
	{ label: '10s', seconds: 10 },
	{ label: '1m', seconds: 60 },
	{ label: '5m', seconds: 300 },
	{ label: '10m', seconds: 600 },
	{ label: '25m', seconds: 1500 },
] as const

export const TimerPage = reatomComponent(() => {
	const remaining = timerRemainingAtom()
	const running = timerRunningAtom()

	return (
		<styled.div p="8" display="flex" justifyContent="center" alignItems="center" minH="100dvh">
			<styled.div w="320px" display="flex" flexDirection="column" alignItems="center" gap="6">
				<styled.h1 fontSize="2xl" fontWeight="bold">
					Timer
				</styled.h1>

				<styled.div
					fontSize="6xl"
					fontWeight="bold"
					fontVariantNumeric="tabular-nums"
					lineHeight="1"
				>
					{formatTime(remaining)}
				</styled.div>

				<styled.div display="flex" gap="2">
					{PRESETS.map(({ label, seconds }) => (
						<Button
							key={label}
							variant="outline"
							size="sm"
							disabled={running}
							onClick={wrap(() => setDuration(seconds))}
						>
							{label}
						</Button>
					))}
				</styled.div>

				<styled.div display="flex" gap="2">
					{running ? (
						<Button variant="outline" onClick={wrap(() => pauseTimer())}>
							Pause
						</Button>
					) : (
						<Button onClick={wrap(() => startTimer())} disabled={remaining <= 0}>
							Start
						</Button>
					)}
					<Button variant="outline" onClick={wrap(() => resetTimer())}>
						Reset
					</Button>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}, 'TimerPage')
