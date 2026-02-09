export type CounterRecord = {
	id: string
	label: string
	value: number
}

const seedCounters: CounterRecord[] = [
	{ id: 'counter-1', label: 'Main counter', value: 10 },
	{ id: 'counter-2', label: 'Secondary counter', value: 20 },
]

const counterStore = new Map<string, CounterRecord>()
let nextCounterNumber = 1

function cloneCounter(counter: CounterRecord): CounterRecord {
	return { ...counter }
}

function updateNextCounterNumber(counterId: string): void {
	const counterNumber = Number.parseInt(counterId.replace('counter-', ''), 10)
	if (Number.isNaN(counterNumber)) {
		return
	}
	nextCounterNumber = Math.max(nextCounterNumber, counterNumber + 1)
}

export function resetCounterStore(): void {
	counterStore.clear()
	nextCounterNumber = 1
	seedCounterStore(seedCounters)
}

export function seedCounterStore(counters: CounterRecord[]): void {
	for (const counter of counters) {
		counterStore.set(counter.id, cloneCounter(counter))
		updateNextCounterNumber(counter.id)
	}
}

export function listCounters(): CounterRecord[] {
	return Array.from(counterStore.values(), cloneCounter)
}

export function getCounter(counterId: string): CounterRecord | null {
	const counter = counterStore.get(counterId)
	return counter ? cloneCounter(counter) : null
}

export function createCounter(input: { label: string; value: number }): CounterRecord {
	const counter: CounterRecord = {
		id: `counter-${nextCounterNumber}`,
		label: input.label,
		value: input.value,
	}
	nextCounterNumber += 1
	counterStore.set(counter.id, counter)
	return cloneCounter(counter)
}

export function updateCounterValue(counterId: string, value: number): CounterRecord | null {
	const counter = counterStore.get(counterId)
	if (!counter) {
		return null
	}

	const updatedCounter: CounterRecord = { ...counter, value }
	counterStore.set(counterId, updatedCounter)
	return cloneCounter(updatedCounter)
}

export function deleteCounter(counterId: string): boolean {
	return counterStore.delete(counterId)
}
