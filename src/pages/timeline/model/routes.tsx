import { retryComputed, wrap } from '@reatom/core'

import { fetchTimelineEvents } from '#entities/timeline-event'
import { m } from '#paraglide/messages.js'
import { rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'

import { TimelinePage } from '../ui/TimelinePage'
import { TimelinePageLoading } from '../ui/TimelinePageLoading'

export const timelineRoute = rootRoute.reatomRoute(
	{
		path: 'timeline',
		loader: fetchTimelineEvents,
		render: (self) => {
			const loaderStatus = self.loader.status()
			const data = self.loader.data()
			if (loaderStatus.isFirstPending || (loaderStatus.isPending && data == null)) {
				return <TimelinePageLoading />
			}
			if (data == null) {
				return (
					<PageError
						title={m.timeline_error_title()}
						description={m.timeline_error_description()}
						onRetry={wrap(() => retryComputed(self.loader))}
					/>
				)
			}
			return <TimelinePage events={data} />
		},
	},
	'timeline',
)
