# AGENTS.md

Guidance for coding agents working in this repository.

## Project Snapshot

- Stack: Next.js 14 (App Router), React 18, TypeScript 5.
- Styling/UI: Tailwind CSS, `tailwindcss-animate`, Framer Motion.
- Alias: `@/*` -> `src/*` (from `tsconfig.json`).
- Lint config: `next/core-web-vitals` + `next/typescript`.
- TypeScript is strict, and `reactStrictMode` is enabled.

## Source Layout

- `src/app`: routes, `layout.tsx`, `page.tsx`, `globals.css`.
- `src/components`: section-level components.
- `src/components/ui`: lower-level reusable UI primitives.
- `src/lib/constants`: static content and data arrays.
- `src/lib/utils.ts`: utility helpers (`cn`).
- `src/hooks`: custom hooks.
- `src/services`: browser-side helper services.
- `src/types`: shared interfaces/types.

## Package Manager

- `package-lock.json` and `pnpm-lock.yaml` are both present.
- Default to `npm` unless a user explicitly asks for `pnpm`.

## Build, Lint, Typecheck, and Test Commands

Run from: `E:\( programacion )\( proyectos )\portfolio\rey_portfolio`

### Install

- `npm install`

### Development

- `npm run dev` - start Next.js dev server.

### Production

- `npm run build` - create production build.
- `npm run start` - run production server.

### Lint

- `npm run lint` - run full ESLint checks.
- Single file lint: `npx next lint --file src/app/page.tsx`
- Multiple files: `npx next lint --file src/app/page.tsx --file src/components/hero.tsx`

### Typecheck

- No script exists in `package.json`.
- Run: `npx tsc --noEmit`

### Tests (current state)

- No test framework is configured right now.
- No `test` script exists.
- Single-test execution is not available yet.

### Tests (if introduced later)

- Suggested scripts:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`
  - `"test:one": "vitest run"`
- Suggested single-test command: `npm run test:one -- src/components/hero.test.tsx`

## Workflow Expectations

1. Read nearby files before editing to match local patterns.
2. Keep changes minimal and focused on the request.
3. Run lint and typecheck after non-trivial edits.
4. Verify UI changes in desktop and mobile layouts.
5. Do not introduce new frameworks/tools unless requested.

## Code Style: Imports and Exports

- Prefer `@/` imports for internal modules under `src`.
- Order imports: external packages first, internal modules second.
- Use `import type` for type-only imports when useful.
- Reuse existing barrel exports (`index.ts`) when they are already in place.
- Prefer named exports for reusable components/helpers.

## Code Style: TypeScript

- Keep strict typing; avoid `any` unless unavoidable.
- Define explicit props interfaces/types for public components.
- Keep existing naming conventions for interfaces (for example `IProject`).
- Use unions for constrained values (for example button `type`).
- Avoid non-null assertions (`!`) unless there is a clear guarantee.

## Code Style: React and Next.js

- Follow App Router conventions in `src/app`.
- Add `"use client"` only when hooks or browser APIs are needed.
- Prefer Server Components when possible.
- Keep metadata changes centralized in `src/app/layout.tsx` unless route-specific.
- Use `next/image` with meaningful `alt` text and `next/link` for navigation.

## Naming Conventions

- Components: PascalCase (for example `FloatingNav`).
- Hooks: `useX` camelCase (for example `useOutsideClick`).
- Variables/functions: camelCase.
- Constants arrays/objects: camelCase (for example `navItems`, `projects`).
- File names: usually kebab-case (for example `magic-button.tsx`).
- Avoid broad renames in untouched areas.

## Formatting Conventions

- Follow existing local formatting in each file (semicolon usage is mixed).
- Keep JSX readable; split long class lists/props across lines.
- Keep trailing commas where already used.
- Do not run broad formatting-only churn.
- Preserve existing line ending style per file.

## Styling and UI Conventions

- Tailwind is the primary styling approach.
- Reuse shared utility classes from `src/app/globals.css` when suitable.
- Reuse color tokens from `tailwind.config.ts` (`golden`, `dark`, semantic vars).
- Use `cn` from `src/lib/utils.ts` for class composition.
- Keep animations purposeful and scoped.

## Data, Safety, and Error Handling

- Keep static portfolio content in `src/lib/constants`.
- Prefer typed constants over repeated inline literals.
- Access `window`/`document` only in client-side code.
- Fail gracefully in UI paths; avoid uncaught runtime errors.
- Keep side effects in `useEffect` and clean up listeners/timers.

## Dependency and Performance Notes

- Do not add dependencies unless needed for the requested task.
- Prefer existing libraries before introducing new ones.
- If adding dependencies, explain why and update lockfiles consistently.
- Avoid unnecessary re-renders in animated trees.

## Cursor and Copilot Rules Check

- `.cursor/rules/`: not present.
- `.cursorrules`: not present.
- `.github/copilot-instructions.md`: not present.
- No additional editor-agent policy files were found.

## Git Hygiene

- Do not revert unrelated local changes.
- Keep commits focused when commits are requested.
- Update this file when toolchain or conventions change.
