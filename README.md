# BASI Block System — Study App

A personal study tool for learning the BASI Pilates block system and organizing
exercises across apparatuses. See `SPEC.md` for the full product/design spec and
`basi-block-system.jsx` for the design-reference prototype.

## Prerequisites
- **Node.js** (LTS) — check with `node --version`; install from https://nodejs.org if missing
- **Git** — check with `git --version`

## Getting started
This project is built with Vite + React.

```bash
npm install        # install dependencies
npm run dev        # start local dev server (usually http://localhost:5173)
npm run build      # production build into dist/
npm run preview    # preview the production build locally
```

## Project structure (target)
```
src/
  components/      reusable UI (ExerciseCard, Drawer, Wheel, etc.)
  features/        explore/ programs/ practice/
  data/            exercises.json  (the 400+ exercise library)
  lib/             storage.js  (the storage abstraction — localStorage in v1)
  styles/          design tokens (the C palette as CSS variables)
SPEC.md            the build blueprint
CLAUDE.md          project conventions for Claude Code (create this early)
```

## Data
Exercises live in `src/data/exercises.json`, extracted from BASI study materials.
This content is BASI's proprietary material — keep the deployed site private to the
cohort (unlisted URL / eventual auth), not fully public.

## Storage
All user data (notes, favorites, programs) goes through `src/lib/storage.js`.
v1 stores to `localStorage`. Never call `localStorage` directly elsewhere — this
abstraction is what lets us swap in a database later without touching the UI.

## Secrets
v1 has none. When Supabase is added, keys go in `.env.local` (git-ignored) and are
read via Vite's `import.meta.env`. Never commit `.env*` files.

## Deploy
Push to GitHub, then connect the repo to Vercel (free). Every push redeploys.
Share one unlisted URL with the cohort; their notes live in their own browsers.
