# modern-stack

A modern React application demonstrating opinionated setup with Bun, React 19, Reatom state management, Panda CSS styling, and Storybook with Vitest integration.

## Stack

- Package Manager: Bun
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

This will also run `prepare` script:

- Generate Panda CSS styled-system
- Install Lefthook git hooks for pre-commit checks

## Development

Run the development server:

```bash
bun run dev
```

## Live

- [App](https://guria.github.io/modern-stack/)
- [Storybook](https://guria.github.io/modern-stack/storybook/)

## Validation loop

- `mise run validate`

## Git Hooks

Pre-commit hooks automatically run:

- Formatting with auto-fix on staged files
- Linting on staged files
- Type checking on entire project

Configuration in lefthook.yml.

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

### Test Workflow

Runs on every push and pull request to main:

- Type checking with TypeScript
- Code formatting validation with oxfmt
- Linting with oxlint
- Storybook component tests with Vitest and Playwright
- Coverage report generation and upload
- Coverage summary in GitHub Actions output

Configuration: .github/workflows/test.yml

### Deployment Workflow

Automatically deploys to GitHub Pages on push to main:

- Builds the React application
- Builds Storybook documentation
- Combines both into a single deployment (app at root, Storybook at /storybook)
- Deploys to GitHub Pages with proper permissions and concurrency controls

Configuration: .github/workflows/deploy.yml
