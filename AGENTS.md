# Repository Guidelines

## Project Structure & Module Organization

`svg-eslint-parser` is a TypeScript ESM package that converts SVG/XML into an ESLint-compatible AST.

- `src/tokenizer/` reads source text; `src/constructor/` builds the tree; `src/parser/` validates documents and integrates with ESLint.
- `src/types/`, `src/constants/`, and `src/utils/` contain shared definitions and AST utilities. Public exports live in `src/index.ts`.
- `tests/` contains unit and ESLint integration tests; `tests/parse/` covers SVG/XML syntax and recovery behavior.
- `docs/` contains VitePress documentation, Vue playground components in `.vitepress/`, and static assets in `public/`.
- `dist/` is generated package output; do not edit it manually.

## Build, Test, and Development Commands

Use the pnpm version pinned in `package.json` and a current Node.js LTS release.

- `pnpm install --frozen-lockfile`: install workspace dependencies reproducibly.
- `pnpm build`: bundle the package and generate declarations with tsdown.
- `pnpm dev`: rebuild the package when source files change.
- `pnpm test`: run Vitest once; watch mode is disabled by default.
- `pnpm test tests/parse/strict-mode.test.ts`: run a focused test file.
- `pnpm test:coverage`: collect V8 coverage with text and HTML reports.
- `pnpm lint` and `pnpm typecheck`: check lint rules and TypeScript types.
- `pnpm format` / `pnpm format:check`: apply or verify Oxfmt formatting.
- `pnpm docs:dev` / `pnpm docs:build`: serve or build the documentation; build the package first.

## Coding Style & Naming Conventions

Use two-space indentation, LF endings, single quotes, no semicolons, and trailing commas. Oxfmt targets an 80-column width; ESLint uses `@ntnyq/eslint-config`. Keep TypeScript strict and use explicit type-only imports. Follow existing camelCase source filenames and functions, such as `parseForESLint.ts`, and PascalCase type names. Husky runs nano-staged formatting and lint fixes before commits.

## Testing Guidelines

Name tests `*.test.ts` and use Vitest's `describe`, `it`, and `expect`. Add regression cases for parser changes, including invalid input, recovery behavior, and source locations where relevant. Test ESLint-facing changes in `tests/eslint-integration.test.ts`. Coverage includes `src/**/*.ts`; no numeric threshold is configured.

## Commit & Pull Request Guidelines

Follow the history's Conventional Commit style: `fix(types): narrow AST node search results`, `refactor: remove runtime dependencies`, or `docs: finalize parser release guidance`. Keep commits focused. In PRs, explain the behavior change, link relevant issues, and report validation commands. Update documentation for public API changes; include screenshots for playground UI changes. Before submitting, run formatting checks, lint, typechecking, build, and tests to match CI.
