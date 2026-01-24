# modern-stack

A modern React application demonstrating best practices with Bun, React 19, Reatom state management, Panda CSS styling, and Storybook with Vitest integration.

## Stack

- Runtime: Bun
- Framework: React 19
- State Management: Reatom
- Styling: Panda CSS
- UI Development: Storybook with Vitest integration
- Testing: Vitest with Playwright for browser testing
- Code Quality: oxfmt (formatter), oxlint (linter), TypeScript
- Git Hooks: Lefthook for pre-commit checks

## Setup

Install dependencies:

```bash
bun install
```

Run the prepare script to generate Panda CSS artifacts and install git hooks:

```bash
bun run prepare
```

This will:

- Generate Panda CSS styled-system
- Install Lefthook git hooks for pre-commit checks

## Development

Run the development server:

```bash
bun run dev
```

Run Storybook for component development:

```bash
bun run storybook
```

Build Storybook for deployment:

```bash
bun run build-storybook
```

## Testing

Run tests in watch mode:

```bash
bun run test
```

Run tests once:

```bash
bun run test:run
```

## Code Quality

Format code:

```bash
bun run format
```

Check formatting without modifications:

```bash
bun run format:check
```

Lint code:

```bash
bun run lint
```

Type check:

```bash
bun run typecheck
```

## Git Hooks

Pre-commit hooks automatically run:

- Formatting with auto-fix on staged files
- Linting on staged files
- Type checking on entire project

Configuration in lefthook.yml.

This project was created using Bun. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
