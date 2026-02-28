import { heading, link, loc, text, type BaseActor } from '#shared/test'

export const masterDetailLoc = (entitySingular: string) => ({
	noSelectionMessageAppears: text(`No ${entitySingular} selected`),
	detailRegionAppears: loc((canvas) => canvas.findByRole('main')),
	detailLoading: loc((canvas) =>
		canvas.findByRole('status', { name: `Loading ${entitySingular} detail` }),
	),
	detailHeading: heading,
	maybeDetailHeading: (name: string | RegExp) =>
		loc((canvas) => canvas.queryByRole('heading', { name })),
})

export const masterDetail = (entityPlural: string) => (I: BaseActor) => ({
	goBack: async () => {
		await I.click((canvas) => canvas.findByLabelText(`Back to ${entityPlural}`))
	},
	clickItem: async (name: string | RegExp) => {
		const pattern = typeof name === 'string' ? new RegExp(name, 'i') : name
		await I.click(link(pattern))
	},
	seeDetail: async (name: string | RegExp) => {
		await I.see(heading(name))
	},
})
