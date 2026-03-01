import { Plus, SlidersHorizontal } from 'lucide-react'

import type { Article } from '#entities/article'

import { m } from '#paraglide/messages.js'
import { Group, IconButton, Input } from '#shared/components'
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
			<styled.div px="3" py="3" borderBottomWidth="1px" borderColor="gray.4">
				<Group attached w="full">
					<Input placeholder={m.article_search_placeholder()} size="sm" flex="1" />
					<IconButton size="sm" variant="outline" aria-label={m.list_filters()}>
						<SlidersHorizontal className={css({ w: '4', h: '4' })} />
					</IconButton>
					<IconButton size="sm" variant="outline" aria-label={m.article_new()}>
						<Plus className={css({ w: '4', h: '4' })} />
					</IconButton>
				</Group>
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
