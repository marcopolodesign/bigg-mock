# BIGG Mock — Session Log

> Newest entry at the top. Each entry must include: date, what changed, user-visible result, and **Source:** line.

---

## 2026-06-01 — BottomSheet + ReservarSheet + Reservar button wiring

**What changed:**
- Created `src/app/components/BottomSheet.tsx` — reusable vaul-based bottom sheet shell. Accepts `open`, `onClose`, `children`, optional `title` (sr-only for a11y). z-70, `#ededed` background, drag handle pill. Use this for ALL future bottom sheets — never inline vaul outside of it.
- Created `src/app/components/ReservarSheet.tsx` — content panel for the "Reservar clase" sheet (Figma node 22619:3582). Contains: title, Recoleta • 10:00hs + Editar link, dashed block picker with lime + icon, 6 attendee avatars + "+20", dark "Confirmar reserva" CTA with lime text.
- Updated `DailyWorkoutCard` — added `onReservar?: () => void` prop. Both the "+Reservar Clase" header link and the lime "Reservar" card button now call it. Both were plain `<div>`/`<p>` elements; converted to `<button>` with `active:opacity-*` feedback.
- Updated `BiggDayScreen` — added `reservarOpen` state, passes `onReservar` down through `MainContent` → `DailyWorkoutCard`, renders `<BottomSheet><ReservarSheet /></BottomSheet>` at screen root.

**User-visible result:** Tapping either "Reservar" button or "+Reservar Clase" slides up the booking sheet. Overlay tap / swipe dismisses it.

**Source:** Claude Code — Macbook Pro

## 2026-06-01 — Info icon + recommendation bottom sheet on Padel block

Added a Phosphor-style info icon next to "Padel" that triggers a vaul bottom sheet explaining why the block was recommended.

**What changed:**
- `Frame7`: "Padel" title row changed to a flex container; Phosphor Info SVG icon added inline as a `Drawer.Trigger asChild` button
- `Frame42`: wrapped in `Drawer.Root`; added `Drawer.Portal` with overlay, animated bottom sheet (`rounded-t-[24px]`, handle pill, body content, "Entendido" close button)
- Bottom sheet content: title "¿Por qué te recomendamos esto?", Padel activity badge (yellow dot + pill), explanation copy, dark CTA button

**Why:** User loaded a Padel activity, so the recommendation reason needed to be surfaced. Icon is semi-transparent (opacity-50) and aligns naturally with the Druk title.

**Files modified:**
- `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-01 — Fluid widths for DailyWorkoutCard and BIGG MOVE block

Fixed both components to respect the container width instead of using fixed pixel widths.

**DailyWorkoutCard:** Removed `w-[388px]` from the card wrapper and `w-[222.78px]` from the title — both now use `w-full` / free flexbox flow.

**BIGG MOVE (Group17):** Refactored from the Figma Make `inline-grid` stacking pattern (fixed `w-[389.464px]`) to a fluid `relative w-full` container. Image is `block w-full h-auto` (sets natural height). Text overlays are `absolute` with percentage `left/top` and `cqw`-based `font-size` (`clamp(32px, 30.1cqw, 120px)` for the title, `clamp(8px, 3.44cqw, 14px)` for the subtitle) so they scale proportionally with container width.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx`
- `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-01 — Force w-screen + overflow-x-hidden on root to eliminate horizontal scroll

Enforced `width: 100vw` and `overflow-x: hidden` at every layout layer so no tab can ever cause horizontal scrolling.

**What changed:**
- `BiggDayScreen` root div: replaced `size-full` with `w-screen h-full overflow-x-hidden overflow-y-auto` — width is now explicitly 100vw regardless of active tab
- `index.html` inline style: added `overflow-x: hidden` to `html, body` as a document-level backstop (catches any element that escapes the React tree)

**Why:** Wide fixed-size children (e.g. `PerformanceContent` at `w-[667px]`) were overflowing the viewport when a scrollable ancestor didn't clip them. The two-layer fix (component + document) ensures no tab can cause horizontal scroll.

**Files modified:**
- `src/app/screens/BiggDayScreen.tsx`
- `index.html`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-01 — Bottom nav with 5 tabs + IG component migrated to Community tab

Added interactive 5-tab bottom navigation and moved the Social/IG component to a dedicated Community tab.

**What changed:**
- `BottomNav` rebuilt as an interactive component with lucide-react icons (Dumbbell, Activity, Globe, Users, User). Active tab = dark icon + SemiBold label; inactive = grey.
- Tabs: **Train** (default), **Actividad**, **BIGG World**, **Comunidad**, **Perfil**
- `SocialContainer` (Instagram @BIGG.fit block with photos + hashtags) removed from the Train scroll and now renders exclusively inside `CommunityTabContent`
- `StickyHeader` (calendar/date strip) only shows on the Train tab
- Activity, BIGG World, Perfil tabs show placeholder screens ("próximamente")
- `BiggDayScreen` now manages `activeTab` state at the root level

**Files modified:**
- `src/app/screens/BiggDayScreen.tsx` — tab state, new BottomNav, CommunityTabContent, PlaceholderTabContent
- `components.md` — updated BiggDayScreen entry

**Source:** Claude Code — Macbook Pro

---

## 2026-06-01 — Local fonts wired up

Replaced CDN font loading with local files from `Local Sites/bigg-es/public/fonts/`. Rewrote `fonts.css` to use Figma Make's colon-separated `@font-face` naming convention (`MessinaSansWeb:Bold`, `Druk_Wide:Medium`, etc.) so fonts actually apply to the generated Tailwind classes.

**Files available locally:** MessinaSansWeb-Bold, MessinaSansWeb-Regular, Druk-WideMedium, FixtureUltra-SemiBold (woff + woff2).
**Mapped:** SemiBold → Bold, Book → Regular (no local files for those weights).
**Files modified:** `src/styles/fonts.css`, `design-system.md`
**Files added:** `public/fonts/*.woff*` (8 files)

**Source:** Claude Code — Macbook Pro

---

## 2026-06-01 — DailyWorkoutCard — interactive tab switcher

Extracted the "Tu BIGG day recomendado" card from the static Figma import into an interactive React component.

**What changed:** Clicking BIGG Class / Home/Gym / Outdoors tabs now switches the active tab (full opacity + underline) and swaps the card content (title + chips) with mock data per mode. Transition is 200ms opacity fade on the tabs.

**Files created:**
- `src/app/components/DailyWorkoutCard.tsx` — self-contained tabbed card with `useState`
- `src/app/screens/BiggDayScreen.tsx` — new editable screen replacing the static BiggDay import; all other sections copied verbatim

**Files modified:**
- `src/app/App.tsx` — now imports `BiggDayScreen` instead of `BiggDay`
- `components.md` — documented DailyWorkoutCard + BiggDayScreen

**Source:** Claude Code — Macbook Pro

---

## 2026-06-01 — Project scaffolding

Created initial project documentation files: `CLAUDE.md`, `catchup.md`, `components.md`, `design-system.md`.

**Source:** Claude Code — Macbook Pro
