# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router personal website for `0xthomas.dev`.

- `app/` contains route files, global styles, metadata, and the homepage.
- `components/` contains reusable UI and layout components.
- `components/ui/` contains small design-system primitives such as buttons and cards.
- `lib/content.ts` stores site copy and structured content for projects, notes, principles, and contact links.
- `public/` stores static assets such as `mark.svg` and `og.svg`.

Keep future pages such as `app/projects/page.tsx`, `app/notes/page.tsx`, and `app/research/page.tsx` thin. Put reusable display logic in `components/` and shared content or config in `lib/`.

## Build, Test, and Development Commands

- `npm install` installs dependencies.
- `npm run dev` starts the local Next.js dev server.
- `npm run build` creates a production build and validates App Router output.
- `npm run start` serves the production build after `npm run build`.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm audit` checks dependency advisories.

Use package scripts instead of ad hoc Next.js commands when possible.

## Coding Style & Naming Conventions

Use TypeScript, React Server Components by default, and Tailwind CSS utilities for styling. Prefer two-space indentation, `camelCase` for variables and functions, and `PascalCase` for components. Name component files descriptively, for example `site-header.tsx`, `hero-system-map.tsx`, or `button-link.tsx`.

Design tokens live in `app/globals.css` through Tailwind v4 `@theme` variables. Reuse existing colors, spacing, radius, and typography before introducing new styles.

## Testing Guidelines

No unit test framework is configured yet. For now, verify changes with:

- `npm run typecheck`
- `npm run build`
- Browser checks at desktop, tablet, and mobile widths

When tests are added, colocate component tests as `*.test.tsx` or place broader integration tests under `tests/`.

## Commit & Pull Request Guidelines

No Git history is available in this directory, so no existing convention can be inferred. Use concise imperative commit messages such as `Add homepage MVP` or `Refine project card layout`.

Pull requests should include a summary, verification steps, screenshots for visible UI changes, and notes for any intentional placeholder links or content.

## Security & Configuration Tips

Do not commit secrets, private tokens, or local environment files. Use `.env.local` for machine-specific values and add `.env.example` once environment variables are required.
