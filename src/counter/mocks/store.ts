export type CounterRecord = {
	id: string
	label: string
	value: number
}

const seedCounters: CounterRecord[] = [
	{ id: 'counter-1', label: 'Main counter', value: 10 },
	{ id: 'counter-2', label: 'Secondary counter', value: 20 },
]

const devSeedCounters: CounterRecord[] = [
	{ id: 'counter-3', label: 'Dev counter #1', value: 100 },
	{ id: 'counter-4', label: 'Dev counter #2', value: -5 },
]

const counterStore = new Map<string, CounterRecord>()

function cloneCounter(counter: CounterRecord): CounterRecord {
	return { ...counter }
}

export function resetCounterStore(): void {
	counterStore.clear()
	for (const counter of seedCounters) {
		counterStore.set(counter.id, cloneCounter(counter))
	}
}

export function seedCounterStore(counters: CounterRecord[]): void {
	for (const counter of counters) {
		counterStore.set(counter.id, cloneCounter(counter))
	}
}

export function seedCounterStoreForDev(): void {
	seedCounterStore(devSeedCounters)
}

export function listCounters(): CounterRecord[] {
	return Array.from(counterStore.values(), cloneCounter)
}

export function getCounter(counterId: string): CounterRecord | null {
	const counter = counterStore.get(counterId)
	return counter ? cloneCounter(counter) : null
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
