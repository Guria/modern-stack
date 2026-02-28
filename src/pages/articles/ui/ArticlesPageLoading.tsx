import { MasterDetails } from '#widgets/master-details'

import { ArticleDetailLoadingState } from './ArticleDetailLoadingState'
import { ArticleListLoading } from './components/ArticleListLoading'

type ArticlesPageLoadingProps = {
	showDetail: boolean
}

export function ArticlesPageLoading({ showDetail }: ArticlesPageLoadingProps) {
	return (
		<div role="status" aria-label="Loading articles page">
			<div inert>
				<MasterDetails
					isDetailVisible={showDetail}
					master={<ArticleListLoading />}
					detail={<ArticleDetailLoadingState />}
				/>
			</div>
		</div>
	)
}
