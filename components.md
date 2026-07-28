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


### `LocationSheet`
**File:** `src/app/components/LocationSheet.tsx`
**Props:** `open`, `onClose`, `selected: string`, `onSelect: (location: string) => void`, `customLocations?: string[]`, `onAddLocation: () => void`
**Purpose:** vaul BottomSheet listing all training locations grouped by type. Rows: BIGG Recoleta, BIGG Tortuguitas, Seleccionar BIGG (chevron, calls onClose) / BIGG Outdoors / En mi casa + customLocations / + Agregar ubicación. Active location gets a `Check` icon. Used by `DailyWorkoutCard`.

### `AddLocationScreen`
**File:** `src/app/components/AddLocationScreen.tsx`
**Props:** `open: boolean`, `onClose: () => void`, `onSave: (name: string, equipment: string[]) => void`
**Purpose:** Full-screen slide-up modal (z-80, spring stiffness 320) for adding a custom training location. Name text input + 12 equipment chips (lime when selected). "Guardar ubicación" button disabled until name is non-empty. Resets state on cancel/save.

### `DailyWorkoutCard`
**File:** `src/app/components/DailyWorkoutCard.tsx`
**Props:** `onReservar?`, `onOpenFab?`, `onOpenDetail?`, `onOpenProgramming?`, `reservedClass?`, `activities?: ActivityEntry[]`, `showMorning?`, `showAfternoon?`, `isFutureDay?`, `isToday?`, `onCompleteDay?: () => void`, plus display props (`blockTitles`, `weatherNote`, `showRunClub`, `defaultLocation`) — `showWeeklyNPS` removed 2026-07-21 along with `WeeklyNPSCard`/`WEEKLY_NPS_MOCK` (the "Tu NPS semanal" end-of-timeline card was dropped from Train entirely, per user request). `NPSStatus`/`NPS_STATUS_META` were kept — still used by `NutritionEntry`'s day-status recap, a separate feature. **Exported** as of 2026-07-21 (were file-private before) so `ActividadScreen`'s `DayRecapSheet` can reuse the same status colors/labels instead of redefining them.
**Timeline filter:** `TIMELINE_FILTERS` = Todos / Entrenamiento y actividad / Sueño / Nutrición (4 options — the old "Social" filter was removed 2026-07-21; Run Club visibility now depends only on `showRunClub && showTrainingContent`, not on a filter).
**Location header (recommendation state):** `MapPin + selectedLocation + ChevronDown` — tapping opens `LocationSheet`. Defaults to "BIGG Recoleta". CTA switches between lime "Reservar clase" (BIGG locations: Recoleta, Tortuguitas) and dark "Iniciar entrenamiento" (all others). Static `BASE_CHIPS` (FBA, Upper Body, HIIT, Midline) always shown. Custom locations added via `AddLocationScreen` are persisted in local state.
**"Entrenamiento del día" card body — `cardVariant === 3` (2026-07-28):** variant 3 is the only one the app actually renders. Its card **shell is unchanged** (dark `#3d3d3d` wrapper, "Entrenamiento del día" header + chevron, inner light card, "Bloque cambiado para esta ubicación" indicator, and the overlapping CTA block with "Donde vas a entrenar?" + Reservar clase/Iniciar entrenamiento). Only the **inner content** changed: the expandable `FlapItem` accordion rows were replaced by a Druk Wide title ("Entrenamiento de BIGG", 26px `#565656`, wraps to 2 lines — same type recipe as `ActivityCard`'s "Running pasadas" title, mixed case, no `uppercase`) plus a non-expandable 2×2 grid of small `{i+1}. {stimulus}` chips (`bg-[#ededed]`), built from `V4_BLOCKS` with the same BIGG-vs-away name swap (`blockTitles` override / `vb.away`) that was already there. `FlapItem`, `FLAP_OVERLAP` and `openFlapId` were deleted as dead code (recoverable from git history). Variants 1/2/4 remain legacy design-option comparisons from `comparacion-opciones.html`, untouched.
**Nutrición + Wind down row (2026-07-28):** the two end-of-timeline check-ins sit side by side in a single `flex flex-row items-stretch gap-[10px]` wrapper instead of stacking. Each column is `flex-1 min-w-0` rather than a hard `w-50%`, so when the active filter hides one (Sueño → only Wind down, Nutrición → only Nutrición) the survivor still fills the row. Equal heights come from `items-stretch` + `flex-1` on each inner card wrapper, plus `h-full` on `NutritionEntry`'s card and `h-full` on `WindDownCard`'s inner row — without those the shorter card floats at the top of its stretched column. `WindDownCard` therefore sizes with `flex-1`, not `w-full`.
**Reserved view:** when `reservedClass` is set, fades into a timeline with `ReservedClassCard` (blocks + attendee avatars) followed by any `activities` and the Agregar button. (Note: this branch does not render `SleepEntry`/`NutritionEntry` — those only appear in the unified "recommendation state" timeline below.)
**`SleepEntry`** (sub-component, props: `approval`, `onApprovalChange`, `onCompleteDay?`): sleep quality check-in, first item inside the timeline's vertical-connector wrapper. Approval (`"approved" | "rejected" | null`) is now **controlled** — lifted to `DailyWorkoutCard`'s `sleepApproval` state (defaults to `"approved"` when `isToday`) so it can be read by `NutritionEntry`'s end-of-day recap. Its "Detalles de sueño" `BottomSheet` (Duración/Calidad rows, "Ver todos"/"Ver menos" toggle, collapsible recovery tags) now ends with a "Ver mi actividad" CTA (2026-07-21, indigo `#8b78e6` — matches the sheet's existing indigo/violet accent) that closes the sheet and calls `onCompleteDay`, reusing the same callback `NutritionEntry` uses to switch the app to the Actividad tab (threaded `DailyWorkoutCard` → `SleepEntry` at its single call site).
**`NutritionEntry`** (sub-component, props: `isToday?`, `sleepApproval?`, `onCompleteDay?`): nutrition check-in. As of 2026-07-21 renders as a **standalone block above the timeline's vertical connector** (sibling of the "Tu BIGG day" header, not inside the `<div className="relative w-full">` timeline wrapper), with its own "Nutrición" title. Details `BottomSheet` has: "¿Qué comiste?" text input + "Hora" time input (manual log, no integration — the old `myfitnesspal` `SourceChip` was removed), a collapsible "Tags de digestión y energía" section (chevron toggle, same spring pattern as `SleepEntry`'s "Ver todos"), and a "Guardar" CTA. Guardar chains: close details → open "BIGG Nutrition" upsell `BottomSheet` (gradient hero + `Utensils` icon, static promo, CTA is currently a no-op) → if `isToday`, chain into a third `BottomSheet` "Así fue tu día" (day-status recap: 4 factors — entrenaste/actividad hardcoded `true`, dormiste/comiste read real state — with `NPS_STATUS_META` status label; "Ver mi semana" CTA calls `onCompleteDay`). Non-today days show the upsell but never the day-status recap.

---

## Screens (`src/app/screens/`)

### `BiggDayScreen`
**File:** `src/app/screens/BiggDayScreen.tsx`
**Purpose:** Interactive replacement for the static `src/imports/BiggDay/BiggDay.tsx`. Mounted in `App.tsx`.
**State:** `activeTab: BottomTabId = "world" | "activity" | "perfil" | "community"` — defaults to `"world"` (Train)
**Tabs:** `BOTTOM_TABS` bottom nav, in order: **Train** (`id: "world"`, main timeline) → **Actividad** (`id: "activity"`, own screen) → **BIGG World** (`id: "perfil"`) → **Comunidad** (`id: "community"`).
**Tab content:**
  - **Train** (`activeTab === "world"`) — renders `MainContent` (DailyWorkoutCard + Activity streak + BenchmarkContainer + BIGG MOVE + Action buttons + Membership) at `cardVariant={3}`, plus the fixed `StickyHeader` (calendar/date strip). Referral program is no longer here — moved to `ThankYouClassScreen` (see below).
  - **Actividad** (`activeTab === "activity"`) — **as of 2026-07-21, its own standalone screen, `ActividadScreen`** (see below) — no longer shares `MainContent`/`StickyHeader`/`DailyWorkoutCard` with Train. The `MonthlyNPSGrid` component it used to show (a fabricated NPS heatmap with no basis in the real app) was deleted.
  - **BIGG World** (`perfil`) — `BiggWorldScreen`
  - **Comunidad** — `CommunityTabContent` wrapping `SocialContainer` (IG component: @BIGG.fit, social images, hashtags)
**Currently interactive:** `DailyWorkoutCard` (Daily Workout section), `BottomNav` (tab switching), avatar button (opens `ProfileScreen`, from both Train's `StickyHeader` and `ActividadScreen`'s own header)
**Header:** `StickyHeader` — Train tab only now (was shared with Actividad before the 2026-07-21 split) — greeting (`Frame14`, contains the avatar button `Frame43`) + `WeekCalendar`. Collapses on scroll by translating up by the greeting's height. `Frame43`'s avatar `<button>` calls `onOpenProfile`, threaded `BiggDayScreen` → `StickyHeader` → `Frame14` → `Frame43`, opening `ProfileScreen` (`profileOpen` state). `ActividadScreen` has its own separate (non-fixed) header with its own avatar button wired to the same `onOpenProfile` callback, passed as a prop.

### `ActivityContainer` (Racha de actividad)
**Defined in:** `src/app/screens/BiggDayScreen.tsx`
**Purpose:** Activity-streak card (renamed from "Strike de actividad" → "Racha de actividad"). Shows the streak count (Druk Wide + `Flame`), a record chip, a data-driven 7-day strip, and a motivational "why" line.
**Data:** `STREAK_DAYS: { letter, state: "done" | "today" | "future" }[]`, plus `STREAK_COUNT` / `STREAK_RECORD` (mock). Strip is a `flex` map with lime connectors between consecutive `done` days; "today" = dashed ring; helper `StreakDot`. No absolute positioning (replaced the old `Ellipse*`/`ActivityIcon*` machinery).

### `BenchmarkContainer` (BIGG Benchmark)
**Defined in:** `src/app/screens/BiggDayScreen.tsx`
**Purpose:** Ported from `biggapp/Components/Benchmark/BenchmarkActivity.js` — moved from the Activity page's tail (where in the real app it sits half-width next to Weights) to its own full-width section on the **Train tab only**. Shows the "has a result" state: "BIGG Benchmark" label + big Druk score "78%" (white text) over a dark scrim on `imgPerformanceImage1` (a BIGG gym-wall photo already imported for the now-hidden `PerformanceContainer` — no equivalent `benchmark_small.png` asset exists in this mock), plus "14 Julio 2026" + "Último resultado del benchmark".
**Rendered in:** `MainContent`'s common sections, gated `cardVariant === 3`. Since `MainContent` is now only mounted on the Train tab (Actividad split into its own screen 2026-07-21), this gate is effectively a no-op — kept as-is in case `MainContent` gains another `cardVariant` consumer later.

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

### `ClassDetailScreen`
**File:** `src/app/components/ClassDetailScreen.tsx`
**Props:** `reservedClass: ReservedClass`, `onBack: () => void`, `onOpenProgramming?: () => void`, `onFinishClass?: () => void`
**Purpose:** Full-screen slide-in detail view for a reserved class. Adapts the biggapp Figma header (node `20114:16150`) to the BIGG Mock light color system. Shows: Volver back nav, gradient header card (white→lime, same as `ReservedClassCard`) with class name + time + location, dark attendee strip with avatar row + people icon, "Editar" (lime) + "Cancelar" (red) action buttons, and a scrollable list of block detail cards keyed off `reservedClass.blocks`.
**Block data:** `BLOCK_DATA` maps block names (e.g. `"UPPER BODY"`, `"FBA"`, `"MIDLINE"`) to gradient, modality badge, and movements list. Blocks are parsed from strings like `"1. UPPER BODY"` via `parseBlock()`.
**Animation:** slides in from the right (spring, same as `ProgrammingScreen`). z-index 65 (above ProgrammingScreen at 60).
**Triggered by:** tapping `ReservedClassCard` (which now calls `onTap`). Wired in `BiggDayScreen` via `classDetailOpen` + `detailClass` state.
**Bottom CTA:** "Iniciar clase" (lime, no-op) + when `onFinishClass` is passed, a secondary outlined "Finalizar clase" button below it — **provisional** stand-in for a real "class finished" trigger (none exists in the app yet); opens `ThankYouClassScreen`.

### `ThankYouClassScreen`
**File:** `src/app/components/ThankYouClassScreen.tsx`
**Props:** `reservedClass?: ReservedClass | null`, `onClose: () => void`
**Purpose:** Full-screen post-class "thank you" screen. Congratulatory header (check icon in dark circle + "¡Entrenamiento completado!" + class type/time/location if available, same gradient card treatment as `ClassDetailScreen`'s header), followed by the `ReferralContainer` as the screen's main CTA. "Cerrar" (top-right, X icon) calls `onClose` to return to the daily screen.
**Animation:** slides in from the right (spring, same params as `ClassDetailScreen`). z-index 66.
**Triggered by:** `ClassDetailScreen`'s provisional "Finalizar clase" button, via `onFinishClass` → `BiggDayScreen`'s `thankYouOpen` state. **Provisional** — no real post-class flow exists yet in the app.

### `ProfileScreen`
**File:** `src/app/components/ProfileScreen.tsx`
**Props:** `onClose: () => void`
**Purpose:** Full-screen profile screen — lightweight port of `biggapp/Screens/Profile/Profile.js` (real image-picker, i18n, sign-out/delete-account logic out of scope). Header: back nav "Volver" (same chevron SVG as `ClassDetailScreen`), circular avatar (`imgEllipse167`) with a `Pencil` edit badge overlapping bottom-right, name "Mateo", "Miembro desde 2023 · 4 amigos" line, decorative "Editar" pill. Below: `ObjetivoCard` (ported from `biggapp/Components/Objetives/Objetives.js`, "has objective" state only — dimmed photo background (`imgObjetivoPhoto`, i.e. `imgPerformanceImage`), "Objetivo" label, Druk uppercase goal title "GANAR FUERZA" + chevron, "Plan de entrenamiento: <underlined plan name>") and `MisPesosCard` (ported from `Components/Weights/Weights.js` — half-width `w-[47%]` since it has no pair here, `Dumbbell` icon + circular chevron button + "Mis Pesos" / "Ver todos" in `#888888`). Below those: two decorative static rows (Idioma with flag emoji, Cerrar sesión in red) + app version footer — inspired by, not a 1:1 port of, the real screen's tail.
**Animation:** slides in from the right (spring, same params as `ClassDetailScreen`/`ThankYouClassScreen`). z-index 67 (highest of the full-screen overlays).
**Triggered by:** the avatar button in `StickyHeader` (`Frame43` → `Frame14` → `StickyHeader`'s `onOpenProfile` prop), which is shared by both the Train and Actividad tabs — one wiring point covers both entry points. `BiggDayScreen`'s `profileOpen` state.

### `ActividadScreen`
**File:** `src/app/components/ActividadScreen.tsx`
**Props:** `onOpenProfile: () => void`, `onOpenFab: () => void`
**Purpose:** Standalone Actividad tab screen (2026-07-21 rebuild) — replaced a version that wrongly reused Train's `MainContent`/`DailyWorkoutCard` timeline plus a fabricated `MonthlyNPSGrid`. Ported instead from `biggapp`'s real Actividad page (`Screens/Activity/PerformanceActivity.js`, `Components/StrikeDays/*`, `Components/Activity/HealthMetrics.js`).
**Structure, top to bottom:**
  - **Own header** (`ActividadHeader`, not fixed — scrolls with content): avatar button (`onOpenProfile`) + centered bold "Actividad" title + circular "+" button (`onOpenFab`).
  - **`StrikeActividadModule`** — Semanal/Mensual toggle (lime pill on the active option) + "Ver historial" (decorative). Semanal: white card with a mock weekly bar chart (`WeeklyBarChart`, gridlines "1h 0m"/"0h 30m", L-M-M-J-V-S-D bars) + BLOQUES/MÁS ELEGIDO/TIEMPO ACTIVO stats row, capped by a green gradient motivational banner. Mensual: big Druk streak number + "Días de actividad" + a real calendar grid (`buildMonthGrid`, ported from `biggapp/Components/StrikeDays/StrikeMonth.js`'s algorithm — first/last week padded to Monday/Sunday with dimmed adjacent-month days) with mock "active" days (3, 7, 9, 11, 14, 16) in status-colored circles (see `DayRecapSheet` below). Holds `recapDate: Date | null` state (2026-07-21) shared by both views.
    - **Day tap → `DayRecapSheet` (2026-07-21):** every weekday bar in `WeeklyBarChart` (all 7 columns, including zero-height rest days) and every current-month day in the calendar grid (active-set or plain, but not the dimmed adjacent-month padding days, which are `disabled`) is a tappable `<button>` that opens `DayRecapSheet` for that real `Date`. `WeeklyBarChart`'s columns map to real dates via a new `WEEK_START` const (2026-07-20, the Monday of the mock "Jul. 20 - 26" range) + `getWeekDate(i)`, so the same calendar date shows a consistent recap whether tapped from the weekly bar or the monthly grid. Bar/circle fill color is `NPS_STATUS_META[status].color` (imported from `DailyWorkoutCard`) instead of uniform lime, computed by the same deterministic `getMockDayStatus`/`getMockDayFactors` used by the sheet itself.
  - **`DayRecapSheet` (new, 2026-07-21)** — reuses `DailyWorkoutCard`'s `NutritionEntry` "Así fue tu día" bottomsheet pattern (Druk title, status dot + label, 4-factor checklist with green-Check/red-ThumbsDown circles) but parameterized by `date: Date | null` instead of hardcoded to today. Props: `open`, `onClose`, `date`. Mock factors are deterministic per day-of-month (`getMockDayFactors`: `día%3≠0` entrenaste, `%4≠0` actividad, `%8≠0` dormiste, `%2≠0` comiste — divisors tuned so the existing mock-active day set and mock week both show a real green/yellow/red mix, not a uniform result) so reopening the same day always shows the same recap. No bottom CTA — dismiss-only (drag-down/backdrop tap), since unlike the nutrition-flow original there's nowhere for it to navigate to from here. Date label formatted via local `DAY_NAMES_ES`/`MONTH_NAMES_ES` arrays + `formatDayLabel()`, same pattern as `BiggDayScreen.tsx`'s `DAY_ABBRS_ES`/`MONTH_NAMES_ES` (not imported cross-file, per this repo's `components/`-never-imports-`screens/` convention).
  - **`MapaCorporalCard`** — full-width white card with a real body-silhouette SVG, path data ported 1:1 from `biggapp/Components/StrikeDays/BodyMapFront.tsx` (same `viewBox="0 0 135 263"`, same muscle-group `<path>` groups). Legs (quads + calves/tibialis) colored lime as a mock "recently trained" state; every other muscle group is the real app's neutral default gray `#D6D6D6`.
  - **`ActividadRecommendationsCarousel`** — the same Sueño/Pasos scroll-snap carousel as Train's `RecommendationsCarousel` (`ActividadSleepCard` without the Apple Health `SourceChip`, `ActividadStepsCard` with its Garmin `SourceChip` kept), last section on the page. **The section title "Recomendaciones basadas en tus hábitos" was removed 2026-07-21 at the user's explicit correction — the carousel/cards themselves were briefly deleted entirely in an earlier misread of the same request, then restored**; only the heading text is gone, the cards render directly under `MapaCorporalCard` with no label above them.
**Rendered in:** `BiggDayScreen`, `activeTab === "activity"` branch only.

### `ReferralContainer`
**File:** `src/app/components/ReferralContainer.tsx`
**Props:** none (self-contained, mock copy)
**Purpose:** Referral program promo card — icon in a lime circle (`ReferralIcon`), bold title "Programa de referidos" + body copy (`ReferralText`), lime pill CTA "Cambiale la vida a un amigo/a" (`ReferralButton`). Extracted from `BiggDayScreen.tsx` (where it used to render at the bottom of the daily timeline, in `MainContent`) so it could be reused. Now rendered exclusively inside `ThankYouClassScreen` (the daily timeline no longer shows it — see 2026-07-21 catchup entry).

<!-- Add new custom components below as they are created -->
