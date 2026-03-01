import { reatomComponent } from '@reatom/react'

import { m } from '#paraglide/messages.js'
import { Breadcrumb, Skeleton } from '#shared/components'

import { articleDetailRoute, articlesRoute } from '../model/routes'

export const ArticleDetailBreadcrumbs = reatomComponent(() => {
	const article = articleDetailRoute.loader.data()
	const isLoading = articleDetailRoute.loader.pending() > 0
	return (
		<Breadcrumb.Root size="sm">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href={articlesRoute.path()} color="fg.muted">
						{m.nav_articles()}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item aria-current="page" fontWeight="semibold" color="fg.default">
					{isLoading ? (
						<Skeleton h="4" w="20" borderRadius="sm" />
					) : (
						(article?.title ?? m.article_not_found())
					)}
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	)
}, 'ArticleDetailBreadcrumbs')
