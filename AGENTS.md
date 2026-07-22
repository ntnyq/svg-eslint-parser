# Repository Guidelines

## Project Structure & Module Organization

The public package entry is `src/index.ts`. Parsing flows through `src/tokenizer/` (source to tokens), `src/constructor/` (tokens to AST), and `src/parser/` (public and ESLint-facing APIs). Shared AST definitions live in `src/types/`; constants and reusable AST helpers belong in `src/constants/` and `src/utils/`. Tests are in `tests/`, with parser scenarios grouped under `tests/parse/`. The `docs/` pnpm workspace contains the VitePress site and playground; static files belong in `docs/public/`. Do not edit generated `dist/` output or `docs/components.d.ts` manually.

## Build, Test, and Development Commands

Use the pinned pnpm version from `package.json`.

- `pnpm install --frozen-lockfile`: install workspace dependencies exactly as locked.
- `pnpm dev`: rebuild the library in watch mode.
- `pnpm build`: create ESM JavaScript and declarations in `dist/` with tsdown.
- `pnpm test`: run the Vitest suite once.
- `pnpm test:coverage`: generate text and HTML V8 coverage reports.
- `pnpm run release:check`: run formatting, lint, type checking, and tests together.
- `pnpm docs:dev` / `pnpm docs:build`: serve or validate the documentation site.

## Coding Style & Naming Conventions

Use strict TypeScript, ESM imports, two-space indentation, LF endings, single quotes, and the repository's semicolon-free style. oxfmt owns formatting (`pnpm format`); ESLint enforces code quality (`pnpm lint`). Use camelCase for functions and implementation files such as `parseForESLint.ts`, PascalCase for exported types, and descriptive plural directory names. Keep the public API explicit in `src/index.ts`; avoid exporting implementation-only helpers.

## Testing Guidelines

Write Vitest tests as `*.test.ts`, colocated by feature under `tests/`. Add a focused regression test for every parser bug and cover valid input, malformed input, diagnostics, and source ranges when relevant. Coverage has no configured threshold, but new behavior should not reduce meaningful branch coverage. CI builds and tests on Node 22, 24, and 26 across Linux, Windows, and macOS.

## Commit & Pull Request Guidelines

Follow the existing Conventional Commit style: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, or `chore:`; optional scopes are welcome, and breaking changes use `feat!:`. Keep commits focused and imperative. Pull requests should explain the behavior change, link relevant issues, list verification commands, and update `docs/api/` or `docs/guide/` for public API changes. Include screenshots only for visible docs or playground changes, and ensure CI passes before requesting review.
