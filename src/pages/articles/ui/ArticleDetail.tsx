import type { Article } from '#entities/article'

import { m } from '#paraglide/messages.js'
import { Button } from '#shared/components'
import { styled } from '#styled-system/jsx'

import { ArticleStatusBadge } from './components/ArticleStatusBadge'

export function ArticleDetail({ article }: { article: Article }) {
	return (
		<styled.div p="8">
			<styled.div display="flex" alignItems="center" gap="3" mb="6" flexWrap="wrap">
				<styled.h1 fontSize="2xl" fontWeight="bold" flex="1">
					{article.title}
				</styled.h1>
				<ArticleStatusBadge status={article.status} />
				<Button size="sm" variant="outline">
					{m.article_edit()}
				</Button>
			</styled.div>
			<styled.p color="gray.11" fontSize="sm" lineHeight="relaxed">
				{article.description}
			</styled.p>
			<styled.div display="grid" gap="4" mt="6">
				{article.content.map((paragraph, index) => (
					<styled.p key={index} color="gray.11" fontSize="sm" lineHeight="relaxed">
						{paragraph}
					</styled.p>
				))}
			</styled.div>
		</styled.div>
	)
}
