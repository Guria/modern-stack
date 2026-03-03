import { abortVar, effect, retryComputed, wrap } from '@reatom/core'

import { fetchArticles, fetchArticleById } from '#entities/article'
import { m } from '#paraglide/messages.js'
import { setBreadcrumb } from '#shared/model'
import { rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'

import { ArticlesPage } from '../ui/ArticlesPage'
import { ArticlesPageLoading } from '../ui/ArticlesPageLoading'
import { ArticleDetail } from '../ui/detail/ArticleDetail'
import { ArticleDetailLoadingState } from '../ui/detail/ArticleDetailLoadingState'
import { ArticleNoSelection } from '../ui/detail/ArticleNoSelection'
import { ArticleNotFound } from '../ui/detail/ArticleNotFound'

export const articlesRoute = rootRoute.reatomRoute(
	{
		path: 'articles',
		loader: () => {
			effect(() => {
				const dispose = setBreadcrumb(1, {
					label: () => m.nav_articles(),
					href: articlesRoute.path(),
					backLabel: () => m.article_back_to_articles(),
				})
				abortVar.subscribe(dispose)
			})
			return fetchArticles()
		},
		render: (self) => {
			const selectedArticleId = articleDetailRoute()?.articleId
			const { isFirstPending, isPending, data: articles } = self.loader.status()
			if (isFirstPending || (isPending && !articles)) {
				return <ArticlesPageLoading showDetail={selectedArticleId !== undefined} />
			}

			if (!articles) {
				return (
					<PageError
						title={m.articles_error_title()}
						description={m.articles_error_description()}
						onRetry={wrap(() => retryComputed(self.loader))}
					/>
				)
			}

			return (
				<ArticlesPage
					articles={articles}
					selectedArticleId={selectedArticleId}
					getArticleHref={(articleId: string) => articleDetailRoute.path({ articleId })}
					detail={self.outlet().at(0) ?? <ArticleNoSelection />}
				/>
			)
		},
	},
	'articles',
)

export const articleDetailRoute = articlesRoute.reatomRoute(
	{
		path: ':articleId',
		loader: ({ articleId }) => {
			effect(() => {
				const dispose = setBreadcrumb(2, {
					label: () => articleDetailRoute.loader.data()?.title ?? m.article_not_found(),
					isLoading: () => articleDetailRoute.loader.pending() > 0,
				})
				abortVar.subscribe(dispose)
			})
			return fetchArticleById(articleId)
		},
		render: (self) => {
			const { isPending, data: article } = self.loader.status()
			if (isPending) return <ArticleDetailLoadingState />
			return article ? (
				<ArticleDetail article={article} />
			) : (
				<ArticleNotFound articleId={self().articleId} />
			)
		},
	},
	'articleDetail',
)
