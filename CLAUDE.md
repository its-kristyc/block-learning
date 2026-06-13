# BASI Block System — Claude Code Conventions

## Stack
- Vite + React 18, deployed static (Vercel)
- No TypeScript, no CSS modules — inline styles with design tokens
- All user data through `src/lib/storage.js` (never call `localStorage` directly)

## Design tokens
Hex values live in `src/styles/tokens.js` → `C` object. CSS custom properties mirror them in `src/styles/tokens.css`. Use `C.xxx` in inline styles and SVG `style` props.

## Project structure
```
src/
  components/   shared UI (Wheel, ExerciseCard, Drawer, …)
  features/     explore/  programs/  practice/
  data/         exercises.json + constants.js + index.js
  lib/          storage.js
  styles/       tokens.js  tokens.css  global.css
  hooks/        useViewport.js
```

## Code conventions
- Component files use named exports (not default)
- App.jsx is the only default export (entry point)
- No TypeScript; prop types via comments if needed
- Inline styles for everything; global.css handles reset, animations, and hover classes
- Hover states (`.exCard:hover`, `.progRow:hover`, `.wedge:hover path`) are in global.css

## Data
- `src/data/exercises.json` — 48 seed exercises (BASI proprietary, keep unlisted)
- Schema: id, name, block(1–12), apparatus, collection({name,kind}|null), level, image, setup, resistance, exhale, inhale, muscleFocus[], objectives[], cues[]
- `APPARATUS_ORDER` in constants.js defines canonical display order
- `byId`, `applyFilters`, `apparatusRank` exported from `src/data/index.js`

## Storage layer (src/lib/storage.js)
- `storage.load()` → Promise<UserData|null>
- `storage.save(data)` → void
- `emptyUser` = `{ notes: {}, favorites: [], programs: [] }`
- Autosave for notes/favorites; explicit Save for programs (draft model)

## Build order (spec §10)
1. ✅ Explore tab (wheel + panel + drawer)
2. Programs tab (list → class flow → editor with dnd-kit)
3. Practice tab (flashcard session)
4. Real exercise data extraction (400+ from BASI PDFs)
5. Polish items (see SPEC.md §8): icon library, wheel label wrapping, dnd-kit

## Known open items (from SPEC.md §8)
- Replace inline SVGs with a single icon library (lucide-react)
- Fix wheel wedge label wrapping for long names against live render
- Replace hand-rolled drag with dnd-kit (Programs editor)
- Add `beforeunload` guard in Programs editor
- Revisit collection grouping left-indent / heart-icon alignment

## Deploy
Push to GitHub → connect to Vercel (free). Share one unlisted URL with the cohort.
`.env.local` for future Supabase keys (git-ignored, never commit).
