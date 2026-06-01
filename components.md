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
**Props:** `onReservar?: () => void` — called by both the "+Reservar Clase" header link and the lime "Reservar" card button
**State:** `activeTab: 'bigg-class' | 'home-gym' | 'outdoors'` — defaults to `'bigg-class'`
**Renders:** Section header ("Tu BIGG day recomendado" + "+Reservar Clase" link) + a two-layer card:
  - **Tab selector** (glassmorphism pill, white→lime gradient): 3 clickable tabs with icons. Active tab = full opacity + SemiBold + underline. Inactive = 30% opacity.
  - **Content area** (white→grey gradient): Druk_Wide title, two info chips, lime `#deffa3` "Reservar" CTA button, decorative rotated white diamond.
**Behavior:** Clicking a tab updates `activeTab`, swapping the title and chips. Transition: `opacity duration-200` on tab buttons.
**Mock data per tab:**
| Tab | Title | Chips |
|-----|-------|-------|
| BIGG Class | BIGG Class | 10:00AM, BIGG Recoleta |
| Home/Gym | Home / Gym | Flexible, En casa |
| Outdoors | Outdoors | 07:30AM, Palermo |
**Icons:** SVG paths from `src/imports/BiggDay/svg-03sgvqmew7` (`p23dee300`, `p1fab3c00`, `pbbc2500`). Reservar icon: `p2b363c00`.

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

<!-- Add new custom components below as they are created -->
