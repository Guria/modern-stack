import { reatomComponent } from '@reatom/react'
import { type ReactNode } from 'react'

import type { Article } from '#entities/article'

import { MasterDetails } from '#widgets/master-details'

import { ArticleList } from './list/ArticleList'

type ArticlesPageProps = {
	articles: Article[]
	selectedArticleId: string | undefined
	getArticleHref: (articleId: string) => string
	detail: ReactNode
}

export const ArticlesPage = reatomComponent(
	({ articles, selectedArticleId, getArticleHref, detail }: ArticlesPageProps) => (
		<MasterDetails
			isDetailVisible={selectedArticleId !== undefined}
			master={
				<ArticleList
					articles={articles}
					selectedId={selectedArticleId}
					getArticleHref={getArticleHref}
				/>
			}
			detail={detail}
		/>
	),
	'ArticlesPage',
)
