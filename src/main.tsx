import './index.css'
import './reatom.init.ts'
import { assert, connectLogger, context } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import { createRoot } from 'react-dom/client'

import { App } from '#app/App.tsx'
import { startBrowserMocking } from '#app/mocks/browser.ts'
import { css } from '#styled-system/css'

const root = document.getElementById('root')
assert(root, 'Root element not found')
root.classList.add(css({ colorPalette: 'orange' }))

const rootFrame = context.start()
if (import.meta.env['DEV']) {
	rootFrame.run(connectLogger)
}

startBrowserMocking().then(() => {
	createRoot(root).render(
		<reatomContext.Provider value={rootFrame}>
			<App />
		</reatomContext.Provider>,
	)
})
