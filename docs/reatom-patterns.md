# Reatom Patterns

## Atoms and Actions

### Inline atom reads — no intermediate variables

Calling an atom is cheap. Do not assign atom reads to variables just to use them once — call the atom directly where the value is needed.

**Avoid:**

```ts
const handlePercent = action(() => {
	const display = displayAtom()
	displayAtom.set(String(parseFloat(display) / 100))
}, 'calculator.handlePercent')
```

**Prefer:**

```ts
const handlePercent = action(() => {
	displayAtom.set(String(parseFloat(displayAtom()) / 100))
}, 'calculator.handlePercent')
```

The exception is when the same atom is read multiple times **and** its value must be consistent across those reads (e.g. you read, mutate, then need the pre-mutation value). In that case a local variable is justified to avoid reading a stale or already-updated value.

### Inline handlers in JSX — no pre-bound variables

Do not pre-bind event handlers to variables in the component body just to pass them as props. Inline `wrap(...)` calls directly in JSX.

**Avoid:**

```tsx
export const CalculatorPage = reatomComponent(() => {
	const handleClearClick = wrap(() => handleClear())
	const handleDigitClick = (digit: string) => wrap(() => inputDigit(digit))

	return <Button onClick={handleClearClick}>AC</Button>
}, 'CalculatorPage')
```

**Prefer:**

```tsx
export const CalculatorPage = reatomComponent(() => {
	return <Button onClick={wrap(() => handleClear())}>AC</Button>
}, 'CalculatorPage')
```

### No atom reads in the component body for display values

Do not read atoms into local variables at the top of the component body. Call atoms directly in JSX.

**Avoid:**

```tsx
export const CalculatorPage = reatomComponent(() => {
	const display = displayAtom()
	return <span>{display}</span>
}, 'CalculatorPage')
```

**Prefer:**

```tsx
export const CalculatorPage = reatomComponent(() => {
	return <span>{displayAtom()}</span>
}, 'CalculatorPage')
```
