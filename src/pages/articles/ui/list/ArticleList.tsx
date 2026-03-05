import { Plus } from 'lucide-react'

import type { Article } from '#entities/article'
import { m } from '#paraglide/messages.js'
import { IconButton } from '#shared/components'
import { ListToolbar } from '#widgets/data-page'

import { ArticleListItem } from './ArticleListItem'

export type ArticleListRow = {
	article: Article
	href: string
}

type Props = {
	articles: ArticleListRow[]
	selectedId: string | undefined
}

export function ArticleList({ articles, selectedId }: Props) {
	return (
		<>
			<ListToolbar placeholder={m.article_search_placeholder()}>
				<IconButton size="sm" variant="outline" aria-label={m.article_new()}>
					<Plus />
				</IconButton>
			</ListToolbar>
			{articles.map(({ article, href }) => (
				<ArticleListItem
					key={article.id}
					article={article}
					href={href}
					isSelected={selectedId === article.id}
				/>
			))}
		</>
	)
}
