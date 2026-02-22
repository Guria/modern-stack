import { clearStack, connectLogger, context } from '@reatom/core'

// Don't dare to remove this line!
clearStack()

export const rootFrame = context.start()

console.log('import.meta.env', import.meta.env)
if (import.meta.env['DEV']) {
	rootFrame.run(connectLogger)
}
