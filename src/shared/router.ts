import type { RouteChild } from '@reatom/core'

import { reatomRoute } from '@reatom/core'
import { createElement, Fragment } from 'react'

type OutletHost<TChild> = {
	outlet: () => Iterable<TChild | false | null | undefined>
}

export function getFirstOutletChild(
	host: OutletHost<RouteChild>,
	fallback: RouteChild = createElement(Fragment),
): RouteChild {
	for (const child of host.outlet()) {
		if (child) return child
	}
	return fallback
}

// @ts-expect-error - Vite replaces this with the actual value at build time
const base = import.meta.env.BASE_URL?.replace(/^\//, '') ?? ''

export const rootRoute = reatomRoute(
	{ path: base, render: (self) => getFirstOutletChild(self, createElement(Fragment)) },
	'rootRoute',
)
