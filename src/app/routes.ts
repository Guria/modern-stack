import {
	action,
	assert,
	atom,
	reatomField,
	reatomForm,
	reatomNumber,
	reatomRoute,
	withAsyncData,
	withChangeHook,
	wrap,
} from '@reatom/core'

import {
	createCounter,
	deleteCounter,
	getCounters,
	type CounterEntity,
	updateCounterValue,
} from '#counter/api'

type CounterItem = {
	id: string
	label: string
	countAtom: ReturnType<typeof reatomNumber>
}

export const rootRoute = reatomRoute(
	{
		path: '',
		loader: async () => {
			const counters = await wrap(getCounters())
			let nextCounterAtomNumber = 1

			const toCounterItem = (counter: CounterEntity): CounterItem => {
				const counterAtomName = `counter${nextCounterAtomNumber}`
				nextCounterAtomNumber += 1
				return {
					id: counter.id,
					label: counter.label,
					countAtom: reatomNumber(counter.value, counterAtomName).extend(
						withChangeHook((newValue) => {
							void wrap(updateCounterValue(counter.id, newValue)).catch(() => undefined)
						}),
					),
				}
			}

			const countersAtom = atom(counters.map(toCounterItem), 'rootRoute.counters')

			const createCounterForm = reatomForm(
				(formName: string) => ({
					name: reatomField('', {
						name: `${formName}.name`,
						validate: ({ state }) =>
							state.trim().length > 0 ? undefined : 'Counter name is required.',
					}),
					initialValue: reatomField('0', {
						name: `${formName}.initialValue`,
						validate: ({ state }) => {
							if (state.trim().length === 0) {
								return 'Initial value is required.'
							}
							return Number.isFinite(Number(state)) ? undefined : 'Initial value must be a number.'
						},
					}),
				}),
				{
					name: 'rootRoute.createCounterForm',
					validateOnBlur: true,
					keepErrorOnChange: false,
				},
			)

			const submitCreateCounter = action(async () => {
				const { name, initialValue } = await wrap(createCounterForm.validation.trigger())
				const createdCounter = await wrap(
					createCounter({ label: name.trim(), value: Number(initialValue) }),
				)
				countersAtom.set([...countersAtom(), toCounterItem(createdCounter)])
				createCounterForm.reset()
				return createdCounter
			}, 'rootRoute.createCounterForm.submit').extend(withAsyncData({ resetError: 'onFulfill' }))

			const submitCreateCounterForm = action((event?: { preventDefault: () => void }) => {
				event?.preventDefault()
				void wrap(submitCreateCounter)().catch(() => undefined)
			}, 'rootRoute.createCounterForm.handleSubmit')

			createCounterForm.extend(withChangeHook(() => submitCreateCounter.error.set(undefined)))

			const deleteCounterAction = action(async (counterId: string) => {
				const existingCounter = countersAtom().find((counter) => counter.id === counterId)
				assert(existingCounter, `Counter "${counterId}" was not found.`)
				await wrap(deleteCounter(counterId))
				countersAtom.set(countersAtom().filter((counter) => counter.id !== counterId))
			}, 'rootRoute.deleteCounter')

			return {
				counters: countersAtom,
				createCounterForm,
				submitCreateCounter,
				submitCreateCounterForm,
				deleteCounter: deleteCounterAction,
			}
		},
	},
	'rootRoute',
)
