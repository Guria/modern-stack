import './index.css'
import './reatom.init.ts'
import { assert, connectLogger, context } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import { createRoot } from 'react-dom/client'

import { App } from '#app/App.tsx'

const root = document.getElementById('root')
assert(root, 'Root element not found')

const rootFrame = context.start()
if (import.meta.env['DEV']) {
	rootFrame.run(connectLogger)
}

createRoot(root).render(
	<reatomContext.Provider value={rootFrame}>
		<App />
	</reatomContext.Provider>,
)
