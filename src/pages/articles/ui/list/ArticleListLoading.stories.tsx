import preview from '#.storybook/preview'

import { ArticleListLoading } from './ArticleListLoading'

const meta = preview.meta({
	title: 'Pages/Articles/ArticleListLoading',
	component: ArticleListLoading,
	parameters: { layout: 'padded' },
})

export default meta

export const Default = meta.story({ name: 'Default' })
