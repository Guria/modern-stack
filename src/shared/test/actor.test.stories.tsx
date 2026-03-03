import preview from '#.storybook/preview'

import { createActor, heading, role, text } from '.'

const TestComponent = () => (
	<div>
		<h1>Page Title</h1>
		<main role="main">
			<h2>Section Heading</h2>
			<p>Section content</p>
			<article>
				<h3>Article Heading</h3>
				<p>Article content</p>
			</article>
		</main>
	</div>
)

const I = createActor()

const meta = preview.meta({
	title: 'Testing/Actor',
	component: TestComponent,
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const ScopeBasic = meta.story({ name: 'scope() basic usage' })

ScopeBasic.test('finds elements within scoped parent', async () => {
	// Without scope - searches from document root
	await I.see(heading('Page Title').wait())

	// With scope - searches within main element
	await I.scope(role('main'), async () => {
		await I.see(heading('Section Heading'))
		await I.see(text('Section content'))
	})

	// After scope - searches from root again
	await I.see(heading('Page Title'))
})
