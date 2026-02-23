import { wrap } from '@reatom/core'
import { reatomComponent, useAtom } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Button, Input } from '#shared/components'
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

	const [customInput, setCustomInput] = useAtom('')

	const handleCustomTimeCommit = wrap(() => {
		const parts = customInput.split(':')
		const minutes = parseInt(parts[0] ?? '0', 10)
		const seconds = parseInt(parts[1] ?? '0', 10)
		if (!isNaN(minutes) && !isNaN(seconds) && (minutes > 0 || seconds > 0)) {
			setDuration(minutes * 60 + seconds)
		}
		setCustomInput('')
	})

	return (
		<styled.div p="8" display="flex" justifyContent="center" alignItems="center" minH="100dvh">
			<styled.div w="320px" display="flex" flexDirection="column" alignItems="center" gap="6">
				<styled.h1 fontSize="2xl" fontWeight="bold">
					{m.nav_timer()}
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

				<Input
					placeholder="MM:SS"
					size="sm"
					w="20"
					value={customInput}
					disabled={running}
					onChange={(e) => setCustomInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleCustomTimeCommit()
					}}
					onBlur={handleCustomTimeCommit}
				/>

				<styled.div display="flex" gap="2">
					{running ? (
						<Button variant="outline" onClick={wrap(() => pauseTimer())}>
							{m.timer_pause()}
						</Button>
					) : (
						<Button onClick={wrap(() => startTimer())} disabled={remaining <= 0}>
							{m.timer_start()}
						</Button>
					)}
					<Button variant="outline" onClick={wrap(() => resetTimer())}>
						{m.timer_reset()}
					</Button>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}, 'TimerPage')
