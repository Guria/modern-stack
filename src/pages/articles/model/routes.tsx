import { retryComputed, wrap } from '@reatom/core'

import { fetchArticles, fetchArticleById } from '#entities/article'
import { m } from '#paraglide/messages.js'
import { rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'
import { MasterDetails } from '#widgets/master-details'

import { ArticlesPageLoading } from '../ui/ArticlesPageLoading'
import { ArticleDetail } from '../ui/detail/ArticleDetail'
import { ArticleDetailLoadingState } from '../ui/detail/ArticleDetailLoadingState'
import { ArticleNoSelection } from '../ui/detail/ArticleNoSelection'
import { ArticleNotFound } from '../ui/detail/ArticleNotFound'
import { ArticleList } from '../ui/list/ArticleList'

export const articlesRoute = rootRoute.reatomRoute(
	{
		path: 'articles',
		loader: fetchArticles,
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
				<MasterDetails
					isDetailVisible={selectedArticleId !== undefined}
					master={
						<ArticleList
							articles={articles.map((article) => ({
								article,
								href: articleDetailRoute.path({ articleId: article.id }),
							}))}
							selectedId={selectedArticleId}
						/>
					}
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
		loader: ({ articleId }) => fetchArticleById(articleId),
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
