import { Plus } from 'lucide-react'

import type { Article } from '#entities/article'

import { m } from '#paraglide/messages.js'
import { IconButton } from '#shared/components'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

import { ArticleListItem } from './ArticleListItem'

type ArticleListProps = {
	articles: Article[]
	selectedId: string | undefined
	getArticleHref: (articleId: string) => string
}

export function ArticleList({ articles, selectedId, getArticleHref }: ArticleListProps) {
	return (
		<>
			<styled.div
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				px="4"
				py="3"
				borderBottomWidth="1px"
				borderColor="gray.4"
			>
				<styled.h3 fontSize="sm" fontWeight="semibold" color="gray.11">
					{m.nav_articles()}
				</styled.h3>
				<IconButton size="xs" variant="plain" aria-label="New article">
					<Plus className={css({ w: '4', h: '4' })} />
				</IconButton>
			</styled.div>
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
