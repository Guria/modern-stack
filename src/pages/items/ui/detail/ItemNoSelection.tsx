import { Package } from 'lucide-react'

import { m } from '#paraglide/messages.js'
import { NoSelectionState } from '#widgets/data-page'

export function ItemNoSelection() {
	return (
		<NoSelectionState
			icon={Package}
			title={m.item_no_selection()}
			description={m.item_no_selection_desc()}
		/>
	)
}
