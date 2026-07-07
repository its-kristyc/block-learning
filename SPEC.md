# BASI Block System — Study App Specification

This document is the build blueprint for a web app that helps a BASI Pilates teacher-trainee learn the **block system** and organize 400+ exercises across apparatuses. It captures every product and design decision made while building the prototype (`basi-block-system.jsx`). Read it alongside that prototype file: **the prototype is the source of truth for layout, interaction, and visual style; this spec explains the decisions, the data model, and what must change for the real build.**

---

## 1. What this app is

A personal study tool, shareable with classmates. Three core jobs:

1. **Explore** the repertoire through the 12-block wheel and a searchable/filterable exercise library.
2. **Build programs** (classes) by dragging exercises into the 12 blocks, then view them as a teaching "class flow."
3. **Practice** with a shuffled flashcard deck.

It is **not** multi-user in v1. No accounts, no backend. Each person's notes/favorites/programs live in their own browser. See §9 for the deferred scaling path.

---

## 2. Tech & architecture

- **Stack:** React + Vite, deployed static (Vercel/Netlify/GitHub Pages — free, no server).
- **Styling:** the prototype uses inline styles + one color token object (`C`) for speed. For the real build, convert these to **CSS custom properties / design tokens** (see §7) and a component library structure. Keep the visual output identical.
- **State/storage:** all user data goes through a **storage abstraction layer** — a single module (`saveNote`, `getFavorites`, `savePrograms`, etc.). The rest of the app never calls `localStorage` directly. v1 implementation = `localStorage`. This makes the future Supabase swap (§9) a single-module change.
- **Persistence rule:** *autosave for annotations* (notes, favorites — saved silently on change), *explicit save for constructions* (programs — see §5).
- **Mobile-first:** design and verify every view at phone width first, then enhance up to desktop. The likeliest usage is a teacher on their phone at the studio. Breakpoint in prototype is 768px.

---

## 3. Data model

```
Exercise {
  id: string
  name: string
  block: 1–12                      // which block it belongs to
  apparatus: string                // "Mat" | "Reformer" | "Cadillac" | "Wunda Chair" | "Spine Corrector" | "Ladder Barrel" | ...
  collection: { name: string, kind: "series" | "group" } | null
  level: "Fundamental" | "Intermediate" | "Advanced"
  setup: string                    // the "Description / Setup" text
  resistance: string | null        // e.g. "Medium to heavy" (reformer/chair)
  exhale: string | null            // movement on exhale
  inhale: string | null            // movement on inhale
  muscleFocus: string[]
  objectives: string[]
  cues: string[]
  image: string                    // ONE wide photo showing the movement sequence (see note)
}

UserData {                         // all in localStorage via the storage layer
  notes: { [exerciseId]: string }
  favorites: string[]              // exercise ids
  programs: Program[]
}

Program {
  id: string
  name: string
  blocks: { [blockNumber: 1–12]: exerciseId[] }   // ordered within each block
}
```

**Key data decisions:**
- **`image` is a single wide photo, not an array.** BASI source pages show the 4 movement phases in one wide frame (≈16:5). One image per exercise — simpler to digitize, matches the source, matches the detail view.
- **`collection` carries `kind` (series vs group) but the app never enforces it.** Series = performed complete & in sequence; group = selectable individually. This is shown as *information only* — never as a rule the software polices. Teachers have full autonomy when building programs. The distinction surfaces as: a badge/label, a search tab, and visual grouping in Explore (§4).
- **The 12 blocks (canonical order):** Warm Up, Foot Work, Abdominal Work, Hip Work, Spinal Articulation, Stretches, Full Body Integration I, Arm Work, Leg Work, Full Body Integration II, Lateral Flexion & Rotation, Back Extension.
- **Canonical apparatus order** (defined in ONE constant; every apparatus in the real data must be listed so none sort to the end): Mat → Reformer → Cadillac → Wunda Chair → Spine Corrector → Ladder Barrel → (others).

**Data entry is the biggest real-world task.** In Claude Code, batch-extract the 400+ exercises from BASI study-guide PDFs/screenshots into `exercises.json` following the schema above, in batches of 10–20 with spot-checks. The prototype ships ~48 illustrative exercises (Parallel Heels is the one real data point from the source sheet; the rest are plausible but approximate — **replace them all**).

⚠️ This content is BASI's proprietary course material. Keep the deployed site private to the cohort (unlisted URL, or behind auth once scaled) rather than fully public.

---

## 4. The three areas

### Navigation shell
- Desktop: a slim left **nav rail** (Explore / Programs / Practice — icon + label, no logo).
- Mobile: the rail becomes a **bottom tab bar**.
- A top header holds only **global** things: the "BASI Block System" wordmark (left) and the data backup info + export/import (right). Nothing tab-specific lives here.
- **Principle: a control lives at the scope it operates on.** Search drives only the library, so it lives *in* Explore — never in the global header. Favorites and data-backup are global, so they're in the header / panel.

### A. Explore
Layout = **fixed wheel (left) + persistent panel (right)**. The wheel never resizes (no jarring shrink animation). On mobile they stack: wheel on top, panel below.

**The wheel:** 12 numbered, labeled wedges in canonical order (12 at top). Click a wedge → panel filters to that block. The hub center reads "BLOCK SYSTEM"; when a block is selected it becomes a "CLEAR / show all" button. Wheel fill color is its own token (`wheel`, §7).

**The panel** (always present), top to bottom:
1. **All / Favorites toggle** (pill segmented control). Favorites is a *peer mode* of All — it has its own apparatus tabs so a large favorites list stays organized.
2. **Search field** (with magnifier icon + clear-X). Typing flips the panel into search-results mode with two tabs: **Exercises** and **Series & groups**.
3. **Filter chips:** Level, Muscle focus, Series/group. (Apparatus is NOT a chip here — it's the tab row below, see next.) Each filter is a custom dropdown: placeholder is **not** selectable; once a value is chosen the trailing chevron becomes an **X to clear that one filter**; a separate "Clear" link resets all. Filter dropdown chevron and clear-X must be the **same SVG size** (don't let the icon jump on toggle).
4. **— divider —** (the divider sits *between filters and the tab row*, grouping "set up your view" above from "the list" below).
5. **Apparatus tab row** (sticky on desktop): Mat / Reformer / Cadillac / … each with a count. Horizontal-scroll only (`overflow-y: hidden`, tabs `flex-shrink: 0`) — never a vertical phantom scrollbar. Tabs reflect the *filtered* result set: apparatuses with zero matches drop out; if nothing matches, the whole tab row disappears and only the empty message shows.
6. **The list.**

**Two panel states:**
- **No block selected (All/Favorites):** list is scoped to the active apparatus tab.
- **Block selected:** list is that block's exercises. Header = "← All" link, then (gap) "BLOCK N" in red, then block name + "N exercises" on one baseline-aligned line. All left-aligned. (Back link sits on its own line above the title — consistent everywhere in the app.)

**Collection grouping in the list:** consecutive exercises sharing a `collection` (series OR group — both, in Explore it's purely organizational) are wrapped in a **bordered box** with a header (collection name + count, no kind badge, no "perform in sequence" note). Standalone exercises render as plain cards.
- ⚠️ **Known open issue:** the box's padding indents member cards relative to standalone cards, so heart icons don't align (zigzag). Accepted for now. Revisit with a grouping that doesn't indent (we explored a left-accent-rail with a reserved gutter that keeps all card edges aligned — that's the leading candidate).

**Exercise card** (used everywhere an exercise appears — Explore, search, favorites, program flow): name + level pill on top line; collection · apparatus (· level) on the meta line. Heart toggles favorite (omitted in contexts where favoriting isn't the point, e.g. program flow). Hover = very subtle `#F7F5F5`.

**Exercise detail = slide-over drawer** (right edge on desktop, bottom sheet on mobile), over a dimmed backdrop; the underlying layout never moves. White background (`card`) to match the panel and contrast the wheel's cream. Contents: one wide image (≈16:5), then Description (setup + resistance), Movement (exhale/inhale), Muscle focus, Objectives, Cues, and an auto-saving **Notes** field (warm `paper` background to read as an input). Title has the heart beside it; a single **X** closes it. **No prev/next, no breadcrumb** — it's a clean modal dead-end (open → read → close). Section labels are light-tracked uppercase; body text, list items, and labels share one left edge (no `<ul>` indent).

### B. Programs
**List view:** programs shown as **divider-separated rows** (NOT cards — they're a different object type: authored containers, shown as an index). Each row: name + "N exercises", a **⋯ menu** (Edit / Duplicate / Delete — no inline buttons). Row hover = light red (`redSoft`). Delete uses a **styled confirm dialog** (never the native `confirm`). "+ New program" is a primary button in the header.

**Two faces of a program:**
- **Class Flow (default view):** read-only teaching script. Each block is a **tinted header band** (pale red `redSoft` pill with number + name — NOT a heavy rule), followed by its exercises as tappable cards (tap → detail drawer). Edit (pencil) and Delete (trash) are **borderless icon buttons**, top-right. Header (← Back, title) is left-aligned and width-matched to the content below.
- **Build mode (editor):** entered by creating a new program or hitting Edit. The body is **one bordered region** containing a left **library palette** (search with icon + apparatus tabs, same browsing model as Explore) and the **kanban board** (12 block columns). Header above: "← Back", editable title, **Save** button.

**Editor behavior:**
- **Draft model:** edits happen on a draft copy. **Save** commits and returns to Class Flow. Leaving with unsaved changes (Back, switching tabs, etc.) triggers a **"Discard unsaved changes?"** dialog; a clean draft leaves freely. (Label is "Back" but it still runs the guard — keep label and behavior in sync.)
  - ⚠️ The guard covers in-app navigation only. The real build should also add a `beforeunload` handler for browser refresh/close.
- **Drag & drop:** drag from the library into any block; drag to reorder within a block; drag between blocks. A red insertion line shows the drop position. No restrictions on what goes where (block system is guidance, not rules).
  - Desktop uses native HTML5 DnD; mobile uses a hand-rolled **pointer-event long-press drag** (~350ms hold → lift → drag → drop). **Both are proof-of-concept** — the real build should use a unified drag library like **dnd-kit** (handles pointer + touch, auto-scroll, accessibility) to replace both.
- Board cards show name + apparatus + collection (series/group label), so series membership is visible while building.
- Duplicate a program is supported (cheap iteration on a class plan).

### C. Practice
A shuffled **15-card** flashcard session (no scoring, no spaced repetition — those are deferred). Card shows block, name, collection · apparatus · level. **Reveal** (grey button, centered below card) shows the Description + a red "View full details →" text button that opens the detail drawer. Navigation: **Previous / Next** (✓ Finish on the last card → completion screen with New session / Done).
- **Mobile layout is distinct from desktop** (designed, not inherited): full-width card, smaller type, nav as circular buttons in a bottom control row with a "N / 15" counter. Desktop: arrows flank the card at its edges.

---

## 5. Cross-cutting interaction rules

- **One live layer at a time.** When a drawer/dialog/sheet is open, everything behind it is dimmed and inert. To change filters, close the drawer first.
- **Back links sit on their own line above the title**, left-aligned, everywhere.
- **Autosave vs explicit save:** notes & favorites autosave silently; programs use draft + explicit Save + discard guard.
- **Export / Import backup:** one-click download of all UserData as JSON, and re-import — the mitigation for localStorage being per-device. Surface this in the data-info tooltip.
- **Empty/edge states** are handled (no favorites, no programs, empty block, filtered-to-nothing, etc.) — see prototype.

---

## 6. Responsive rules

- Nav rail → bottom tab bar.
- Explore: wheel + panel stack vertically; tapping a wedge renders the block list below.
- Detail drawer → bottom sheet with X (swipe-to-dismiss is a nice-to-have).
- Tap targets: minimum ~40px on touch. Icon buttons scale up on mobile (the prototype does this via media query on `.menuDots`; bake it into the button component instead).
- Practice gets its own mobile layout (above).

---

## 7. Visual system

**Palette (warm-neutral, single red accent + semantic level colors):**
```
red      #A83722   primary brand / actions / active states
redDeep  #7E2817   pressed / deep accent / red text
redSoft  #F6E7E2   soft red tint (hover bands, chips)
wheel    #AB2B2B   wheel wedges only (its own token)
paper    #FBF7F1   app background (warm cream); also notes-field bg
card     #FFFFFF   panels, cards, detail drawer
ink      #33291F   warm charcoal body text (NOT pure black)
muted    #8A7F73   secondary text
line     #E7DFD3   borders
lineSoft #F2ECE3   subtle fills/dividers
gold     #B98A2F / goldSoft #F7EFDE   (group badge accent)

Level colors (semantic traffic-light):
  Fundamental  #2F7D5B on #E7F2EC
  Intermediate #B98A2F on #F7EFDE
  Advanced     #D14747 on #FBEAEA   (distinct red from the series/brand red — don't merge)
```
Convert all of the above to CSS custom properties / design tokens in the real build. The warm-neutral direction was a deliberate choice over adding a second hue — keep it single-accent. (A future "apparatus = cool secondary color" axis was considered and parked; don't add it without that rationale.)

**Buttons:** one scale, two variants — **primary** (filled red) and **secondary/ghost** (bordered). Both **8px radius** (no pill/square mismatch), same size rhythm, plus a **compact** size for in-context actions (e.g. "+ Add"). Don't let button shapes/sizes drift.

**Icons:** adopt **one SVG icon library** (e.g. lucide) on a consistent size scale (≈14px inline-text, 16px inputs, 18–20px actions). The prototype mixes SVGs with Unicode glyphs (⤓ ⤒ ✕ etc.) which size unpredictably — replace ALL glyphs in one pass. The export/import arrows especially need clearer icons or labels.

**Scrollbars:** style globally with an **inset thumb** (transparent border + `background-clip: padding-box`) so the thumb never visually touches adjacent content — one global rule instead of per-container right-padding.

**Formatting restraint:** level pills and collection badges are **regular weight**, not bold — quiet metadata, not emphasis.

**Typography:** define body / list-item / label as one type scale sharing a single left margin so lists and paragraphs align.

---

## 8. Known polish items (do these first in Claude Code, against a live render)

- ~~Wheel wedge labels: long names (Full Body Integration I/II, Spinal Articulation) don't fully fit inside wedges — fix tspan wrapping/sizing against the real rendered SVG.~~ **Resolved** via a hand-tuned `WEDGE_CONFIG` lookup in Wheel.jsx (per-label lines/size/xOffset). The 12 BASI blocks are a fixed closed set, so a static table is correct here — no dynamic text-measurement needed. Verified rendering 2026-07-07.
- Replace all Unicode glyph icons with the chosen icon library.
- Replace both drag implementations with dnd-kit (or similar).
- Real exercise images (one wide photo each).
- Add `beforeunload` guard for the program editor.
- Revisit collection grouping to fix heart-icon alignment (accent-rail-with-gutter candidate).

---

## 9. Back pocket (deferred — only if scaling)

These were explicitly deferred. **Resurface them only if the user revisits scaling.**
1. **localStorage → database migration:** when auth is added, detect existing local data and offer to upload it to the new account so early adopters don't lose notes. Build the storage layer (§2) so this is a single-module swap to **Supabase** (auth + Postgres + image storage + magic-link email login, generous free tier, bolts onto a static site).
2. **Community email list:** start with a simple mailing-list form (Formspree/Buttondown/Google Form, zero backend); full magic-link auth only when synced notes / member features are actually wanted. Sequence: static site → email capture → Supabase auth.

**Explicitly rejected:** URL-encoded program sharing. Program-building is a personal learning exercise; making it easy to copy someone else's sequencing would undercut the pedagogy. Don't add it.

Future study features also parked: quiz/multiple-choice mode, spaced repetition (Leitner), cross-device sync — all fold into the Supabase era if wanted.

---

## 10. Handoff checklist for Claude Code

1. `Read SPEC.md and prototype.jsx. Set up a Vite + React project; implement the Explore tab first, using the prototype as the design reference.`
2. Build feature-by-feature (Explore → Programs → Practice), checking each in the browser.
3. Create a `CLAUDE.md` capturing project conventions so future sessions stay consistent.
4. Extract the 400+ exercises into `exercises.json` (schema §3), in spot-checked batches.
5. Wire the storage layer (localStorage impl behind the abstraction).
6. Knock out §8 polish items against the live render.
7. Deploy to Vercel; share one unlisted URL with the cohort.
