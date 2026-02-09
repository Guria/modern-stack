import * as counterMockHandlers from '#counter/mocks/handlers.ts'

export const handlers = {
	...counterMockHandlers,
} as const

export const handlersArray = Object.values(handlers)
