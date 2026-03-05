import { m } from '#paraglide/messages.js'
import { withMatchHeaderTrail } from '#shared/model'

import { calculatorRoute } from './model/routes'

calculatorRoute.match.extend(withMatchHeaderTrail(1, { label: () => m.nav_calculator() }))

export { calculatorRoute }
export { CalculatorNavItem } from './ui/CalculatorNavItem'
