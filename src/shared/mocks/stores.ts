import { resetCounterStore, seedCounterStoreForDev } from '#counter/mocks/store.ts'

export function resetMockStores(): void {
	resetCounterStore()
}

export function seedMockStoresForDev(): void {
	seedCounterStoreForDev()
}
