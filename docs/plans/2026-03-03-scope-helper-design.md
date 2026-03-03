# Design: `I.scope()` for Scoped Assertions

## Overview

The `scope` method on the actor allows you to scope multiple assertions to a parent element without capturing intermediate variables or chaining `.within()` on every locator.

This improves test readability by reducing repetition and eliminating intermediate variable capture when asserting on multiple elements within a parent container.

## API Overview

**Signature:**
```typescript
I.scope(locator: DefiniteLocator, callback: () => Promise<void>): Promise<void>
```

**Before:**
```typescript
const detail = await I.see(role('main'))
await I.see(heading('Quarterly report').wait().within(detail))
await I.see(text(/Regional performance/).within(detail))
await I.see(text(/EMEA showed stable retention/).within(detail))
```

**After:**
```typescript
await I.scope(role('main'), async () => {
    await I.see(heading('Quarterly report').wait())
    await I.see(text(/Regional performance/))
    await I.see(text(/EMEA showed stable retention/))
})
```

**Explicit wait when needed:**

If the scope element needs to be awaited, add `.wait()` explicitly:

```typescript
await I.scope(role('dialog').wait(), async () => {
    await I.see(heading('Confirm'))
    await I.click(button('OK'))
})
```

## Implementation Details

### How it works

1. The `scope` method resolves the locator to get the parent HTMLElement
2. It temporarily modifies the actor's context to use this element as the search base
3. All actor methods (`see`, `click`, `fill`, etc.) inside the callback search relative to this element
4. After the callback completes, the original context is restored

### Nested scopes

Nested `scope` calls work relative to the outer scope:

```typescript
await I.scope(role('main'), async () => {
    await I.scope(role('article'), async () => {
        // Searches for role('article') within role('main')
        await I.see(heading('Title'))
    })
})
```

### Context management

The actor maintains a stack of scope elements to support nesting:

```typescript
// Conceptual implementation
const scopeStack: HTMLElement[] = []

function canvasFor(locator: AnyLocator): Canvas {
    const explicitScope = (locator as Refined<AnyLocator>).__within
    if (explicitScope === 'global') return withinElement(ctx().canvasElement.ownerDocument.body)
    if (explicitScope) return withinElement(explicitScope)

    // Check if we're inside a scope() call
    if (scopeStack.length > 0) {
        return withinElement(scopeStack[scopeStack.length - 1])
    }

    return ctx().canvas
}

const scope = async (locator: DefiniteLocator, callback: () => Promise<void>) => {
    const element = await resolveLocator(locator)
    scopeStack.push(element)
    try {
        await callback()
    } finally {
        scopeStack.pop()
    }
}
```

## Edge Cases and Behavior

### Error handling

If the scope locator fails to resolve (element not found), the error propagates immediately before the callback executes:

```typescript
// If role('nonexistent') throws, the callback never runs
await I.scope(role('nonexistent'), async () => {
    await I.see(text('This never executes'))
})
```

### Scope restoration

The scope is restored even if the callback throws an error:

```typescript
try {
    await I.scope(role('main'), async () => {
        await I.see(text('Does not exist')) // throws
    })
} catch (err) {
    // Scope is restored here
    await I.see(heading('Page title')) // searches from root again
}
```

### Interaction with locator `.within()` method

You can still use `.within()` on individual locators inside a scope. The scope element becomes the base for the `.within()` chain:

```typescript
await I.scope(role('main'), async () => {
    const article = await I.see(role('article'))
    await I.see(heading('Title').within(article)) // searches within article, which is within main
})
```

### When to use `scope` vs `.within()`

- Use `scope` when you have **multiple assertions** within the same parent element
- Use `.within()` when you have **one or two** scoped assertions and don't want the extra nesting

## Simplification: Remove `loc()` Function

As part of this change, we'll remove the `loc()` function since the fluent builder API covers all use cases.

### Current usages to update

**TimerPage.stories.tsx:**
```typescript
// Before
const heading = loc((canvas) => canvas.findByRole('heading', { name: 'Timer' }))

// After
const heading = heading('Timer')
```

**CalculatorPage.stories.tsx:**
```typescript
// Before
const display = (value: string) => loc((canvas) => canvas.findByText(value, { selector: 'span' }))

// After
const display = (value: string) => text(value).options({ selector: 'span' })
```

### Removals

- Remove `loc()` function from `src/shared/test/loc.ts`
- Remove `loc` from exports in `src/shared/test/index.ts`
- Update `docs/testing.md` to remove references to `loc()`

### Rationale

The fluent builder API (`role()`, `text()`, `heading()`, etc.) with `.options()`, `.wait()`, `.maybe()`, and `.within()` provides all the functionality of `loc()` with better discoverability and type safety.
