import { Plus } from 'lucide-react'

import type { Article } from '#entities/article'

import { m } from '#paraglide/messages.js'
import { IconButton } from '#shared/components'
import { ListToolbar } from '#widgets/data-page'

import { ArticleListItem } from './ArticleListItem'

type ArticleListProps = {
	articles: Article[]
	selectedId: string | undefined
	getArticleHref: (articleId: string) => string
}

export function ArticleList({ articles, selectedId, getArticleHref }: ArticleListProps) {
	return (
		<>
			<ListToolbar placeholder={m.article_search_placeholder()}>
				<IconButton size="sm" variant="outline" aria-label={m.article_new()}>
					<Plus />
				</IconButton>
			</ListToolbar>
			{articles.map((article) => (
				<ArticleListItem
					key={article.id}
					article={article}
					href={getArticleHref(article.id)}
					isSelected={selectedId === article.id}
				/>
			))}
		</>
	)
}
