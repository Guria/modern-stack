import type { ReactElement } from 'react'

import { retryComputed, wrap } from '@reatom/core'

import { fetchArticles, fetchArticleById } from '#entities/article'
import { m } from '#paraglide/messages.js'
import { getFirstOutletChild, rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'

import { ArticleDetail } from '../ui/ArticleDetail'
import { ArticleDetailLoadingState } from '../ui/ArticleDetailLoadingState'
import { ArticleNoSelection } from '../ui/ArticleNoSelection'
import { ArticleNotFound } from '../ui/ArticleNotFound'
import { ArticlesPage } from '../ui/ArticlesPage'
import { ArticlesPageLoading } from '../ui/ArticlesPageLoading'

export const articlesRoute = rootRoute.reatomRoute(
	{
		path: 'articles',
		loader: fetchArticles,
		render: (self): ReactElement => {
			const selectedArticleId = articleDetailRoute()?.articleId
			const loaderStatus = self.loader.status()
			const articles = self.loader.data()
			if (loaderStatus.isFirstPending || (loaderStatus.isPending && articles == null)) {
				return <ArticlesPageLoading showDetail={selectedArticleId !== undefined} />
			}

			if (articles == null) {
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
					detail={getFirstOutletChild(self, <ArticleNoSelection />)}
				/>
			)
		},
	},
	'articles',
)

export const articleDetailRoute = articlesRoute.reatomRoute(
	{
		path: ':articleId',
		loader: ({ articleId }) => fetchArticleById(articleId),
		render: (self) => {
			const isLoadingArticle = self.loader.pending() > 0
			if (isLoadingArticle) {
				return <ArticleDetailLoadingState />
			}

			const article = self.loader.data()
			return article ? (
				<ArticleDetail article={article} />
			) : (
				<ArticleNotFound articleId={self().articleId} />
			)
		},
	},
	'articleDetail',
)
