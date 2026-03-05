import { reatomComponent } from '@reatom/react'
import { type ReactNode } from 'react'

import { MasterDetails } from '#widgets/master-details'

import { ArticleList, type ArticleListRow } from './list/ArticleList'

type Props = {
	articles: ArticleListRow[]
	selectedArticleId: string | undefined
	detail: ReactNode
}

export const ArticlesPage = reatomComponent(
	({ articles, selectedArticleId, detail }: Props) => (
		<MasterDetails
			isDetailVisible={selectedArticleId !== undefined}
			master={<ArticleList articles={articles} selectedId={selectedArticleId} />}
			detail={detail}
		/>
	),
	'ArticlesPage',
)
