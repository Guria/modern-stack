import { m } from '#paraglide/messages.js'
import { Skeleton } from '#shared/components'
import { styled } from '#styled-system/jsx'

const loadingItems = Array.from({ length: 6 }, (_, index) => index)

export function ArticleListLoading() {
	return (
		<>
			<styled.h3 fontSize="sm" fontWeight="semibold" p="4" color="gray.11">
				{m.nav_articles()}
			</styled.h3>
			{loadingItems.map((item) => (
				<styled.div key={item} px="4" py="3" borderBottomWidth="1px" borderColor="gray.4">
					<styled.div
						display="flex"
						alignItems="center"
						justifyContent="space-between"
						gap="2"
						mb="2"
					>
						<Skeleton h="4" w="70%" />
						<Skeleton h="5" w="20" borderRadius="full" />
					</styled.div>
					<Skeleton h="3.5" w="85%" />
				</styled.div>
			))}
		</>
	)
}
