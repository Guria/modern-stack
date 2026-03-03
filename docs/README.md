# Documentation Approach

## Goal

Keep docs source-first and easy to scan.

Docs should explain:

- Where the source of truth lives
- Which rules to follow
- Which workflows to run

Docs should avoid duplicating large code blocks that are already clear in source files.

## Standard Structure

Use this structure for new docs and refactors:

1. `Overview`: short problem and scope.
2. `Read Source First`: table of key files and why each one matters.
3. `Rules`: concise policy bullets.
4. `Workflows`: step-by-step tasks for common changes.
5. `Edge Cases`: rare exceptions and anti-patterns.

## Writing Rules

- Prefer file pointers over long snippets.
- Keep snippets short and only for API shape or tricky details.
- If a snippet exceeds ~10 lines, replace it with source references.
- Use exact paths so contributors can open files quickly.
- Keep guidance actionable and tied to existing project conventions.

## Update Policy

When code changes, update docs by:

1. Updating file pointers first.
2. Updating rules second.
3. Adding examples only when source files are not enough.

If a doc drifts from source, source wins. Update the doc to match code.
