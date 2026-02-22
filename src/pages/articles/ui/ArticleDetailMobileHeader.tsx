import { reatomComponent } from '@reatom/react'

import { Skeleton } from '#shared/components'
import { BackButton, MobileHeaderTitle } from '#widgets/layout'

import { articleDetailRoute, articlesRoute } from '../model/routes'

export const ArticleDetailMobileHeader = reatomComponent(() => {
	if (!articleDetailRoute.match()) return null
	const item = articleDetailRoute.loader.data()
	const isLoading = articleDetailRoute.loader.pending() > 0
	return (
		<>
			<BackButton href={articlesRoute.path()} label="Back to articles" />
			{isLoading ? (
				<Skeleton h="5" w="28" borderRadius="sm" />
			) : (
				<MobileHeaderTitle label={item?.title ?? 'Article not found'} />
			)}
		</>
	)
}, 'ArticleDetailMobileHeader')
