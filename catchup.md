# BIGG Mock — Session Log

> Newest entry at the top. Each entry must include: date, what changed, user-visible result, and **Source:** line.

---

## 2026-07-14 — BIGG Run Club: foto real + fix grey block + estilo BIGG MOVE

- **Fix**: se sacó del `RecommendationCard` genérico la capa "White cover below card" (`bg-[#ededed]` con `bottom:-16px`) que estaba pensada para un único card al final del timeline — al apilar Run Club + Mobility (mismo componente), ese div de 20px de alto quedaba visible como un bloque gris flotando debajo de cada card. No hacía falta: el resto de milestones del timeline no tienen ese hack y se ven bien.
- **`RunClubRecommendationCard` ahora es su propio componente** (dejó de reusar el `RecommendationCard` de gradient) — fusiona el mecanismo de esa card (borde punteado que se apaga al agregar, botón Agregar/Agregado, esquina conectora `borderTopLeftRadius: 7px`) con el tratamiento visual de `Group17`/BIGG MOVE (foto full-bleed + título fluido en `Fixture_Ultra:SemiBold` con `clamp()`, subtítulo debajo). Fondo: `bigg-run.jpg` provisto por el usuario (Downloads), redimensionado de 3840×2160/8.3MB a 1200px de ancho/~80KB con `sips`, copiado a `src/assets/bigg-run.jpg`. Overlay con gradient negro de abajo hacia arriba para legibilidad del texto blanco sobre la foto (clara, cielo de fondo).
- Verificado en Chrome (sábado): foto de fondo visible, título "BIGG RUN CLUB" + subtítulo, borde punteado blanco, botón Agregar → "Agregado!" funcional, sin el bloque gris debajo ni en Run Club ni en Mobility. Sin errores de consola.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-14 — Run Club como milestone dentro del timeline (miércoles y sábado)

- `AfternoonRecommendationCard` (Mobility) refactorizado a un componente genérico `RecommendationCard` ({title, chip, why, gradient}) para poder reusar exactamente el mismo patrón visual (borde punteado, gradient, `WhyLine`, botón Agregar) en otro contenido — confirmado con el usuario antes de implementar (`AskUserQuestion`): ambos días deben mostrar el mismo recomendado de "Run Club", no contenidos distintos.
- Nuevo `RunClubRecommendationCard` usa ese componente genérico con gradient celeste/azul (`rgba(74,144,217,...)`) para diferenciarlo de Mobility.
- Nuevo prop `DailyWorkoutCard.showRunClub` — renderiza el milestone "BIGG Run Club" (mismo estilo tab-connector que Mobility/Entrenamiento complementario) inmediatamente ARRIBA de "Mobility & recovery" dentro del timeline.
- **Miércoles**: ahora también muestra el milestone "BIGG Run Club" arriba de Mobility (antes no tenía contenido propio).
- **Sábado**: se sacó el banner standalone que vivía arriba de "Tu BIGG day" — el Run Club ahora vive DENTRO del timeline, en el mismo lugar (arriba de Mobility), consistente con miércoles. Sigue sin mostrar la card "Entrenamiento del día" ese día.
- Verificado en Chrome: miércoles y sábado muestran "BIGG Run Club" con el mismo look que Mobility, en el orden correcto; sábado sin banner top ni card de entrenamiento. Sin errores de consola.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-14 — Bloques rotativos por día, sábado sin BIGG workout card, domingo con clima integrado

- **Bloques de "Entrenamiento del día" rotan por día**: en vez de repetir siempre FBA/Upper Body/HIIT/Midline, cada día toma 4 títulos de un pool de 7 (`DAY_BLOCK_TITLE_POOL`: Strength, Hyrox, Cardio, Lower Body, Hypertrophy, Full Body, Pilates), con una ventana rotativa de 4 basada en `selectedDate.getDay()` (`getDayBlockTitles`). Hoy (el día real "actual" del mock) mantiene su plan específico sin cambios; el resto de los días muestra la rotación. Nuevo prop `DailyWorkoutCard.blockTitles` sobreescribe `V4_BLOCKS[i].bigg.stimulus` solo cuando está en una ubicación BIGG.
- **Sábado — Run Club arriba, sin card de entrenamiento**: el banner de BIGG Run Club se movió arriba de todo (antes de "Tu BIGG day"/timeline); `showMorning` ahora también se apaga los sábados (`!isRestDay && !isSaturday`), así que ese día no aparece la card "Entrenamiento del día".
- **Domingo — clima integrado en "Entrenamiento del día"**: se sacó el banner standalone de BIGG Outdoors; ahora `DailyWorkoutCard` recibe un prop `weatherNote` ({temp, caption}) que se renderiza DENTRO del milestone oscuro, entre el pill "Entrenamiento del día" y los bloques ("24° — Día ideal para entrenar afuera. Ver bloques de BIGG Outdoors").
- Verificado en Chrome: hoy sin cambios, lunes con Hyrox/Cardio/Lower Body/Hypertrophy, sábado con banner arriba y sin card de entrenamiento, domingo con el clima fusionado adentro del bloque oscuro. Sin errores de consola.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-14 — Correcciones: glow solo en el botón, SleepEntry vuelve al timeline, sueño/nutrición ocultos en días futuros

Tres correcciones directas sobre la entrega anterior (misma sesión), a pedido del usuario:

- **Glow solo en "Reservar clase"**: el pulso/glow del pedido anterior había quedado en la barra CTA completa (bg lime + botón "Donde vas a entrenar?" + "Reservar clase"). Revertido — la barra vuelve a ser un `<div>` plano; ahora es el `<button>` de "Reservar clase" el que es `motion.button`, con `scale` + `boxShadow` blanco pulsante (2.2s loop) solo alrededor de sí mismo, apagado en la variante "Iniciar entrenamiento".
- **`SleepEntry` vuelve a estar dentro del contenedor con la línea del timeline**: el fix anterior (sacarla afuera para evitar el "stub" de la línea asomando en su esquina) fue la corrección equivocada — el usuario aclaró que el timeline span debe arrancar DESDE "Dormiste...", no desde "Entrenamiento del día". Revertido: `SleepEntry` es de nuevo el primer ítem dentro de la lista con `gap-[24px]`, y la línea vertical arranca en su posición.
- **Sueño y nutrición ocultos en días futuros**: "Dormiste bien" reporta sobre la noche anterior y "¿Comiste bien hoy?" sobre el día en curso — no tiene sentido mostrarlos en miércoles/jueves/viernes u otro día que todavía no pasó. Nuevo prop `DailyWorkoutCard.isFutureDay` (pasado desde `MainContent` en `BiggDayScreen.tsx`); `showSleepContent`/`showNutritionContent` ahora chequean `!isFutureDay` además del filtro seleccionado.
- Verificado en Chrome: glow acotado al botón, línea arrancando en el sleep card en Mar 14 (hoy), sueño/nutrición ausentes en Mié 15 (día futuro) sin afectar Entrenamiento del día/Mobility/Wind down. Sin errores de consola.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-14 — CTA "Reservar clase" con glow, fix visual de SleepEntry, módulo unificado por día, Padel + Sport Specific, banners Sáb/Dom

- **"Reservar clase" más prominente**: la barra CTA (`cardVariant === 3`) pasa a `motion.div` con un `boxShadow` lime pulsante en loop (2.2s, ease-in-out) solo cuando `isBiggLocation` es true (o sea, cuando el texto es "Reservar clase", no "Iniciar entrenamiento") — se apaga automáticamente para la variante "away".
- **Fix real "Dormiste bien" tapado por la línea del timeline**: `SleepEntry` no tiene su propio `TimePill`/nodo, así que la línea vertical (que arranca en `top-0` del contenedor) pasaba literalmente por detrás de esa card y se veía un "stub" asomando en su esquina redondeada inferior. Fix: `SleepEntry` se sacó del contenedor con la línea — ahora vive como bloque standalone arriba del timeline conectado (con su propio `mb-[24px]`), consistente con no tener nodo propio.
- **Módulo unificado por día** (`BiggDayScreen.tsx`, `MainContent`): antes cada día tenía un render distinto (hoy = módulo completo; días pasados con `reservedClass` = branch viejo sin dark-box/header/filtros; días futuros = `cardVariant` default 1 en vez de 3; sin datos = placeholder "Sin actividad registrada"). Ahora TODOS los días renderizan el mismo `DailyWorkoutCard` con `cardVariant` consistente — solo cambian las `activities`/banners extra por día de semana (`selectedDate.getDay()`), no la estructura del módulo.
- **Padel + recomendación "Sport Specific" los lunes**: `MONDAY_ACTIVITIES` agrega una card de Padel (12:00-13:00hs) bajo "Entrenamiento complementario", seguida de una card addable "Sport Specific" bajo su propio pill "Recomendación" ("Bloques diseñados especialmente para ayudarte a rendir mejor en Padel"). Nuevo campo opcional `ActivityEntry.sectionLabel` para poder overridear el label del TimePill por entry (antes siempre decía "Entrenamiento complementario").
- **Banners de fin de semana**: sábado muestra un banner pill "Este sábado hay BIGG Run Club — sumate a correr con la comunidad"; domingo muestra una línea única (mismo patrón visual que "Dormiste bien") con ícono de sol, temperatura mockeada y "Día ideal para entrenar afuera. Ver bloques de BIGG Outdoors".
- Verificado en Chrome navegando Lun/Mar/Sáb/Dom: mismo módulo en todos, Padel+Sport Specific solo lunes, banners solo sáb/dom, sin errores de consola.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-14 — Filtro fix (vaul drag), gradient de Sueño, tab-connector en el timeline, chevron a Programación, fix Bloque 1

- **Bug real de filtros**: Sueño/Nutrición/Social no respondían al tap real en el bottom sheet de filtros (solo Todos/Entrenamiento funcionaban) — causa: vaul (Drawer) intercepta gestures de drag-to-dismiss sobre todo el contenido del sheet, tragándose el tap en filas alejadas del handle. Fix a nivel de `BottomSheet.tsx` (afecta TODOS los sheets de la app): `data-vaul-no-drag` en el wrapper scrolleable de `children`. Verificado con taps reales (no JS) en Sueño/Nutrición/Social — los 3 funcionan ahora.
- **Gradient de `SleepEntry`**: pasa de violeta claro a `linear-gradient(70deg, #1a2040 2%, #2e1e6e 74%)` — el mismo azul/índigo oscuro de la card "SUEÑO ANOCHE" en "Recomendaciones basadas en tus hábitos" (`SleepCard` en `BiggDayScreen.tsx`). Texto/ícono/thumbs pasan a blanco/`#7b9de8` para contraste.
- **Estilo "tab conectado"** replicado (a partir de un DOM editado por el usuario en DevTools) en Entrenamiento complementario, Mobility & recovery y Wind down: el `TimePill` de cada milestone se alarga hacia abajo (`paddingBottom: 20px`, esquinas inferiores cuadradas, `CONNECTED_PILL_STYLE` compartido) y la card de contenido se sube con `transform: translateY(-15px)` para quedar "enchufada" debajo del pill — borde de la card pasa a `#3d3d3d` con `borderTopLeftRadius: 7px` en el punto de unión (`ActivityCard` nuevo prop `connected`, aplicado solo en el uso del timeline principal, no en el de `reservedClass`; `AfternoonRecommendationCard` y `WindDownCard` actualizados en sus 4 capas).
- **Z-index explícito**: trama de fondo (`imgBgHome1` en `BiggDayScreen.tsx`) con `z-0`; wrapper de `MainContent` con `relative z-10` — garantiza que todo el timeline pinte arriba de la trama en vez de depender del orden de pintado accidental de CSS. Línea vertical del timeline: color `#c4c4c4` → `#3d3d3d`, ancho `1.5px` → `2.5px` (1px más gruesa).
- **Chevron a Programación**: nuevo botón con `ChevronRight` al lado de "Entrenamiento del día" (dentro del pill row) que llama a `onOpenProgramming` — abre `ProgrammingScreen` directo desde el timeline, sin pasar por el CTA "Reservar clase".
- **Fix "Bloque 1" sin borde en `ProgrammingScreen`**: el header de la pantalla (`bg-[#f5f5f5] pb-[20px]`) se solapa con el contenido scrolleable vía `-mt-[20px]` para eliminar el gap contra el chip strip — pero ese solape (con `z-10` en el header) tapaba el `borderTop` del primer `FlapRow` ("Bloque 1"), mientras Bloque 2+ sí lo mostraban por tener espacio natural arriba. Fix: `FlapRow` recibe prop `isFirst`; cuando es true, `marginTop: 20px` para que el borde del primer bloque quede fuera de la zona tapada por el header.
- Verificado todo en Chrome: filtros con taps reales, gradient de sueño, tab-connector visual en los 3 milestones, chevron abre Programación, Bloque 1 con borde igual a Bloque 2. Sin errores de consola.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-13 — DailyWorkoutCard: NutritionEntry (check-in de nutrición, mismo patrón que SleepEntry)

- Nuevo componente `NutritionEntry` — calca 1:1 el patrón de `SleepEntry`: card "¿Comiste bien hoy?" (ícono `Utensils`, acento naranja `#f2994a` para diferenciarlo del violeta de sueño) con thumbs up/down, toast fijo arriba del footer ("Nutrición guardada" + botón "Agregar detalles"), y `BottomSheet` con `SourceChip source="myfitnesspal"` + tags de digestión/energía (`NUTRITION_TAGS`: Hinchazón, Con energía, Antojos, Buena digestión, Pesadez) togglables.
- `SourceChip.tsx` — agregado nuevo `DataSource` "myfitnesspal" (`#f2994a`), mismo patrón que Strava/Garmin/Apple Health.
- Decisiones tomadas con el usuario antes de implementar: check-in simple sin macros (no resumen de calorías), fuente simulada (MyFitnessPal) en vez de sin-fuente, tags de digestión/energía (no de adherencia al plan), y visible siempre en "Todos" (no solo al filtrar por Nutrición) — se agregó al timeline entre "Mobility & recovery" y "Wind down".
- `showNutritionContent` nuevo en la lógica de filtros; el empty state ahora solo aplica a "Social" (Nutrición ya tiene contenido real).
- Verificado en Chrome: entry visible en "Todos", thumbs + toast + tags funcionan igual que en sueño, filtrar por "Nutrición" aísla correctamente solo esta card, sin errores de consola.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-13 — DailyWorkoutCard: header "Tu BIGG Day" + filtros, tags de recuperación, z-index/línea del timeline

- Se probó extender el estilo dark container de "Entrenamiento del día" a Entrenamiento complementario/Mobility/Wind down vía un componente `MilestoneShell` reutilizable — **revertido a pedido del usuario** ("for now"); esos tres bloques volvieron a su estilo original (TimePill + card suelta, sin container oscuro). Solo "Entrenamiento del día" conserva el dark container.
- Nuevo header arriba del timeline: "TU BIGG DAY" (font `MessinaSansWeb:Bold`, no Druk) + botón "Todos ⌄" a la derecha que abre un `BottomSheet` con 5 filtros (Todos / Entrenamiento & actividad / Sueño / Nutrición / Social). Seleccionar un filtro oculta/muestra las secciones del timeline acordemente (`showTrainingContent` / `showSleepContent`); Nutrición y Social — sin contenido modelado todavía — muestran un empty state ("Todavía no hay actividad de..."). El label del filtro trunca con ellipsis para no romper el layout con opciones largas.
- Bottom sheet de "Sueño de anoche": se sacaron las filas Sueño profundo/REM/Frecuencia cardíaca (quedan Duración y Calidad) y se agregó una sección de tags de recuperación muscular (`RECOVERY_TAGS`: Piernas cargadas, Espalda tensa, Hombros, Fatiga general, Sin molestias) — chips multi-select con estado local, pensados para trackear cómo llega el cuerpo día a día.
- Línea vertical del timeline: `w-[1px]` → `w-[1.5px]` + `z-0` explícito. Todos los wrappers de milestones (SleepEntry, Entrenamiento del día, complementario, mobility, wind-down, y las variantes del estado `reservedClass`) ahora tienen `relative z-10` explícito en su contenedor externo — antes dependía del orden de pintado accidental de CSS, ahora es robusto. El header "Tu BIGG Day" también lleva `relative z-10` para quedar por encima de la trama de fondo (`imgBgHome1`, position:absolute sin z-index propio) en `BiggDayScreen.tsx`.
- Verificado en Chrome: filtro abre/cierra el bottom sheet y oculta/muestra secciones correctamente, thumbs up/down + toast + "Agregar detalles" siguen funcionando, tags togglean estado, header no se corta contra la trama, sin errores de consola.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-13 — DailyWorkoutCard: rediseño "Entrenamiento del día" (dark container) + SleepEntry interactivo

- `DailyWorkoutCard.tsx` (`cardVariant === 3`, el default en uso) — milestone "Entrenamiento del día" reconstruido pixel-a-pixel a partir de un DOM editado por el usuario en Chrome DevTools: contenedor pasa de gris a `bg-[#3d3d3d]` con `border-radius: 20px` (sin gap); el `TimePill` de este milestone ahora recibe un override de estilo (`padding: 12.5px 20px; background-color: unset`) para fundirse con el container oscuro en vez de tener su propio pill oscuro; el wrapper del contenido pasa a padding `7.5px 7.5px` con `padding-top: 0`; el último flap ("Midline") pierde el radio en las 4 esquinas (antes redondeaba arriba y abajo) para quedar a ras del CTA; el CTA verde/oscuro pasa a `align-items: center`. Todos estos cambios quedaron condicionados a `cardVariant === 3` para no afectar las otras variantes del card.
- `SleepEntry` reescrito dos veces en esta sesión según feedback:
  1. Primer pase: card violeta con radio, thumbs up/down para aprobar/desaprobar la calidad, botón "Agregar detalles" inline, toast de confirmación y `BottomSheet` con detalle de sueño.
  2. Ajuste final: se sacó "Apple Health" y "Agregar detalles" de la fila inline — el texto ahora es una pregunta ("Dormiste 7h 12m — ¿Descansaste bien?"), toda la fila es tappable y abre el `BottomSheet` de detalle (que incluye el `SourceChip` de Apple Health adentro). El toast que aparece al tocar thumbs up/down ahora incluye el botón "Agregar detalles" (antes vivía en el componente del timeline) — tocarlo abre el mismo bottom sheet. Verificado en Chrome: toast fixed correctamente por encima del bottom nav, tap en la fila y tap en "Agregar detalles" del toast abren el sheet con duración/calidad/sueño profundo/REM/FC promedio.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-13 — DailyWorkoutCard: bg gris solo en el milestone "Entrenamiento del día"

- `DailyWorkoutCard.tsx` — primer intento aplicó `bg-[#ededed]` al contenedor de todo el timeline; corregido a pedido del usuario para que el gris viva únicamente en el wrapper del milestone "Entrenamiento del día" (time pill + card + CTA "Reservar clase"), mismo tono que las chips internas. El resto del timeline (sueño, entrenamiento complementario, mobility, wind-down) queda sin bg propio. Primer paso de una serie de cambios pendientes sobre este card.

**Source:** Claude Code — Macbook Pro

---

## 2026-07-13 — Timeline: entrada de sueño y wind-down

- `DailyWorkoutCard.tsx` — `SleepEntry`: fila compacta una línea al tope del timeline mostrando duración + calidad desde Apple Health (7h 12m, calidad buena).
- `WindDownCard`: card recomendación al fondo del timeline (antes del botón Agregar) — rutina nocturna 22:00hs con toggle + / check animado, tinte púrpura.

**Source:** Claude Code — Remote

---

## 2026-06-30 — BIGG World: sedes reales desde API

- `BiggWorldScreen.tsx` — Reemplazadas las 5 sedes hardcodeadas por fetch a `GET https://api.bigg.fit/available_locations` en un `useEffect` al montar. Token extraído del interceptor de bigg-eye.
- Respuesta mapeada al tipo `BiggLocation`: 68 sedes activas en 9 países (Argentina, España, Uruguay, Paraguay, Chile, Colombia, Perú, Panamá, Portugal).
- Países del filtro del sheet generados dinámicamente desde los datos reales (antes hardcodeado).
- City fallback mejorado: descarta valores nulos y `"-"`, cae a `country_name`.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-30 — BIGG World: fix scroll del contenedor principal

- `BiggDayScreen.tsx` — Root div cambia de `overflow-y-auto` a `overflow-y-hidden` cuando `activeTab === "perfil"`. Solo el bottom sheet y el mapa (Leaflet nativo) manejan su propio scroll.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-30 — BIGG World: mapa fullscreen, botón X, pins responsivos

- `BiggDayScreen.tsx` — Removido `pt-[40px]` del contenedor de BiggWorldScreen. El mapa ahora llega hasta el top sin gap ni texture del fondo.
- `BiggWorldScreen.tsx` — Botón X (top-right del sheet) para cerrar. El click en mapa/pin reabre. Fix de stale closure en event handlers de Leaflet vía `selectedIdRef`. Stop propagation en markers BIGG (antes el click propagaba al mapa y reseteaba selectedId).

**Source:** Claude Code — Macbook Pro

---

## 2026-06-30 — BIGG World: pins sin %, sheet a 0 real

- `BiggWorldScreen.tsx` — Venue markers reemplazados por dots simples (14px, sin texto %). Lime para unlocked, gris para locked, verde cuando selected.
- Sheet colapsa a `0px` (oculto totalmente) — mapa full screen real. Mapa click + pin click lo reabre. Handle solo cierra.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-30 — BIGG World: mapa gris, sheet colapsable, filtro "Todos"

- `BiggWorldScreen.tsx` — Tiles cambiados de CartoDB Dark Matter a CartoDB Positron (mapa gris claro).
- Bottom sheet colapsable: nuevo estado `sheetOpen`. Toca el drag handle → colapsa a 32px (solo la manija). Toca el mapa, la manija o un pin → reabre con transición CSS suave (0.35s cubic-bezier).
- Nuevo chip "Todos" (ícono Globe): muestra simultáneamente pins BIGG (sedes) y pills de descuento (venues) en el mapa.
- Tipo `MapFilter` extendido con `"all"`. Condición `showVenues = active === "beneficios" || active === "all"`.
- Importados `Globe` y `ChevronUp` de lucide-react.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-30 — BIGG World: mapa Leaflet interactivo + Club de Beneficios completo

- `BiggWorldScreen.tsx` — Reescritura completa. Reemplazado mapa CSS simulado por `MapContainer` de react-leaflet v4 con tiles CartoDB Positron (mapa gris real, sin API key). Downgrade react-leaflet 5→4 (v5 requiere React 19, el proyecto usa React 18).
- Marcadores BIGG: 5 sedes con `L.divIcon` (pill oscuro con texto lime). Siempre visibles.
- Marcadores de venues: aparecen solo en tab Beneficios. Muestran el descuento (10-20% off), estado locked si el tier no alcanza.
- Panel Sedes: 5 location cards con gradiente oscuro, badge de país, dirección. Country filter chips (TODOS / ARGENTINA / URUGUAY / PARAGUAY / CHILE / PERÚ).
- Panel Beneficios: header "Club de Beneficios" con progress bar (8/12 clases, Nivel 2 · 15% off), 11 venue cards horizontales scrolleables. Cada card: estado unlocked/locked por tier, sponsored workout badge (+5% extra), CTA "Usar beneficio".
- Al tocar un pin en el mapa → selecciona la card y hace scroll automático.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-29 — Bookmark icon en flap header de ProgrammingSection

- `ProgrammingSection.tsx` — Reemplazado `<img>` con URL de asset Figma (mostraba cuadrado gris) por `<Bookmark>` de lucide-react. Importado `Bookmark` de `lucide-react`. Ícono `size=18`, `strokeWidth=1.8`, color `#3d3d3d`.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-14 — Op4: location sheet antes de navegar a ProgrammingScreen

- `DailyWorkoutCard.tsx` — En variant 4, el CTA ("Ver entrenamiento del día") ya no navega directamente a ProgrammingScreen. Abre el location bottom sheet primero. Al seleccionar una ubicación, navega a ProgrammingScreen. El selector de location en la barra dark sigue funcionando independientemente (solo cambia ubicación, no navega). Implementado con flag `locationSheetFromCta` y handler `handleLocationSelect`.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-12 — Op3: CTA unificado estilo Op4 + duración en flaps

- `DailyWorkoutCard.tsx` — Op3 reemplaza el MapPin suelto + botón lime por un bloque unificado estilo Op4: location row (dark) + CTA button (lime/dark según ubicación), con `rounded-[14px] overflow-hidden`
- `FlapItem` — nuevo prop `duration?: string`; muestra la duración del bloque (15', 20'…) a la izquierda del chevron
- Variant 3 pasa `current.duration` a cada FlapItem para respetar la ubicación seleccionada

**Source:** Claude Code — Macbook Pro

---

## 2026-06-11 — Op4: CTA de acción debajo del selector de location

**Source:** Claude Code — Macbook Pro

**Change:** Op4 ahora muestra dos botones apilados: (1) selector de location dark gray `[📍 Donde vas a entrenar? BIGG Recoleta ∨]` que abre el sheet, y (2) CTA de acción lime ("Reservar clase") o dark ("Iniciar entrenamiento") según `isBiggLocation`. Documento comparativo actualizado para reflejar el cambio.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — Op4 CTA: envuelto en `div` con `gap-[10px]`, agregado botón CTA debajo del location selector
- `public/comparacion-opciones.html` — análisis Op4 actualizado (tags + pros/contras)

---

## 2026-06-11 — FAB más pequeño + Op4 CTA simplificado a location selector

**Source:** Claude Code — Macbook Pro

**Change:** FAB reducido de `size-[58px]` a `size-[46px]` con icono `Plus` 26→20px. CTA de Opción 4 simplificado: eliminado el botón de dos filas (Reservar clase + location), reemplazado por un único botón dark gray que muestra solo `[MapPin] Donde vas a entrenar? BIGG Recoleta [ChevronDown]` — con location y chevron en blanco underlined — y abre el location sheet al tocar.

**Files modified:**
- `src/app/components/FloatingActionButton.tsx` — `size-[58px]` → `size-[46px]`, icono `Plus` 26 → 20px
- `src/app/components/DailyWorkoutCard.tsx` — Op4 CTA: botón único de location (`Donde vas a entrenar?` + `{selectedLocation}` underlined + chevron); eliminada fila "Reservar clase"

---

## 2026-06-11 — Refactor menú + CTAs Op3/Op4 + documento comparativo interactivo

**Source:** Claude Code — Macbook Pro

**Change:** Cinco cambios en un solo ciclo. (1) Opción 1 eliminada del menú — `BottomTabId` pasa de 5 a 4 tabs; (2) Reordenamiento: Op3 → pos 1 (default), Op4 → pos 2, Op2 → pos 3, Comunidad → pos 4; (3) Opción 3 CTA: botón lime integrado dentro del card con flujo natural (sin `translateY` overlap), adentro del footer div con `px-[20px]`; (4) Opción 4 CTA: botón dark gray (`#3d3d3d`/blanco) que unifica Reservar + selector de location en dos filas — `Reservar clase` + `[MapPin] Donde vas a entrenar? BIGG Recoleta` underlined con tap separado que abre el location sheet; location del header row de v4 eliminada. (5) Documento comparativo `comparacion-opciones.html`: dark theme, tres phone-frames interactivos en paralelo con iframes `/?tab=op3|op4|op2` (requiere support de `?tab=` param en `BiggDayScreen`), más análisis de ventajas/trade-offs de cada opción.

**Files created:**
- `comparacion-opciones.html` — Documento comparativo dark, 3 iframes interactivos + análisis
- `public/comparacion/op2.png`, `op3.png`, `op4.png` — Screenshots de referencia (no usados en doc final)

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — Refactor CTA: v3 inline lime, v4 dark+location unificada; eliminado location selector de header de v4
- `src/app/screens/BiggDayScreen.tsx` — Eliminado `"train"` tab, nuevo orden BOTTOM_TABS, default `"world"`, `getInitialTab()` lee `?tab=` URL param

**Key notes:**
- `getInitialTab()` permite acceder a `/?tab=op3|op4|op2|community` para preseleccionar variante — usado en los iframes del doc comparativo
- La lógica del CTA de v4 mantiene el sub-tap con `stopPropagation` para el location sheet

---

## 2026-06-10 — UX Research doc: "¿Qué entreno hoy?" — referencias F45, Equinox, Barry's, Runna

**Source:** Claude Code — Macbook Pro

Reconstruido `training-ux-research.html` desde cero con las referencias correctas (F45, Equinox+, Barry's, Runna). Foco en recomendación del workout diario, no en booking. Screenshots reales descargados de App Store CDN a `/public/refero/`. Estructura: 5 secciones — El problema (3 confusiones de BIGG), Referencias reales (ref cards flex-row con screenshots), Comparativa (tabla scrollable), Patrones clave (grid 2col), Propuesta para BIGG (flow steps con tags NUEVO/REFACTORIZAR/MOVER).

---

## 2026-06-10 — DailyWorkoutCard: Opción 3 — animación de bloques + CTA secundario

**Source:** Claude Code — Macbook Pro

**Change:** Aplicados a Opción 3 los mismos cambios de animación de Opción 4: FlapItem ahora acepta `displayStimulus/stimulusKey/showAdaptIcon` en lugar de `isAdapted`. Al cambiar ubicación, los nombres de Upper Body → Push Pull y HIIT → Cardio animan con exit upward / enter from below (`AnimatePresence mode="wait"`). FBA mantiene nombre y hace fade-in del Sparkles icon. Midline sin cambio. CTA unificado: variantes 1 y 2 conservan el overlap lime; variantes 3 y 4 usan botón outline secundario (`mt-[20px] py-[15px]`) solo visible para ubicaciones BIGG.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — `FlapItem` props reemplazados (`isAdapted` → `displayStimulus/stimulusKey/showAdaptIcon`); nombre del flap en `AnimatePresence mode="wait"`; Sparkles con `AnimatePresence`; variant 3 map usa `V4_BLOCKS[i]` para computar adaptation; CTA unificado `cardVariant <= 2` = overlap, `>= 3` = outline

---

## 2026-06-10 — DailyWorkoutCard: Opción 4 — animación de bloques al cambiar ubicación

**Source:** Claude Code — Macbook Pro

**Change:** Solo algunos bloques cambian al salir de una sede BIGG: Upper Body → Push Pull (nombre + modality) y HIIT → Cardio (nombre + modality). FBA mantiene el nombre pero muestra ícono Sparkles cyan (los ejercicios adaptan). Midline no cambia. La transición es animada: el nombre sale hacia arriba (exit: y -9, opacity 0) y el nuevo entra desde abajo (initial: y 7, opacity 0 → animate: y 0, opacity 1) via `AnimatePresence mode="wait"` con key en el stimulus. El Sparkles de FBA hace fade-in/out con escala. CTA "Reservar clase" aumentado: `mt-[20px] py-[15px]`.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — `V4BlockDef` interface + `V4_BLOCKS` array (bigg/away/exercisesAdapt por bloque); variant 4 renderiza rows con `AnimatePresence mode="wait"` en el nombre y `AnimatePresence` en el Sparkles icon; CTA mt/py aumentados

---

## 2026-06-10 — DailyWorkoutCard: Opción 4 — separación entrenamiento/espacio, Reservar secundario

**Source:** Claude Code — Macbook Pro

**Change:** Nuevo `cardVariant={4}` que implementa el feedback de Gigio: (1) la ubicación sale del card y se muestra en la fila del header junto al "Entrenamiento del día" pill — MapPin pequeño + nombre + ChevronDown; (2) el card muestra los bloques como lista jerárquica (Druk Wide nombre + modality text + duración right-aligned, dividers sutiles) — sin tabs, sin chips, sin selección — se siente como un "plan" no un menú; (3) "Reservar clase" es un botón secundario outline debajo del card con flecha, no el CTA dominante verde. Tab "Perfil" renombrado a "Opción 4" en el bottom nav. "Train" renombrado a "Opción 1" para consistencia.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — `cardVariant` type extendido a `1 | 2 | 3 | 4`; bloque variant 4 con lista jerárquica + location en header row + CTA secundario outline; footer de variantes 1/2/3 condicionado a `cardVariant !== 4`
- `src/app/screens/BiggDayScreen.tsx` — `cardVariant` prop de MainContent extendido a incluir 4; tab "perfil" incluido en lista de tabs que renderizan MainContent; `handleScroll` corregido; tab labels actualizados (Opción 1–4)

---

## 2026-06-10 — DailyWorkoutCard: Opción 3 — location icon + adapted-block Sparkles + legend

**Source:** Claude Code — Macbook Pro

**Change:** Ubicación icon escalado de 16px a 20px. Los flaps de bloques adaptados (cuando la ubicación no es BIGG) muestran un ícono `Sparkles` cyan junto al ChevronDown en el header. El footer muestra una leyenda "Bloque cambiado para esta ubicación" con el mismo ícono cuando el variante es 3 y la ubicación no es BIGG — reemplaza el `WhyLine` genérico del footer. Los flaps BIGG (Reservar) no muestran ningun indicador de adaptación.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — `MapPin size={20}`; `FlapItem` acepta `isAdapted?: boolean` y muestra `<Sparkles size={13} className="text-[#2ab3cc]">` en el header row; footer v3 muestra leyenda cyan en lugar de WhyLine cuando `!isBiggLocation`

---

## 2026-06-10 — DailyWorkoutCard: CTA — paddingTop 56px (más overlap)

**Source:** Claude Code — Macbook Pro

**Change:** CTA `pt-[40px]` → `pt-[56px]`, `translateY(-40px)` → `translateY(-56px)`, `mb-[-40px]` → `mb-[-56px]`. El botón emerge aún más profundo desde bajo el card.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — CTA padding/translate/mb actualizados a 56px

---

## 2026-06-10 — DailyWorkoutCard: Opción 3 — flaps full-width, no top/horizontal padding on card

**Source:** Claude Code — Macbook Pro

**Change:** Para el variante 3, el content div del card usa solo `pb-[20px]` (sin top ni horizontal padding) para que los flaps lleguen hasta los bordes. WhyLine y location button quedan envueltos en un div con `px-[20px]` para mantener la sangría. Variantes 1 y 2 no cambian.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — padding condicional en content div: `p-[20px]` para v1/v2, `pb-[20px]` para v3; footer (WhyLine + location) en wrapper `px-[20px]` solo para v3

---

## 2026-06-10 — DailyWorkoutCard: Opción 3 — hide block title inside flap, remove green dot

**Source:** Claude Code — Macbook Pro

**Change:** En los flaps del variante 3, el `BlockCard` ya no repite el título (se muestra en el header del flap). También se quitó el punto verde del header. El `minHeight: 210px` del `BlockCard` se desactiva con `hideTitle` para que el card colapsado no tenga espacio vacío.

**Files modified:**
- `src/app/components/ProgrammingSection.tsx` — `BlockCard` acepta `hideTitle?: boolean`; envuelve el `<p>` del título en `{!hideTitle && ...}`; `minHeight` = `"auto"` cuando `hideTitle`
- `src/app/components/DailyWorkoutCard.tsx` — `FlapItem` elimina el dot verde; pasa `hideTitle` al `BlockCard` interno

---

## 2026-06-10 — DailyWorkoutCard: CTA — flat top, more overlap

**Source:** Claude Code — Macbook Pro

**Change:** CTA button: quitadas las esquinas superiores (`rounded-[16px]` → `rounded-b-[16px]`), `pt-[28px]` → `pt-[40px]`, `translateY(-16px)` → `translateY(-40px)`, `mb-[-16px]` → `mb-[-40px]`. El botón emerge del card sin borde superior redondeado y con todo el paddingTop oculto bajo el card.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — CTA `rounded-b-[16px]`, `pt-[40px]`, `translateY(-40px)`, `mb-[-40px]`

---

## 2026-06-10 — DailyWorkoutCard: Opción 3 — overlap + custom content, borders restored

**Source:** Claude Code — Macbook Pro

**Change:** Reescrito `FlapItem` desde cero: sin `background: white` (transparente), sin `BlockCard` interno. Contenido expandido custom: modality badge (10px gris uppercase) + lista de movimientos (MessinaSans Regular 13px). Overlap via `paddingBottom/marginTop: 12px` + `position: relative` + `zIndex: total - index`. Último flap (isLast) cierra con `borderBottom` + `borderBottomRadius: 14px`. Borde 3 lados en todos; borde completo + rounding inferior solo en el último.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — `FlapItem` reescrito; `FLAP_OVERLAP = 12`; `isLast` prop para border/radius inferior; sin `BlockCard` ni `background`

---

## 2026-06-10 — DailyWorkoutCard: Opción 3 flap styling — Druk Wide titles + ProgrammingSection borders

**Source:** Claude Code — Macbook Pro

**Change:** Refinados los flaps del card variante 3 para que coincidan visualmente con los flaps de ProgrammingScreen: cada flap tiene `borderTop + borderTopLeftRadius/Right: 14px` propio (en lugar del flat divider anterior), el font del título cambiado a `Druk_Wide:Medium` a 17px con tracking -0.5px, padding del botón aumentado a `py-[14px]`. Se agregó prop `isFirst` para omitir el borderTop en el primer ítem (los inline styles tienen mayor especificidad que `first:border-t-0`). Container del variante 3 simplificado a `flex flex-col w-full` sin borde ni overflow-hidden externo.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — `FlapItem` wrapper con inline `borderTop/borderTopLeftRadius/Right`; `isFirst?: boolean` prop para saltar el top border; título → `Druk_Wide:Medium text-[17px] tracking-[-0.5px]`; contenedor variante 3 sin `rounded overflow-hidden border bg-white`; `.map` con índice para pasar `isFirst={i === 0}`

---

## 2026-06-10 — DailyWorkoutCard: 3-variant comparison system (chips / BlockCards / accordion flaps)

**Source:** Claude Code — Macbook Pro

**Change:** Agregado sistema temporal de comparación de 3 propuestas del card "Entrenamiento del día". Los tabs Opción 2 y Opción 3 reemplazan Actividad y BIGG World en la barra de navegación (iconos iguales, labels cambiados). Cada tab renderiza `MainContent` con `cardVariant={1|2|3}`. Variante 1 = chips 2×2 (actual). Variante 2 = `BlockCard` completos apilados verticalmente (reutiliza el componente de ProgrammingSection con `fullWidth`). Variante 3 = lista de flaps acordeón (nombre + chevron que rota; tap expande `BlockCard` con spring animation). `StickyHeader` visible en los 3 tabs.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — prop `cardVariant?: 1 | 2 | 3`; constante `DAY_BLOCKS: StimulusBlock[]` con FBA/Upper Body/HIIT/Midline y sus movimientos; componente interno `FlapItem` (accordion row: lime dot + chevron rotatable + `AnimatePresence` height 0→auto); estado `selectedBlockId` (v2) y `openFlapId` (v3); content area renderiza según variante
- `src/app/screens/BiggDayScreen.tsx` — tabs "Actividad" → "Opción 2" / "BIGG World" → "Opción 3"; `MainContent` acepta `cardVariant`; los 3 tabs train comparten `<MainContent>` con `cardVariant` derivado del tab activo

**Key notes:**
- `DAY_BLOCKS` importa `BlockCard` y `StimulusBlock` de `ProgrammingSection.tsx` — sin duplicación
- Variante 2 usa `BlockCard fullWidth`; variante 3 envuelve `BlockCard` dentro de `FlapItem` con `overflow:hidden` en el `motion.div`
- Sistema es temporal para presentar propuestas al cliente; una vez elegida la variante, se eliminarán los otros tabs y se restaurarán los originales

---

## 2026-06-10 — DailyWorkoutCard: location header moved to bottom, conditional WhyLine, CTA translateY

**Source:** Claude Code — Macbook Pro

**Change:** Reorganized the recommendation card: chips grid at top, location selector moved to bottom of content area, WhyLine now only shown when location is non-BIGG (blocks adapted). Content area gets full `rounded-[20px]` and `pb-[24px]`. CTA button uses `translateY(-16px) + mb-[-16px]` instead of negative margin for the floating overlap effect, fully rounded (`rounded-[16px]`).

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — removed location button from top, added it at bottom of content div; WhyLine conditional on `!isBiggLocation`; content area `rounded-[20px]` + `pb-[24px]`; CTA `rounded-[16px]` with `transform: translateY(-16px)` + `mb-[-16px]`

---

## 2026-06-10 — DailyWorkoutCard: dynamic location picker (LocationSheet + AddLocationScreen)

**Source:** Claude Code — Macbook Pro

**Change:** Reemplazado el selector de tabs (BIGG Class / Freeride / BIGG Outdoors) por un header de ubicación interactivo. Tocar la ubicación abre un BottomSheet con todas las opciones; "Agregar ubicación" abre una pantalla full-screen para agregar lugares custom con equipamiento.

**Files created:**
- `src/app/components/LocationSheet.tsx` — vaul BottomSheet con filas de ubicación agrupadas (BIGG / Outdoors / Casa / Custom + Agregar), checkmark en activa, chevron en "Seleccionar BIGG"
- `src/app/components/AddLocationScreen.tsx` — pantalla slide-up (spring stiffness 320) con input de nombre + 12 chips de equipamiento + botones Cancelar / Guardar ubicación (disabled si sin nombre)

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — removido todo el código de tab selector (WorkoutTabId, WORKOUT_TABS, BiggClassIcon/HomeGymIcon/OutdoorsIcon, selector bar, diamond indicator, layout="size", AnimatePresence por tab); reemplazado por header `MapPin + selectedLocation + ChevronDown`; CTA cambia entre "Reservar clase" (lime, BIGG locations) e "Iniciar entrenamiento" (dark, resto); estado: selectedLocation, showLocationSheet, showAddLocation, customLocations

**Key notes:**
- `BIGG_LOCATIONS = new Set(["BIGG Recoleta", "BIGG Tortuguitas"])` controla cuándo mostrar el CTA de reserva
- LocationSheet y AddLocationScreen se renderizan al final del return, fuera del layout del card (portales/fixed)
- "Seleccionar BIGG" tiene chevron y cierra el sheet (placeholder para navegación futura)
- Custom locations guardadas en estado local; seleccionadas inmediatamente al guardar

---

## 2026-06-10 — ProgrammingScreen: lighter header bg, no gap at chip/bloque seam

Header wrapped in `bg-[#f5f5f5] relative z-10 pb-[20px]`; scroll area gets matching `bg-[#f5f5f5] -mt-[20px]` so content slides up under the header bg, eliminating the visible color-shift gap. Status bar spacer reduced 40px → 12px.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-10 — ProgrammingScreen: two-pill filter row + BIGG Class and Materiales bottom sheets

Replaced the mode-tabs row with two bordered pill selectors (BIGG Class ↓ / Materiales ↓) + search icon, matching Figma 23223:6967. BIGG Class pill opens a vaul bottom sheet with 4 options in a 2×2 grid (BIGG Class, BIGG Gym, Outside BIGG, BIGG Outdoors) — selected option highlighted lime + dark border, updates CTA. Materiales pill opens a sheet with "¿Qué equipamiento tenés?", 3-col equipment grid (8 items, tap-to-select lime bg) and a "Configurar qué elementos tengo en casa" decorative button. Pill label shows selected class name; Materiales pill shows count when any items selected.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-10 — DailyWorkoutCard: tab selector (BIGG Class / Libre / Outdoors) + animaciones + fix lag

**Source:** Claude Code — Macbook Pro

**Change:** El workout card ahora tiene un selector de modo en el fondo (dark bar) con 3 tabs y un indicador diamond animado. Se invirtió el orden (contenido arriba, selector en el medio, CTA abajo). Las animaciones se optimizaron para ser 100% GPU-composited (sin lag).

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — completo rediseño del card de recomendación:
  - Añadidos `WorkoutTabId`, `WorkoutTabData`, `WORKOUT_TABS`, `BASE_CHIPS` + iconos SVG por tab (BiggClassIcon, HomeGymIcon, OutdoorsIcon)
  - Layout invertido: bloque de contenido → selector de modo → CTA
  - Grilla 2×2 de bloques (`MessinaSansWeb:Bold` 15px); bloques cambiados se tintean lime
  - Fila de equipamiento condicional (solo tab "Libre")
  - Why line dinámica: "Cambiamos N bloques porque no tenés el equipamiento" en tabs non-BIGG
  - `"Home/Gym"` renombrado a `"Libre"` (más corto, más brand)
  - Indicador diamond: `motion.div layoutId="workout-tab-diamond"` inside botón activo → anima vía `transform` puro (GPU only, spring stiffness 500)
  - Content crossfade: `AnimatePresence mode="wait"` + variantes — exit 0.1s, luego height anima vía `layout="size"` spring, luego fade-in con `delay: 0.18s` (secuencia: fade-out → height → fade-in)
  - CTA background: CSS transition (`background 0.3s ease-in-out`) sin Framer Motion JS
  - **Fix lag**: se removió `motion.div layout` inicial (causaba layout recalculation) y `animate={{ left }}` del diamond (no GPU-composited). `layout="size"` es más liviano que `layout` — solo trackea dimensiones, no posición

**Key notes:**
- `layoutId` en Framer Motion anima entre posiciones usando `transform: translate()` — completamente GPU. No usar `animate={{ left/top }}` para sliders.
- Las esquinas redondeadas se manejan per-child (`rounded-t-[20px]` en content, `rounded-b-[20px]` en selector bar) en lugar de `overflow-clip` en el wrapper — permite que el diamond protruya hacia arriba.
- `"Libre"` cubre el concepto "afuera de BIGG, entrenás solo" — alternativas consideradas: "Por mi cuenta", "Tu gym", "Sin sede".

---

## 2026-06-10 — ProgrammingSection: ícono, chevron y label del flap mismo color (#3d3d3d)

"BLOQUE N", bookmark icon y chevron ahora son todos `#3d3d3d`. Ícono usa `filter: brightness(0) invert(1) brightness(0.24)` (0.24 ≈ 61/255 = `#3d3d3d`). Chevron usa `stroke="#3d3d3d"`. Verificado visualmente: los tres elementos son el mismo color.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-10 — "Sin actividad registrada": botón Agregar siempre visible

Los días pasados sin actividad ahora muestran el botón dashed "Agregar" debajo del estado vacío — mismo estilo que el botón al final del timeline (borde punteado, `+` icon, texto gris). Al tapearlo abre el FAB.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-10 — Timeline pills: se eliminó la referencia horaria

Los tres pills del timeline (`TimePill`) ya no muestran la hora — muestran directamente el nombre de la actividad: "Entrenamiento del día", "Entrenamiento complementario", "Mobility & recovery". Se eliminó el texto flotante a la derecha de cada pill (era redundante).

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ProgrammingSection flap headers: font MessinaSans + sin separador

Label "BLOQUE N" cambiado de `Druk_Wide:Medium` a `MessinaSansWeb:Bold` uppercase — consistente con el botón "Reservar clase". Removida la línea divisora de 1px entre el header y el área de cards.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ProgrammingScreen: 3 mode tabs + bottom CTA + unreserved card → Programming flow

**Source:** Claude Code — Macbook Pro

**Change:** Tapping the unreserved workout card body now opens ProgrammingScreen (instead of the reservation sheet directly). ProgrammingScreen gains 3 mutually exclusive mode tabs (BIGG Class, At Home/Gym, Outdoors) replacing the old 2-pill filter. A fixed bottom CTA shows "Reservar clase" (lime) in BIGG Class mode and "Iniciar entrenamiento" (dark) in the other modes. "Reservar clase" in ProgrammingScreen closes the screen and opens the reservation sheet.

**Files modified:**
- `src/app/components/ProgrammingScreen.tsx` — added `ProgrammingMode` type + `MODES` array; replaced 2-pill row with 3 mode tabs; added `activeMode` state; added `onReservar` prop; added fixed bottom CTA
- `src/app/components/DailyWorkoutCard.tsx` — added `onOpenProgramming` prop; unreserved card body div is now clickable (`cursor-pointer`, `onClick={onOpenProgramming}`)
- `src/app/screens/BiggDayScreen.tsx` — passes `onOpenProgramming={() => setProgrammingOpen(true)}` to MainContent + DailyWorkoutCard; passes `onReservar={() => { setProgrammingOpen(false); setReservarOpen(true); }}` to ProgrammingScreen

**Key notes:**
- The "Reservar clase" button on the card (below the card body) keeps its own `onReservar` → still goes directly to the reservation sheet
- Only the card BODY (above the button) triggers ProgrammingScreen via `onOpenProgramming`
- Mode tabs use dark (#3d3d3d) active state with white text; inactive uses transparent + border

---

## 2026-06-09 — ClassDetailScreen: slide-in detail for reserved classes

**Source:** Claude Code — Macbook Pro

**Change:** Created `ClassDetailScreen` — slides in from the right (z-65, spring animation) when tapping a `ReservedClassCard`. Adapts the biggapp Figma header (node 20114:16150) to the light Mock theme. Shows title-case block names via `BlockCard` (fullWidth), a "Ver todos" link that navigates to ProgrammingScreen, and a fixed "Iniciar clase" lime CTA at the bottom.

**Files created:**
- `src/app/components/ClassDetailScreen.tsx` — full screen with header card (white→lime gradient), attendee strip, Editar/Cancelar actions, block list, fixed bottom CTA

**Files modified:**
- `src/app/components/ProgrammingSection.tsx` — exported `StimulusBlock` interface and `BlockCard` component; added `fullWidth` prop to BlockCard
- `src/app/components/DailyWorkoutCard.tsx` — `ReservedClassCard` changed from div → button with `onTap` prop; added `onOpenDetail` to DailyWorkoutCardProps
- `src/app/screens/BiggDayScreen.tsx` — imported ClassDetailScreen; added `classDetailOpen` + `detailClass` state; AnimatePresence renders ClassDetailScreen with `onOpenProgramming` → close+open programming

---

## 2026-06-09 — ProgrammingSection flap headers: sin nombres ni conteo, ícono Figma + chevron

Headers simplificados: se quitaron subtítulo de estímulos y contador "N opciones". Lado derecho: ícono vectorial (Figma 22253:30055) + chevron rotativo. `borderBottom` removido — el `borderTop` redondeado de la siguiente fila actúa como separador natural.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ProgrammingSection: flaps con top rounded, cards sin color y reloj al borde

Flaps: `borderTop` redondeado (`border-radius: 14px` en esquinas superiores) en cada fila + `borderBottom` divisor. Cards: fondo `#f9f9f9` en lugar de gradientes de color; `pr-0` en el body y reloj SVG simplificado a `shrink-0` sin wrapper de ancho fijo — queda flush al borde derecho. Scroll container con `pl-[16px] pr-0` para alinear inicio de cards con eje de "BLOQUE 1".

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ProgrammingSection: filas siempre expandidas

`FlapRow` inicia con `isOpen = true` — los 4 bloques se muestran expandidos por defecto y el filtro de chips no los colapsa.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ProgrammingSection: 8 estímulos por bloque

Cada uno de los 4 BLOQUEs ahora tiene 8 cards — una por cada chip: `Lower Body`, `Upper Body`, `Full Body`, `HIIT`, `Cardio`, `Strenght`, `FBA`, `Hypertrophy`. Antes cada bloque tenía sólo 2-3 estímulos, lo que hacía que filtrar por "FBA" sólo mostrara 1 fila. Ahora cualquier chip muestra "1 opción" en los 4 BLOQUEs. Cada card tiene movimientos y modalidades propios del contexto de cada bloque (ej: Lower Body en BLOQUE 1 = Strength, en BLOQUE 4 = Mobility).

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ProgrammingSection flaps: full-screen, sin backgrounds ni sombras

Flaps van edge-to-edge (sin `mx`), sin background en header ni en área de cards, sin box-shadow ni border. Separadores como `border-bottom` 1px. El padding horizontal del filtro alineado a `px-[16px]` para coincidir con el inicio del label "BLOQUE 1".

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ProgrammingScreen: bloques como flaps acordeón

Cada fila de bloques (BLOQUE 1–4) ahora colapsa en un strip tipo "flap" que muestra label + lista de estímulos disponibles. Tap expande con animación spring revelando el scroll horizontal de cards. Header persistente: cuando un bloque está seleccionado, el flap colapsado muestra un pip lime + el estímulo y modalidad elegidos. Fondo del header usa el gradiente del primer card de esa fila. CTA "Agregar" aparece al pie solo cuando hay selección.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ClassDetailScreen: BlockCard reutilizado, título natural, CTA Iniciar clase

**Source:** Claude Code — Macbook Pro

**Change:** `ClassDetailScreen` refactorizado para reutilizar el componente `BlockCard` de `ProgrammingSection` (consistencia visual). Los títulos de bloque pasan a minúsculas ("upper body", "fba", "midline"). Título del header reformateado como oración natural. Agregados CTA fijo "Iniciar clase" (verde lima) y link "Ver todos" → `ProgrammingScreen`.

**Files modified:**
- `src/app/components/ProgrammingSection.tsx` — `StimulusBlock` y `BlockCard` exportados; prop `fullWidth?: boolean` agregada a `BlockCard` para uso en layout vertical (sin la anchura fija del scroll horizontal).
- `src/app/components/ClassDetailScreen.tsx` — Reemplazada `BlockDetailCard` propia por `BlockCard` importado con `fullWidth`. Stimulus names en lowercase via `.toLowerCase()`. Título reescrito como `"Clase de las {time} hoy en {location}"` (strip de "BIGG " del location). CTA "Iniciar clase" en barra fija `shrink-0` al pie. Link "Ver todos" junto al header de sección. Nueva prop `onOpenProgramming?: () => void`.
- `src/app/screens/BiggDayScreen.tsx` — `ClassDetailScreen` recibe `onOpenProgramming` que cierra el detalle y abre `ProgrammingScreen`.

**Key notes:**
- `fullWidth` en `BlockCard` sólo sobreescribe el `width`/`maxWidth` — el resto del layout (clock SVG, gradientes, selección) queda intacto.
- "Ver todos" cierra `ClassDetailScreen` antes de abrir `ProgrammingScreen` para evitar z-index stacking (65 + 60).
- Stimulus names en title case: `"UPPER BODY"` → `"Upper Body"` via `split(" ").map(capitalize).join(" ")`. "FBA" → "Fba" por ser 3 letras sin separador — aceptable en Druk Wide.

---

## 2026-06-09 — ClassDetailScreen: vista detalle de clase reservada

**Source:** Claude Code — Macbook Pro

**Change:** Nueva pantalla de detalle que se abre al tocar una `ReservedClassCard` (el estado post-reserva con bloques). Adapta el header de biggapp (Figma `20114:16150`) al sistema de colores claro del Mock. Muestra el header de la clase con el gradiente blanco→lima, fila de asistentes en fondo oscuro `#3d3d3d`, botones Editar (lima) y Cancelar (rojo), y una lista de block cards con movimientos por bloque.

**Files created:**
- `src/app/components/ClassDetailScreen.tsx` — Screen completo con header adaptado de Figma, `BlockDetailCard` con gradientes y movimientos por tipo de bloque (UPPER BODY, STRENGTH, FBA, MIDLINE, etc.), `BLOCK_DATA` map, animación spring slide-in desde la derecha. z-index 65 (sobre ProgrammingScreen).

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx` — `ReservedClassCard` convertida de `div` a `button` con prop `onTap?: () => void`. Agregada prop `onOpenDetail?` a `DailyWorkoutCardProps`, pasada a `ReservedClassCard`.
- `src/app/screens/BiggDayScreen.tsx` — Importado `ClassDetailScreen`. Agregados estados `classDetailOpen` y `detailClass`. `MainContent` recibe `onOpenDetail: (rc: ReservedClass) => void` y lo pasa a ambas instancias de `DailyWorkoutCard` (today + past days). `AnimatePresence` renderiza `ClassDetailScreen` cuando `classDetailOpen && detailClass`.
- `components.md` — Entrada agregada para `ClassDetailScreen`.

**Key notes:**
- Los bloques se parsean de strings como `"1. UPPER BODY"` → `{ num: 1, name: "UPPER BODY" }` via `parseBlock()`. `BLOCK_DATA` cubre los 12 tipos más comunes; fallback genérico para desconocidos.
- La `ReservedClassCard` ahora es un `button` completo (active:opacity-80) — mantiene el lápiz como indicador visual pero el tap abre el detalle, no edición directa.
- El SVG del reloj decorativo se reutiliza de `svgPaths` de `BiggDay` (mismo que en `BlockCard` de `ProgrammingSection`).

---

## 2026-06-09 — ProgrammingScreen: chip filters

`ProgrammingSection` — block stimulus names renamed to match chip labels exactly: `Lower Body`, `Upper Body`, `Full Body`, `HIIT`, `Cardio`, `Strenght`, `FBA`, `Hypertrophy`. Added `activeFilter?: string | null` prop; rows with no matching blocks are hidden when a filter is active. `ProgrammingScreen` now holds `activeFilter` state — tapping a chip activates it (lime highlight, dark green text), tapping again deselects back to all blocks.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — Timeline: labels de tipo de entrenamiento

`DailyWorkoutCard` — el pill "10AM" ahora muestra "Entrenamiento del día" (no itálica) y el pill "18:00hs" muestra "Entrenamiento complementario". Se quitó la itálica del label anterior ("BIGG Recoleta").

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — ProgrammingScreen: header Figma (BIGG TRAIN + filtros) con SVGs inline

`ProgrammingScreen` actualizado con el header exacto del nodo Figma `23238:6722`. Nav bar: flecha `←` (SVG inline) + "BIGG TRAIN" centrado (Druk_Wide:Medium 16px) + toggle de filtro (píldora oscura `#222` con ícono equalizer SVG). Sección de filtros: pills "BIGG Class" (pin SVG) y "3 Materiales" (barbell SVG) con chevron, lupa SVG. Strip horizontal de chips (FBA, Strenght, Upper Body, Lower Body, Hypertrophy, Cardio, HIIT, Full Body). Todos los íconos son SVG inline — sin imágenes externas.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-09 — Header: profile + greeting agrupados, logos justified

`Frame14` reestructurado: profile pic y "Hola Mateo!" en un mismo flex div (izquierda), logos en su propio div (derecha). Se agregó `w-full` al wrapper `ref={titleRowRef}` para que `justify-between` tenga espacio real contra el que trabajar.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-08 — BlockCard: título más grande, layout fix, Vite expuesto en red

Font size del título en `BlockCard` bumpeado a `28px` (títulos cortos) / `24px` (largos). Se removió `h-full` del body container (causaba comportamiento impredecible sin altura fija en el padre) y se agregó `justify-start` explícito tanto en el container como en la columna izquierda — contenido siempre anclado arriba. Vite config actualizado con `server: { host: true }` para exponer el dev server en la red local (`192.168.68.107:5173`) y permitir preview desde mobile.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-08 — BlockCard rediseñado para matchear el bloque de Pádel

`BlockCard` en `ProgrammingSection` refactorizado para replicar el layout de `WorkoutCard` (Pádel): columna izquierda (título Druk Wide + badge de modalidad + lista de movimientos) y columna derecha con el mismo SVG decorativo del reloj (`svgPaths` importado de `BiggDay`). Se eliminó el pill de duración del footer. Se removió el badge de "BLOQUE X" del card (el row label de arriba ya lo indica). Se limpiaron las props `rowLabel` e `isWarmup` de `BlockCard` que quedaron sin uso.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-05 — Racha de actividad real-time + días de entrenamiento del onboarding

`ActivityContainer` y la lógica de racha rediseñados para ser completamente reactivos a la fecha real. Se eliminaron los datos estáticos (`STREAK_DAYS`, `STREAK_COUNT`); reemplazados por `buildWeekStrip()` que computa el strip semanal desde `new Date()`. Se agregó `ONBOARDING_TRAINING_DAYS` (días elegidos en onboarding, actualmente L–S). Nuevos estados de punto: `done` (verde lleno), `today-training` (dashed negro — V hoy), `scheduled` (dashed lime — días futuros del onboarding), `past-rest` y `future-rest` (grises). El contador de racha calcula días consecutivos entrenados hacia atrás, ignorando los días de descanso. Se agregaron entradas a `PAST_DAYS` para 02–04 Jun para completar la racha de 4 días (L–J). Línea motivacional dinámica según si hoy es día de entreno o descanso.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-05 — Timeline unificado en Train: un solo timeline con BIGG Class a las 10AM

`DailyWorkoutCard` rediseñado: se eliminaron las secciones "Tu entrenamiento de hoy" (hero) y "Para completar tu día" (complementos separados), reemplazadas por un único timeline vertical (mismo patrón que la vista de clase reservada). Ahora el flujo es: `10AM` BIGG Class → `18:00hs` Running pasadas → `Afternoon` Mobility. Los tres usan el mismo patrón de recomendación: `WhyLine` inline dentro del cuerpo de la card, sin bandas separadas inferiores. `AfternoonRecommendationCard` simplificado: se eliminó la sección blanca inferior con `pt-[45px]` y el `mb-[-34px]`, moviendo el `WhyLine` al interior de la columna de contenido.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-08 — ProgrammingSection como pantalla completa (slide-in desde FAB)

Se reemplazó el `BottomSheet` de programación por un `ProgrammingScreen` de pantalla completa (`src/app/components/ProgrammingScreen.tsx`). Al tocar "Ver programación" en el FAB, la pantalla hace slide-in desde la derecha (spring animation con `motion/react` + `AnimatePresence`). Header fijo con flecha de vuelta + título "Programación". Se eliminó el título duplicado de `ProgrammingSection` (la sección ahora muestra solo el contador de seleccionados). Back button → slide-out de vuelta al home.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-05 — ProgrammingSection movida al FAB ("Ver programación")

Se quitó el WARMUP de `ProgrammingSection` y se eliminó la inserción inline en `BiggDayScreen`. En su lugar, el FAB ahora tiene una acción "Ver programación" (con ícono `CalendarDays`) como primera opción secundaria. Al tocarla, se abre un `BottomSheet` de 92vh con `ProgrammingSection` dentro — drag handle, scroll vertical, scroll horizontal por fila. Selección de bloques y CTA "Agregar N bloques" funciona dentro del sheet.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-05 — ProgrammingSection: bloques de estímulo horizontales (newProgramming)

Nuevo componente `ProgrammingSection` (`src/app/components/ProgrammingSection.tsx`) que replica la pantalla `newProgramming` de la biggapp en web. Estructura: 5 filas (`WARMUP` + `BLOQUE 1–4`), cada una con un scroll horizontal snap-to de tarjetas de estímulo (`Lower Body`, `Upper Body`, `HIIT Metabólico`, `Core & Midline`, `Mobility`, etc.). Al tocar una tarjeta: selección con animación lime-green + checkmark badge; al seleccionar cualquier bloque aparece un CTA verde `Agregar N bloques al entrenamiento`. Integrado en `BiggDayScreen` después del timeline `DailyWorkoutCard`, visible en todos los días.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-04 — Se quitaron las acciones rápidas (Reservar/Coach/Cargar)

Decisión de diseño: las acciones rápidas no terminaban de pegar con el header. Se probó moverlas al contenido y finalmente se eliminaron por completo. Se removió el componente `QuickActions` + `QUICK_ACTIONS`, el bottom sheet de contacto al coach (`coachOpen` state + sheet), la prop `onContactCoach` de `MainContent`/`StickyHeader`, y los imports lucide `CalendarPlus` / `MessageCircle` / `CirclePlus`. El `StickyHeader` vuelve a ser saludo + calendario, y `MainContent` recupera `pt-[197px]`.

Las acciones siguen accesibles: reservar vía el botón del hero, y "Contactar a Coach" / cargar actividad desde el FAB verde (`FloatingActionButton`, que ya las tenía).

Resultado visible: header más limpio, sin la fila de 3 pills. Verificado con build de producción (el bundle bajó ~3KB).

**Source:** Claude Code — Macbook Pro

---

## 2026-06-03 — Rediseño "Racha de actividad" (antes "Strike de actividad")

Se reescribió por completo el bloque de streak en `BiggDayScreen` (`ActivityContainer`). Antes: fila de 7 círculos con posiciones absolutas hardcodeadas (`ml-[157.15px]`, etc.) y un componente por día (frágil, no data-driven, sin número de racha). Ahora:
- **Número de racha grande** (Druk Wide 40px) + icono `Flame` + chip "Récord: 9 días".
- **Copy en español:** "Racha de actividad" (antes "Strike de actividad", que no era español correcto).
- **Strip semanal data-driven:** mapea `STREAK_DAYS` (estado `done` / `today` / `future`) en un `flex`; días cumplidos en lime con check, conectados por línea lime entre días consecutivos; "hoy" marcado con anillo punteado; futuros en gris.
- **Línea motivacional** con el mismo lenguaje *why* (cyan + `Sparkles`): "Llevás N días seguidos. Entrená hoy para no cortar la racha."
- Se eliminaron las funciones `Ellipse*` / `ActivityIcon*` / `RepeatGrid` / `ActivityGrid` / `ActivityContent` (todo el andamiaje de posiciones absolutas). Nuevo helper `StreakDot` + tipo `StreakState`.

Resultado visible: card de racha legible, motivadora y mantenible. Datos mock (`STREAK_COUNT=4`, `STREAK_RECORD=9`) fáciles de ajustar. Verificado en Chrome 390×844.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-03 — Fuentes externas: SourceChip (Strava / Garmin / Apple Health)

Nuevo componente reusable `src/app/components/SourceChip.tsx` para mostrar la proveniencia de datos importados de fuentes externas. Soporta `strava` / `garmin` / `apple-health` (label + color por fuente vía `SOURCE_META`), con `prefix` opcional ("Tomado desde" / "Datos de") y variante `onDark` para cards de fondo oscuro.

Aplicado en:
- **Timeline de actividad** (`ActivityCard` en `DailyWorkoutCard`): el tipo `ActivityEntry.source` se generalizó de `"strava"` a `DataSource`; el badge hardcodeado de Strava se reemplazó por `<SourceChip prefix="Tomado desde" />`. La actividad "Running" de días pasados sigue mostrando "Tomado desde Strava".
- **Card de Sueño** (`SleepCard`): chip "Datos de Apple Health" (variante `onDark`, sobre el fondo navy).
- **Card de Pasos** (`StepsCard`): chip "Datos de Garmin".

Resultado visible: las recomendaciones basadas en hábitos (sueño, pasos) ahora declaran de qué fuente externa salen sus datos, y el timeline de actividad usa el mismo lenguaje de proveniencia para cualquier fuente. Verificado en Chrome 390×844 (sueño, pasos y badge de Strava en día pasado).

Pendiente: conectar los datos reales de estas fuentes (hoy son mock) y un flujo de "conectar apps".

**Source:** Claude Code — Macbook Pro

---

## 2026-06-03 — Acciones rápidas fijas en el header (Reservar · Coach · Cargar)

Nuevo componente `QuickActions` en `BiggDayScreen`: barra de 3 acciones (Reservar / Coach / Cargar) con icono + label, renderizada dentro del `StickyHeader` debajo del `WeekCalendar`, así queda **fija** y siempre visible (al colapsar el header en scroll se oculta solo el saludo; calendario + acciones permanecen). Wiring: Reservar → `ReservarSheet`, Coach → nuevo bottom sheet de contacto (`coachOpen` state, avatar + "Enviar mensaje" + "Agendar sesión 1:1"), Cargar → overlay del FAB. Iconos lucide `CalendarPlus` / `MessageCircle` / `CirclePlus`. Se subió el `pt` del `MainContent` 197px → 253px para despejar el header más alto.

Resultado visible: acceso permanente a las 3 acciones clave desde cualquier punto del scroll del home. Verificado en Chrome 390×844 (estado normal, colapso en scroll, y apertura del sheet de Coach).

**Source:** Claude Code — Macbook Pro

---

## 2026-06-03 — Home redesign: clase como hero + complementos separados + "why" visible

Rediseño del home alineado a la reunión (recomendaciones diarias). En `DailyWorkoutCard` (vista no-reservada):
- **Filtros de espacio eliminados:** se quitó el tab switcher BIGG Class / Home/Gym / Outdoors (más sus iconos, `TABS`, `TabId`, `buildReservedClass` y el import de `svgPaths`). El home recomienda *qué* entrenar; el lugar se resuelve después en programación/reserva. La clase queda fija como BIGG Class (`MORNING_CLASS`).
- **Hero:** la clase pasa a ser la recomendación principal bajo el header "Tu entrenamiento de hoy / Tu recomendación principal" — título Druk Wide 32px + banda de *why* siempre visible + CTA "Reservar clase".
- **Complementos separados:** pasadas + Mobility se movieron a una sección aparte "Para completar tu día", en su propio timeline secundario debajo del hero.
- **"Why" en todas las recomendaciones:** se agregó `why` a `ClassData` y campo opcional `why` a `ActivityEntry` (render con icono `Sparkles` en cyan `#2ab3cc`, unificando el lenguaje del "porqué" que ya usaba el card de Mobility). La pasada de `TODAY_ACTIVITIES` ahora incluye su `why`.

Resultado visible: el home prioriza visualmente el entrenamiento del día con su justificación, y los complementos (movilidad, descanso, actividades) quedan subordinados y separados. Verificado en Chrome a 390×844.

Pendiente (próximas slices): acciones rápidas fijas (Reservar · Contactar coach · Cargar actividad), integración de fuentes externas (Strava/Garmin/Apple-Android Health) en el timeline y en las justificaciones.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — "Running pasadas" afternoon block for today

Added `TODAY_ACTIVITIES` constant in `BiggDayScreen` with a "Running pasadas" entry (18:00hs–19:00hs, lime-green gradient). Passed to today's `DailyWorkoutCard` via the `activities` prop. Extended `DailyWorkoutCard`'s non-reserved render path to display `activities` entries before the Mobility & recovery block (so activities appear in chronological order: morning workout → activities → afternoon recommendation → Agregar).

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Header: avatar left, "Hola Mateo!" + icons justify-between on right

Restructured `Frame14` / `Frame43` in `BiggDayScreen`: avatar stays on the far left; "Hola Mateo!" greeting and the three icons now share the right side of the header with `justify-between`, so the icons align flush to the right margin.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Reservar clase confirms into timeline; "Entrenar" CTA for non-class tabs

`ReservarSheet.onConfirm` now closes the sheet and sets `todayReservedClass` state in `BiggDayScreen`. `DailyWorkoutCard` receives this as `reservedClass` and fades into the reserved timeline view (time pill, `ReservedClassCard` with blocks/avatars, Agregar button). For Home/Gym and Outdoors tabs the CTA label changes to "Entrenar" and clicking it confirms directly — no sheet. The BIGG Class tab still goes through the `ReservarSheet` flow. Transition uses a `motion.div` fade-slide-in on the reserved branch.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Agregar button always visible after timeline

Fixed `DailyWorkoutCard`: the Agregar dashed button was nested inside the `showAfternoon` block, so Wednesday (`showMorning=true`, `showAfternoon=false`) never rendered it. Moved the button outside the conditional so it appears after all timeline entries on every day.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — SleepCard: "6h" moved to top-right, full-width bar chart

Moved the big "6h" number from the bottom-right of the chart row to the top-right (alongside the labels). Bar chart items now use `flex-1` instead of fixed `w-[20px]`, so the 7-bar chart stretches to fill the full card width.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Scroll-collapse sticky header (calendar-only strip)

On scroll, the `StickyHeader` translates upward using `scrollY` from the root scroll container. The "Hola Mateo!" greeting + icons row (`Frame14`) slides behind the status bar; only the week calendar days remain visible. `StatusBar` now has `backdrop-blur + bg-[rgba(255,255,255,0.85)]` so it visually covers the greeting as it slides up. Collapse amount is measured from a `ref` on `Frame14` (`frameHeight + 22px`) so it adapts if the row's height changes. The translate resets to 0 when switching tabs.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — StepsCard: progress bar + count display

Replaced the weekly bar chart in `StepsCard` with a horizontal progress bar (32% filled, green). Added `3.200 / 10.000` big-number display replacing the standalone step count. Scale labels `0` / `10.000` sit below the bar.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Bottom nav: border-bottom + reduced height

Added `border-b` to bottom nav and reduced height from `93px` to `70px` to remove excess padding below the tab labels.

**Files modified:** `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Carousel: narrower cards, fluid WorkoutCard layout, remove dashed borders

Reduced carousel card width from 88% → 76% so the next card is visible at a glance. Made `WorkoutCard` fluid: left column uses `flex-1 min-w-0` instead of fixed `w-[254px]`, right clock column reduced to `w-[50px]`, exercises drop to `text-[13px]`, badge auto-sizes. Removed dashed borders from all 4 recommendation cards.

**Files modified:** `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Sleep & Steps cards: bar charts, recommendations, remove Agregar

Redesigned SleepCard and StepsCard: added 7-day bar charts (last bar highlighted), a recommendation tip at the bottom, and removed the "Agregar a mi entrenamiento" button (meaningless for sleep/steps). Cards are now self-contained (no overlap shell). Lower Body card unchanged.

**Files modified:** `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Recommendations carousel: 4 cards with unified structure

Replaced the single Padel block with a horizontal scrollable carousel titled "Recomendaciones basadas en tus hábitos". Each card has a subtitle above it and an "Agregar a mi entrenamiento" button (same design as the Padel block).

**Cards:**
- **Padel** — amber gradient, same Figma block layout (badge, exercises, clock SVG, info Drawer). Subtitle: "Llegá mejor preparado a la cancha".
- **Sleep** — dark blue gradient, Figma-guided layout (uppercase labels top, big "6h" bottom right). Subtitle: "Dormiste menos de lo ideal".
- **Steps** — lime-green gradient matching Figma node 22253:29098 (labels top, "3.200" bottom right). Subtitle: "Movete más durante el día".
- **Lower Body** — white→#C2C2C2 gradient, same Padel block structure, exercises: Sentadillas con Pausa / Romanian Deadlift / Hip Thrust. Subtitle: "Balanceá tu entrenamiento".

Refactored `Frame42` + sub-components into reusable `WorkoutCard` + shared `AgregarButton`. Dot indicator tracks active card.

**Files modified:** `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Remove duplicate top Agregar + bottom Agregar z-fix

Removed the incorrectly added calendar-wide Agregar button from the top of MainContent. Agregar exists only at the bottom of the timeline (inside DailyWorkoutCard). Bottom button bumped to `z-[20]` so the vertical line doesn't bleed through.

**Files modified:** `src/app/screens/BiggDayScreen.tsx`, `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Calendar-wide Agregar button + bottom Agregar z-fix

Added full-width dashed "Agregar" button at the top of `MainContent` (below sticky header, before the timeline) that opens the FAB overlay. Also bumped the bottom timeline Agregar button from `z-10` → `z-[20]` so it definitively covers the vertical line.

**Files modified:** `src/app/screens/BiggDayScreen.tsx`, `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — AfternoonRecommendationCard: solid white bg behind opacity content

Added `absolute inset-0 bg-white rounded-[20px]` as first child of the outer relative wrapper, before dashed border and content. Solid white behind `opacity-0.55` content prevents grey page bleeding through.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Activity timeline entries: Padel Game + Running (Strava auto-import)

Added `ActivityEntry` interface (exported) and `ActivityCard` component to `DailyWorkoutCard`. `ActivityCard` supports: custom gradient, `timeRange` text inside the card, optional `source: "strava"` badge (orange pill "Tomado desde Strava"), and optional `addable` Agregar button with dark→lime toggle animation. Activity entries render as additional timeline nodes after the `ReservedClassCard`, each with their own time badge. Extended `PastDayData` with `activities?: ActivityEntry[]` and `DailyWorkoutCard` with `activities` prop. Pre-loaded 2026-06-01: Padel Game 12:00–13:00 (amber gradient), Running 16:30–17:15 (Strava, addable).

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`, `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Remove date header above timeline on non-today days

Removed the `{!isToday && (...)}` date header block ("Lunes 1 de junio" + "Recomendado" chip) from `MainContent`. All day views now go straight to "Tu BIGG day recomendado" without a date label above the timeline.

**Files modified:** `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline line: stops at bottom-0 + white cover z-20 clears gap

Vertical line changed from `bottom: -32px` → `bottom-0` (stops at component bottom, hidden behind opaque Agregar button). White cover in AfternoonRecommendationCard now uses `bottom: -16px, height: 20px, zIndex: 20` inline styles to reliably mask the line in the gap between the card and the Agregar button.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Thursday future view: Mobility-only (no morning workout)

Added `showMorning?: boolean` (default `true`) prop to `DailyWorkoutCard`. Thursday future branch now passes `showMorning={false} showAfternoon={true}` — shows only the Afternoon/Mobility timeline entry. Other future days keep `showMorning={true} showAfternoon={false}`. Rest-day blue pill still renders below the Mobility card on Thursday.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`, `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Common sections on all days + Agregar button on reserved-class timeline

Refactored `MainContent` from three early-return branches into a single-return layout. All days (today, past, future) now render the shared sections below the timeline: Strike de actividad (`ActivityContainer`), BIGG MOVE (`Group17`), Membresía premium (`MembershipContainer`), and Programa de referidos (`ReferralContainer`). The "Llegá mejor preparado a la cancha" + Padel block (`Frame42`) stays today-only. Also added the dashed "Agregar" `onOpenFab` button to the `reservedClass` render path in `DailyWorkoutCard`, matching the structure of the today timeline.

**Files modified:** `src/app/screens/BiggDayScreen.tsx`, `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Future day view: no afternoon block + Thursday rest-day pill

Future day recommendations no longer show the afternoon "Mobility" entry. Added `showAfternoon` prop (default `true`) to `DailyWorkoutCard` — future branch passes `showAfternoon={false}`. For Thursdays specifically (`selectedDate.getDay() === 4`), a blue blurred pill "Día de descanso recomendado" (moon icon, `bg-[#6ab5ff]/15 border border-[#6ab5ff]/30`) renders below the card.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`, `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Reserved class card for past days (Figma 22619:6112)

Added `ReservedClass` interface (exported) and two new sub-components to `DailyWorkoutCard`: `AttendeeAvatars` (6 overlapping gray circles + "+N" count) and `ReservedClassCard` (white→light-green gradient, backdrop-blur-50, Druk_Wide title, avatars row, workout block chips, pencil icon). When `DailyWorkoutCard` receives a `reservedClass` prop it renders this view instead of the tab-switcher — same timeline structure (vertical line + time badge + italic location label). Added `PAST_DAYS` lookup map in `BiggDayScreen` keyed by ISO date; updated `MainContent`'s past-day branch to render `DailyWorkoutCard reservedClass={...}` when data exists or fall back to "Sin actividad registrada". Pre-loaded 2026-06-01: BIGG Class @ BIGG Tortuguitas 8:30AM, blocks: UPPER BODY / STRENGTH / FBA / MIDLINE.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Calendar: future days clickable → pre-loaded recommendations view

Future days in `WeekCalendar` are now tappable (removed `isClickable = !isFuture` gate). Tapping a future day shows a "plan recomendado" view: date header (e.g. "Jueves 4 de junio") with a lime "Recomendado" chip, then the full `DailyWorkoutCard` timeline with workout tabs and Reservar CTA. Past days still show "Sin actividad registrada". Added `isFutureDay` prop through `MainContent` and computed it at the `BiggDayScreen` root. Also note: linter update added `ReservedClass` type import and a `PAST_DAYS` stub in `BiggDayScreen.tsx` (prep for past-day content).

**Files modified:** `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Calendar header: real dates + day switching

Replaced the 7 hardcoded day-cell components (`Frame17`–`Frame23`, `Frame13`) in the sticky header with a dynamic `WeekCalendar` component. The component computes the real Mon–Sun week from today's date, highlights today with the green pill, shows green activity dots on past days and gray on future, and disables future day taps. Added `selectedDate` / `today` state to `BiggDayScreen` and threaded it down through `StickyHeader` → `Frame36` → `WeekCalendar`. `MainContent` now receives `isToday` + `selectedDate`: when a past day is selected the timeline collapses to a dated header ("Lunes 1 de junio") with a "Sin actividad registrada" placeholder, ready for the user to pre-load content.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Reorder: Strike de actividad moved above BIGG MOVE

Swapped `ActivityContainer` (Strike de actividad) and `Group17` (BIGG MOVE) in the `BiggDayScreen` render list. New visible order: Padel block → Strike de actividad → BIGG MOVE → Membresía → Referidos.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Hide "Mejorá tu performance" block

Added `hidden` to the wrapper div around `PerformanceContainer` in `BiggDayScreen.tsx` (line ~1069). Block is preserved in code with a `TODO: re-enable` comment.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — AfternoonRecommendationCard: absolute white cover hides line in gap

Added `absolute bottom-[-10px] left-0 right-0 h-[12px] bg-[#ededed] z-[5]` div inside the outer `relative` wrapper of `AfternoonRecommendationCard`. This extends below the card's rounded bottom and masks the vertical timeline line in the gap between the card and the Agregar button. Removed the broken `-mt-[12px]` cover strip from the timeline.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline: cover strip hides gap line + Agregar button full opacity

Moved cover strip and "Agregar" button inside Entry 2's `flex-col gap-[10px]` (was a sibling with `gap-[24px]`). Cover strip uses `bg-[#ededed] h-[2px] -mt-[12px]` to mask the vertical line in the gap. Agregar button has `bg-[#ededed]` for full opacity.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline: dashed "Agregar" button opens FAB overlay + crash fix

Added full-width dashed "Agregar" button at the bottom of the timeline (after Afternoon card). Tapping it opens the FAB overlay (Reservar en BIGG Studios, etc.) via lifted `fabOpen` state in `BiggDayScreen`. `FloatingActionButton` now accepts optional `open`/`onOpenChange` props for controlled mode. Also fixed `getWeekDays` crash (null guard for undefined referenceDay from device-B calendar update).

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`, `src/app/components/FloatingActionButton.tsx`, `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Afternoon block: dashed border, reduced opacity, Agregar animation

`AfternoonRecommendationCard` now starts at `opacity-0.55`, animates to `opacity-1` on tap via `motion`. Dashed border lifted outside `overflow-clip` wrapper so it renders correctly. "Agregar" button swaps `Plus` → `Check` with spring animation (`stiffness:500`) and label changes to "Agregado!" using `AnimatePresence`. Badge renamed "afternoon" → "Afternoon". 10AM label updated from "Clase en BIGG Recoleta" → "Tu entrenamiento del día" (generic, agnostic to tab).

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline badges: italic description labels + rename 4PM → afternoon

Each badge row is now `flex-row items-center gap-[10px]`: pill + italic grey label beside it. 10AM → "Clase en BIGG Recoleta", afternoon → "Mobility & recovery". Removed "Tarde" label from inside AfternoonRecommendationCard.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline: second entry "4PM / Tarde" with Mobility recommendation

Added `AfternoonRecommendationCard` component based on Figma node 22619:6137. Second timeline entry (4PM badge) shows: "Tarde" label, "Mobility" title, "BIGG Soft Life" chip, "Agregar" (+) button, and a teal AI recommendation footer ("Cooldown recomendado…"). No Reservar CTA on this entry. Both entries share the same absolute vertical timeline line with a 32px tail below.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — DailyWorkoutCard wrapper: mb-[24px] to clear next section

Added `mb-[24px]` to the DailyWorkoutCard wrapper in `BiggDayScreen.tsx` to prevent the green Reservar button from overlapping "Llegá mejor preparado a la cancha".

**Files modified:** `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Reservar clase button: green bg, dark grey text

`bg-[#3d3d3d] text-white` → `bg-[#adff19] text-[#3d3d3d]`.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline: vertical line extends 32px below card

Changed `bottom-0` to `bottom: -32px` on the absolute vertical line so it visually extends past the "Reservar clase" button into the gap below.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline: flex-col layout, absolute vertical line

Restructured timeline entry to `flex-col items-start`: 10AM badge at top, card below it (full width). Vertical line is `absolute left-[22px] top-0 bottom-0` running behind both elements. Card takes 100% parent width, no side column offset.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Hide quick-action grid below BIGG MOVE

Added `hidden` class to `Frame41` (the white card containing Nueva entreno / Cargar actividad / Rutina de recover / Más opciones) in `BiggDayScreen.tsx`. Icons are preserved in code with a `TODO: re-enable` comment.

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — BIGG MOVE block: smaller card, title + subtitle always in view

Reduced the BIGG MOVE card height by switching from a natural-height image (`h-auto`) to a fixed `aspectRatio: "390 / 160"` container with the image as `object-cover`. Replaced absolute `top:%` text positioning with a flexbox column (`justify-center`, `gap-[6px]`) so "BIGG MOVE" and "Movilidad, Prehab y más" are always co-visible. Scaled down the title font-size (`clamp(28px, 14.5cqw, 56px)`).

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline: proper badge size + line stub above badge

Made the 10AM pill badge prominent (13px font, px-[12px] py-[6px]) to match Figma reference. Added a 14px line stub above the badge so the line runs both above and below it. Card top aligned with badge via `mt-[14px]`. Left column widened to 44px to contain the badge; card offset updated to `pl-[52px]`.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Timeline: absolute overlay, card takes full width

Replaced flex-row column layout with a `relative` container + absolute-positioned left timeline. Badge + vertical line are overlaid at `left:0` (16px wide), and the card uses `pl-[26px]` to take nearly the full parent width. Card is no longer constrained to ~90% of available space.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Reservar clase scoped inside right card block

Moved "Reservar clase" button from `BiggDayScreen.tsx` (full-width, outside card) into `DailyWorkoutCard.tsx` inside the right timeline column. Button now attaches to the bottom of the card block only and does not span the left timeline gutter.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`, `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — DailyWorkoutCard: timeline layout + dark Reservar button

Removed "+Reservar Clase" top-right button from the card header. Restructured component into a timeline row: left column (~10% width) shows a dark "10AM" pill badge + thin grey vertical line; right side holds the full card (~90% width). Bottom "Reservar clase" button changed from green (`#adff19`) to dark grey (`#3d3d3d`) with white text.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`, `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Diamond: slightly smaller + nudged up

`top: 52px` → `49px`, container `size-[25px]` → `size-[20px]`, diamond `size-[17.794px]` → `size-[14px]`.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Diamond indicator: tracks active tab at header/content seam

Moved diamond to the outer card wrapper at `top: 52px` (the visual seam between dark header and content). Color `#3d3d3d` matches header. Animates with `transition: left 0.2s` across three positions: BIGG Class → 16%, Home/Gym → 50%, Outdoors → 84%. Old fixed white diamond removed from inside content area.

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB button: thin light grey border

`border-[2.5px] border-[#3d3d3d]` → `border border-[#3d3d3d]/40` (1px, 40% opacity).

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB primary icons: dark grey circular border

Wrapped each primary option icon in a `size-[44px] rounded-full border border-[#3d3d3d]/30` circle.

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB overlay: updated labels + icons

Primary: "Reservar en BIGG Studios" (`Dumbbell`), "Reservar servicios" (`Sparkles`), "Contactar a Coach" (`MessageCircle`). Secondary: "Cargar actividad" (`Plus`), "Ver rutinas de BIGG Move" (`Layers`).

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB overlay: unified font size across both option tiers

Primary cards `text-[12px]` and secondary rows `text-[16px]` both set to `text-[14px]`.

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Reservar button: negative mt, extra pt, old square button removed

- Removed the square `#deffa3` Reservar button from inside `DailyWorkoutCard` content area
- Outer "Reservar clase" button: added `mt-[-10px]` (tucks under card) and `pt-[26px]` (extra top padding to compensate overlap)

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx`
- `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — DailyWorkoutCard: dark selector + full-width Reservar button below

**Selector:** Tab bar background changed from white-to-lime gradient to solid `#3d3d3d`. All icons and labels white. Inactive tabs at `opacity-40`.

**Reservar CTA:** Full-width `bg-[#adff19]` button ("Reservar clase") placed directly below the card with `rounded-bl-[20px] rounded-br-[20px]`, no gap between card and button. 4 quick-action buttons (`Frame41`) remain in their original scroll position.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx`
- `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — DailyWorkoutCard: dark selector + action buttons attached below

**Selector:** Tab bar background changed from white-to-lime gradient to solid `#3d3d3d`. All icons and labels updated to white (stroke/fill `white`). Inactive tabs at `opacity-40`.

**Action buttons:** `Frame41` moved from a separate scroll position to directly below `DailyWorkoutCard` with no gap — grouped in a `flex-col` wrapper. Border radius changed to `rounded-b-[20px]` only (top is flush against the card). Internal padding removed from the container; `Frame47` now spans full width with `justify-between`.

**Files modified:**
- `src/app/components/DailyWorkoutCard.tsx`
- `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB overlay: two-tier layout (3 primary cards + 2 secondary rows)

Primary options (Entrenar en BIGG Studios / Entrenar con un coach / Entrenar en un Evento) displayed as equal-width `flex-row` rectangles — icon centered on top, label centered below. Secondary options (Cargar actividad `Upload`, Ver rutinas de BIGG Move `Layers`) keep the full-width row style with icon + label + chevron. Stagger: secondary rows appear first (bottom-up), primary row last.

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB options: "Reservar" → "Entrenar" + new icons

Updated all three FAB overlay options to use "Entrenar" and matching icons: Entrenar en BIGG Studios (`Dumbbell`), Entrenar con un coach (`Users`), Entrenar en un Evento (`CalendarDays`).

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — DailyWorkoutCard tab titles updated

Updated mock titles for Home/Gym → "Bigg Workout" and Outdoors → "Bigg Outdoor Workout".

**Files modified:** `src/app/components/DailyWorkoutCard.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB options: icons + white/50 bg

Each FAB option now has a lucide icon on the left (`MapPin`, `Sparkles`, `CalendarDays`) and `bg-white/50` background so the blurred content shows through the cards too.

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB overlay blur reduced

`backdrop-blur-2xl bg-black/50` → `backdrop-blur-sm bg-black/30` so content is slightly visible through the overlay.

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — FAB overlay z-index: nav stays visible

Overlay z dropped from `z-[65]` → `z-[45]` so the bottom nav (`z-50`) renders above it. FAB button dropped from `z-[70]` → `z-[55]`. Sticky header (`z-40`) is still covered.

**Files modified:** `src/app/components/FloatingActionButton.tsx`

**Source:** Claude Code — Macbook Pro

---

## 2026-06-02 — Floating action button with global reservation overlay

Added a persistent green FAB button (bottom-right, above the bottom nav) that opens a full-screen blurred overlay with 3 reservation options. Visible on every tab.

**What changed:**
- Created `src/app/components/FloatingActionButton.tsx` — fixed `+` button (`bg-[#adff19]`, `rounded-full`, `size-[58px]`, `z-[70]`). On tap: `+` rotates 45° to `×` via Motion, and a `backdrop-blur-2xl bg-black/50` overlay (`z-[65]`) slides in. Options stagger up bottom-first (60ms each). Tapping backdrop or an option closes everything.
- Options: "Reservar en BIGG Studios", "Reservar servicios", "Reservar Eventos" — white `rounded-[18px]` cards, full width, chevron right.
- `BiggDayScreen` — added `<FloatingActionButton />` after `<BottomNav>` so it's always mounted regardless of active tab.

**Files created:**
- `src/app/components/FloatingActionButton.tsx`

**Files modified:**
- `src/app/screens/BiggDayScreen.tsx`

**Source:** Claude Code — Macbook Pro

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
