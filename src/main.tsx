import './index.css'
import './reatom.init' // import before any other reatom code!
import { assert } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import { createRoot } from 'react-dom/client'

import { App } from '#app/App.tsx'
import { startBrowserMocking } from '#app/mocks/browser'
import { resolvedThemeAtom } from '#shared/model'
import { css } from '#styled-system/css'

import { rootFrame } from './reatom.init'

await startBrowserMocking()

const root = document.getElementById('root')
assert(root, 'Root element not found')
root.classList.add(css({ colorPalette: 'indigo' }))

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
