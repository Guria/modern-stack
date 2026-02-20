import './index.css'
import './reatom.init'
import { assert, connectLogger, context } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import { createRoot } from 'react-dom/client'

import { App } from '#app/App.tsx'
import { startBrowserMocking } from '#app/mocks/browser'
import { resolvedThemeAtom } from '#shared/model/theme'
import { css } from '#styled-system/css'

await startBrowserMocking()

const root = document.getElementById('root')
assert(root, 'Root element not found')
root.classList.add(css({ colorPalette: 'indigo' }))

const rootFrame = context.start()
if (import.meta.env['DEV']) {
	rootFrame.run(connectLogger)
}

rootFrame.run(() => {
	resolvedThemeAtom.subscribe((theme) => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
	})
})

createRoot(root).render(
	<reatomContext.Provider value={rootFrame}>
		<App />
	</reatomContext.Provider>,
)
