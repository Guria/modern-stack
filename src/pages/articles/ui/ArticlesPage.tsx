import { reatomComponent } from '@reatom/react'
import { type ReactNode } from 'react'

import type { Article } from '#entities/article'

import { MasterDetails } from '#widgets/master-details'

import { ArticleList } from './components/ArticleList'

type ArticlesPageProps = {
	articles: Article[]
	selectedArticleId: string | undefined
	getArticleHref: (articleId: string) => string
	detail: ReactNode
}

export const ArticlesPage = reatomComponent(function ArticlesPage({
	articles,
	selectedArticleId,
	getArticleHref,
	detail,
}: ArticlesPageProps) {
	const hasDetail = selectedArticleId !== undefined

	return (
		<MasterDetails
			isDetailVisible={hasDetail}
			master={
				<ArticleList
					articles={articles}
					selectedId={selectedArticleId}
					getArticleHref={getArticleHref}
				/>
			}
			detail={detail}
		/>
	)
})
