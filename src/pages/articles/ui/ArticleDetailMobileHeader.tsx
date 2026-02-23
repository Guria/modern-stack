import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Skeleton } from '#shared/components'
import { BackButton, MobileHeaderTitle } from '#widgets/layout'

import { articleDetailRoute, articlesRoute } from '../model/routes'

export const ArticleDetailMobileHeader = reatomComponent(() => {
	if (!articleDetailRoute.match()) return null
	const item = articleDetailRoute.loader.data()
	const isLoading = articleDetailRoute.loader.pending() > 0
	return (
		<>
			<BackButton href={articlesRoute.path()} label={m.article_back_to_articles()} />
			{isLoading ? (
				<Skeleton h="5" w="28" borderRadius="sm" />
			) : (
				<MobileHeaderTitle label={item?.title ?? m.article_not_found()} />
			)}
		</>
	)
}, 'ArticleDetailMobileHeader')
