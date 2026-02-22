import { clearStack, connectLogger, context } from '@reatom/core'

// Don't dare to remove this line!
clearStack()

export const rootFrame = context.start()

if (import.meta.env['VITE_CONNECT_LOGGER']) {
	rootFrame.run(connectLogger)
}
