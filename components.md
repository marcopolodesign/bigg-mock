# Component Reference — BIGG Mock

> **IMPORTANT:** Keep this file up to date. Whenever a component is **created, modified, or deleted**, update the relevant entry here before writing the `catchup.md` entry.

---

## Conventions

- `src/app/components/ui/` — shadcn/ui primitives. Never modify these directly; extend via `className` props.
- `src/app/components/figma/` — Figma-to-code utility components (e.g. `ImageWithFallback`).
- `src/app/components/` — custom BIGG components extracted from Figma screens.
- `src/imports/<Screen>/` — generated Figma Make output. **Read-only.** Extract what you need; never edit in place.

---

## Figma Utility Components (`src/app/components/figma/`)

### `ImageWithFallback`
**File:** `src/app/components/figma/ImageWithFallback.tsx`
**Purpose:** `<img>` wrapper that renders a placeholder on load error. Used by generated Figma screens for imported assets that may be missing.

---

## shadcn/ui Primitives (`src/app/components/ui/`)

All components from the shadcn/ui library are present. Key ones in active use:

| Component | File | Notes |
|-----------|------|-------|
| `Button` | `button.tsx` | Variants: default, destructive, outline, secondary, ghost, link |
| `Card` | `card.tsx` | CardHeader, CardContent, CardFooter, CardTitle, CardDescription |
| `Badge` | `badge.tsx` | Variants: default, secondary, destructive, outline |
| `Tabs` | `tabs.tsx` | TabsList, TabsTrigger, TabsContent |
| `Dialog` | `dialog.tsx` | Modal with overlay |
| `Sheet` | `sheet.tsx` | Slide-in panel (use for mobile bottom sheets) |
| `Avatar` | `avatar.tsx` | AvatarImage + AvatarFallback |
| `Progress` | `progress.tsx` | Horizontal progress bar |
| `Slider` | `slider.tsx` | Range input |
| `Chart` | `chart.tsx` | recharts wrapper with theme-aware colors |

---

## Generated Screens (`src/imports/`)

### `BiggDay`
**File:** `src/imports/BiggDay/BiggDay.tsx`
**Description:** "Tu BIGG day recomendado" daily plan screen. Shows recommended class (BIGG Class / Home/Gym options), performance and social images, and a community section.
**Status:** Generated — read-only. Mounted directly in `App.tsx`.
**Assets:** 9 PNG images + 1 SVG path file (`svg-03sgvqmew7.ts`).

---

---

## Custom Components (`src/app/components/`)

### `BottomSheet`
**File:** `src/app/components/BottomSheet.tsx`
**Props:** `open: boolean`, `onClose: () => void`, `children: ReactNode`, `title?: string` (default `"Panel"` — visually hidden, used for accessibility)
**Purpose:** Reusable bottom sheet shell. Wraps vaul's `Drawer.Root/Portal/Overlay/Content`. Renders the drag handle pill; content is fully injected via `children`. Use this for every bottom sheet across the app — never inline vaul setup outside of it.
**Stacking:** z-index 70 (above the Padel explanation drawer at z-60).

### `ReservarSheet`
**File:** `src/app/components/ReservarSheet.tsx`
**Props:** none (self-contained mock content)
**Purpose:** Content panel for the "Reservar clase" bottom sheet — Figma node `22619:3582`. Rendered inside `<BottomSheet>`. Contains: title, location/time + Editar link, dashed block picker, attendee avatar row, "Confirmar reserva" CTA. Mock data only.
**Usage:** `<BottomSheet open={...} onClose={...} title="Reservar clase"><ReservarSheet /></BottomSheet>`


### `DailyWorkoutCard`
**File:** `src/app/components/DailyWorkoutCard.tsx`
**Props:** `onReservar?`, `onConfirmWorkout?`, `onOpenFab?`, `reservedClass?`, `activities?: ActivityEntry[]`, `showMorning?`, `showAfternoon?`
**Layout (recommended/non-reserved view):** two stacked sections, no space filters.
  - **Hero — "Tu entrenamiento de hoy" / "Tu recomendación principal":** the day's main class as the visual anchor. White→grey gradient card with Druk_Wide 32px title (`MORNING_CLASS`), info chips, an always-visible *why* band (`Sparkles` + cyan `#2ab3cc` text), and the lime `#adff19` "Reservar clase" CTA tucked under the card.
  - **Complements — "Para completar tu día":** secondary recommendations (`activities` + the Mobility/`AfternoonRecommendationCard`) in their own timeline (vertical line + time pills), subordinate to the hero.
**The "why":** every recommendation shows a justification. `ClassData.why` for the hero class; `ActivityEntry.why?` (optional) for activities; the Mobility card has its own cooldown rationale. All rendered with `Sparkles` in cyan `#2ab3cc` — the unified "why" language across the app.
**Reserved view:** when `reservedClass` is set, fades into a timeline with `ReservedClassCard` (blocks + attendee avatars) followed by any `activities` and the Agregar button.
**Note:** the space-selection tabs (BIGG Class / Home/Gym / Outdoors) were removed — the home recommends *what* to train; the location is resolved later in the programming/reservation screen.

---

## Screens (`src/app/screens/`)

### `BiggDayScreen`
**File:** `src/app/screens/BiggDayScreen.tsx`
**Purpose:** Interactive replacement for the static `src/imports/BiggDay/BiggDay.tsx`. Mounted in `App.tsx`.
**State:** `activeTab: 'train' | 'activity' | 'world' | 'community' | 'perfil'` — defaults to `'train'`
**Tabs:** 5-tab bottom nav (Train, Actividad, BIGG World, Comunidad, Perfil) with lucide-react icons. Active tab = dark icon + SemiBold label; inactive = grey.
**Tab content:**
  - **Train** — full main content (DailyWorkoutCard + Padel + BIGG MOVE + Action buttons + Activity + Membership + Performance + Referral). StickyHeader (calendar/date strip) only shown on this tab.
  - **Activity / BIGG World / Perfil** — placeholder screens ("próximamente")
  - **Community** — `CommunityTabContent` wrapping `SocialContainer` (IG component: @BIGG.fit, social images, hashtags)
**Currently interactive:** `DailyWorkoutCard` (Daily Workout section), `BottomNav` (tab switching)
**Header:** `StickyHeader` (Train tab only) = greeting (`Frame14`) + `WeekCalendar`. Collapses on scroll by translating up by the greeting's height (greeting tucks behind the status bar; calendar stays visible).

### `ActivityContainer` (Racha de actividad)
**Defined in:** `src/app/screens/BiggDayScreen.tsx`
**Purpose:** Activity-streak card (renamed from "Strike de actividad" → "Racha de actividad"). Shows the streak count (Druk Wide + `Flame`), a record chip, a data-driven 7-day strip, and a motivational "why" line.
**Data:** `STREAK_DAYS: { letter, state: "done" | "today" | "future" }[]`, plus `STREAK_COUNT` / `STREAK_RECORD` (mock). Strip is a `flex` map with lime connectors between consecutive `done` days; "today" = dashed ring; helper `StreakDot`. No absolute positioning (replaced the old `Ellipse*`/`ActivityIcon*` machinery).

### `SourceChip`
**File:** `src/app/components/SourceChip.tsx`
**Exports:** default `SourceChip`, `type DataSource = "strava" | "garmin" | "apple-health"`
**Props:** `source: DataSource`, `prefix?: string` (e.g. "Tomado desde" / "Datos de"), `onDark?: boolean`
**Purpose:** Provenance chip for data imported from external fitness/health sources. Per-source label + color via internal `SOURCE_META` (Strava `#fc4c02`, Garmin `#007cc3`, Apple Health `#fe375f`). Renders a colored dot + label pill; `onDark` switches to a translucent-white pill for dark backgrounds.
**Used by:** `ActivityCard` (timeline activities — "Tomado desde …"), `SleepCard` ("Datos de Apple Health", `onDark`), `StepsCard` ("Datos de Garmin").

### `WhyLine`
**File:** `src/app/components/WhyLine.tsx`
**Props:** `children: ReactNode`, `iconSize?: number` (default 16)
**Purpose:** The "why" / AI-recommendation line — `Sparkles` (cyan `#2ab3cc`) + cyan text — used wherever the home explains *why* something is recommended. Centralizes the cyan/type spec.
**Used by:** hero class why-band + `ActivityCard` + `AfternoonRecommendationCard` (all in `DailyWorkoutCard`), and the `ActivityContainer` streak line in `BiggDayScreen`.

### `ProgrammingSection`
**File:** `src/app/components/ProgrammingSection.tsx`
**Props:** none (self-contained with mock data)
**Purpose:** Replicates the native `newProgramming` screen — 5 horizontally-scrollable rows (WARMUP + BLOQUE 1–4), each row containing stimulus block cards (Lower Body, Upper Body, HIIT, etc.). Tapping a card selects it (lime-green state + checkmark); selecting any block reveals a "Agregar N bloques al entrenamiento" CTA. Uses `motion/react` for selection animation.
**Data shape:** `ProgrammingRow[]` → `StimulusBlock[]` (id, stimulus, modality, duration, movements, gradient). All mock data lives inside the file.
**Used by:** `BiggDayScreen` (injected after the DailyWorkoutCard timeline, before Recommendations).

<!-- Add new custom components below as they are created -->
