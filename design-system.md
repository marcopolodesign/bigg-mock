# Design System — BIGG Mock

Extracted from `src/styles/theme.css` and `src/styles/fonts.css`. Always check here before writing inline styles or new Tailwind classes.

---

## Typography

### Font Families

Fonts are registered using Figma Make's colon-separated convention — each weight is its own `font-family` name. Files live in `public/fonts/` (local, no CDN).

| Family name (CSS / Tailwind) | Source file | Notes |
|------------------------------|-------------|-------|
| `MessinaSansWeb:Bold` | `MessinaSansWeb-Bold.woff2` | Local ✓ |
| `MessinaSansWeb:SemiBold` | `MessinaSansWeb-Bold.woff2` | Mapped to Bold (no local SemiBold) |
| `MessinaSansWeb:Regular` | `MessinaSansWeb-Regular.woff2` | Local ✓ |
| `MessinaSansWeb:Book` | `MessinaSansWeb-Regular.woff2` | Mapped to Regular (no local Book) |
| `Druk_Wide:Medium` | `Druk-WideMedium.woff2` | Local ✓ |
| `Fixture_Ultra:SemiBold` | `FixtureUltra-SemiBold.woff2` | Local ✓ |
| `SF_Compact_Display:Semibold` | system font | iOS UI font, system only |
| `SF_UI_Text:Bold` | system font | iOS UI font, system only |

**Tailwind usage:** `font-['MessinaSansWeb:Bold',sans-serif]` (exact family name in brackets)

**Base font size:** `16px` (`--font-size`)  
**Font weight tokens:** `--font-weight-medium: 500`, `--font-weight-normal: 400`

### Type Scale (via theme.css @theme inline)

Standard Tailwind text scale applies: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.

---

## Color Tokens (CSS Custom Properties)

### Light Mode (`:root`)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#ffffff` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | Primary text |
| `--card` | `#ffffff` | Card background |
| `--card-foreground` | `oklch(0.145 0 0)` | Text on cards |
| `--primary` | `#030213` | Brand primary (near-black) |
| `--primary-foreground` | `oklch(1 0 0)` | Text on primary |
| `--secondary` | `oklch(0.95 0.0058 264.53)` | Secondary surface |
| `--secondary-foreground` | `#030213` | Text on secondary |
| `--muted` | `#ececf0` | Muted backgrounds |
| `--muted-foreground` | `#717182` | Muted text |
| `--accent` | `#e9ebef` | Accent hover/highlight |
| `--accent-foreground` | `#030213` | Text on accent |
| `--destructive` | `#d4183d` | Error / destructive |
| `--destructive-foreground` | `#ffffff` | Text on destructive |
| `--border` | `rgba(0,0,0,0.1)` | Default border |
| `--input-background` | `#f3f3f5` | Form input fill |
| `--switch-background` | `#cbced4` | Toggle/switch track |
| `--ring` | `oklch(0.708 0 0)` | Focus ring |
| `--radius` | `0.625rem` | Base border radius |

### Dark Mode (`.dark`)

All tokens are overridden for dark mode. Key differences:

| Token | Dark value |
|-------|-----------|
| `--background` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.985 0 0)` |
| `--muted` | `oklch(0.269 0 0)` |
| `--border` | `oklch(0.269 0 0)` |

### Chart Colors

| Token | Light | Dark |
|-------|-------|------|
| `--chart-1` | `oklch(0.646 0.222 41.116)` | `oklch(0.488 0.243 264.376)` |
| `--chart-2` | `oklch(0.6 0.118 184.704)` | `oklch(0.696 0.17 162.48)` |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | `oklch(0.769 0.188 70.08)` |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | `oklch(0.627 0.265 303.9)` |
| `--chart-5` | `oklch(0.769 0.188 70.08)` | `oklch(0.645 0.246 16.439)` |

---

## Border Radius

| Token | Value | Tailwind |
|-------|-------|---------|
| `--radius-sm` | `calc(var(--radius) - 4px)` ≈ `0.375rem` | `rounded-sm` |
| `--radius-md` | `calc(var(--radius) - 2px)` ≈ `0.5rem` | `rounded-md` |
| `--radius-lg` | `var(--radius)` = `0.625rem` | `rounded-lg` |
| `--radius-xl` | `calc(var(--radius) + 4px)` ≈ `0.875rem` | `rounded-xl` |

---

## Tailwind Usage Notes

- Tokens are exposed as Tailwind colors via `@theme inline` in `theme.css`. Use `bg-background`, `text-foreground`, `border-border`, etc.
- For sidebar tokens: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary`, etc.
- Focus rings: `outline-ring/50` is set globally on all elements.

---

## Common Patterns from Figma Screens

### BiggDay screen
- Body text: `text-[#3d3d3d]`, `text-[#565656]`
- Headings: `font-['MessinaSansWeb:Bold']`, `text-[18px]`, `tracking-[-0.45px]`
- Labels: `font-['MessinaSansWeb:SemiBold']`, `text-[13px]`, `tracking-[-0.325px]`
- Tight negative tracking is a BIGG brand characteristic — always apply `tracking-[-0.Xpx]` matching Figma values.
- `[text-box-edge:cap_alphabetic]` + `[text-box-trim:trim-both]` are used for precise vertical text alignment (match Figma).
