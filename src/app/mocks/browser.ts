export async function startBrowserMocking(): Promise<void> {
	if (!import.meta.env['VITE_ENABLE_MSW']) {
		return
	}

	const { resetMockStores } = await import('#shared/mocks/stores.ts')
	resetMockStores()

	const { handlersArray } = await import('./handlers.ts')

	const { setupWorker } = await import('msw/browser')
	const worker = setupWorker(...handlersArray)

	await worker.start({
		onUnhandledRequest: import.meta.env['PROD'] ? 'bypass' : 'warn',
		serviceWorker: {
			url: `${import.meta.env['BASE_URL']}mockServiceWorker.js`,
		},
	})
}
