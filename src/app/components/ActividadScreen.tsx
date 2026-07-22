import { useCallback, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, Check, History, Plus, Sparkles, ThumbsDown } from "lucide-react";
import imgEllipse167 from "../../imports/BiggDay/0bdccca1063fe17c8030deb1278cb4c21c493290.png";
import BottomSheet from "./BottomSheet";
import SourceChip from "./SourceChip";
import { NPS_STATUS_META, type NPSStatus } from "./DailyWorkoutCard";

// Standalone Actividad tab — rebuilt to match biggapp's real Actividad page
// (Strike de Actividad weekly/monthly module + Mapa corporal + habit recommendations).
// Does NOT reuse StickyHeader/MainContent from BiggDayScreen (those are Train-tab only) —
// it has its own non-fixed header since there's no week-calendar date picker here.

const LIME = "#adff19";
const MUSCLE_GRAY = "#D6D6D6";

interface ActividadScreenProps {
  onOpenProfile: () => void;
  onOpenFab: () => void;
}

export default function ActividadScreen({ onOpenProfile, onOpenFab }: ActividadScreenProps) {
  return (
    <div className="flex flex-col gap-[28px] items-center w-full px-[20px] pt-[70px]">
      <ActividadHeader onOpenProfile={onOpenProfile} onOpenFab={onOpenFab} />
      <div className="w-full max-w-[388px]">
        <StrikeActividadModule />
      </div>
      <div className="w-full max-w-[388px]">
        <MapaCorporalCard />
      </div>
      <div className="w-full max-w-[388px]">
        <ActividadRecommendationsCarousel />
      </div>
    </div>
  );
}

// ─── Header: avatar · "Actividad" · + button ────────────────────────────────

function ActividadHeader({ onOpenProfile, onOpenFab }: { onOpenProfile: () => void; onOpenFab: () => void }) {
  return (
    <div className="w-full max-w-[388px] flex items-center justify-between">
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label="Abrir perfil"
        className="relative shrink-0 size-[38px] rounded-full active:opacity-70 transition-opacity"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full rounded-full" height="38" src={imgEllipse167} width="38" />
      </button>
      <p className="flex-1 text-center font-['MessinaSansWeb:Bold',sans-serif] text-[18px] text-[#3d3d3d] tracking-[-0.45px]">
        Actividad
      </p>
      <button
        type="button"
        onClick={onOpenFab}
        aria-label="Agregar"
        className="shrink-0 size-[38px] rounded-full border border-[#a3a3a3] flex items-center justify-center active:opacity-70 transition-opacity"
      >
        <Plus size={17} strokeWidth={2} className="text-[#565656]" />
      </button>
    </div>
  );
}

// ─── Strike de Actividad — Semanal / Mensual toggle module ──────────────────

const WEEK_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];
// Mock weekly bar data (minutes) — modest bar under the first Miércoles, taller one under Jueves.
const WEEK_BAR_MINUTES = [0, 22, 0, 55, 0, 0, 0];
const CHART_MAX_MIN = 60; // "1h 0m" gridline (bottom gridline reads "0h 30m", the chart's midpoint)

// Mock "active" days-of-month for the monthly calendar (mirrors biggapp's StrikeMonth data shape).
const ACTIVE_DAYS_MOCK = new Set([3, 7, 9, 11, 14, 16]);

// Monday of the week currently shown by the Semanal view's static "Jul. 20 - 26" label —
// used to derive a real Date for each weekday bar/column so its recap sheet has a real day.
const WEEK_START = new Date(2026, 6, 20); // 2026-07-20 (Monday)

function getWeekDate(index: number): Date {
  const d = new Date(WEEK_START);
  d.setDate(d.getDate() + index);
  return d;
}

const DAY_NAMES_ES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTH_NAMES_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function formatDayLabel(date: Date): string {
  return `${DAY_NAMES_ES[date.getDay()]} ${date.getDate()} de ${MONTH_NAMES_ES[date.getMonth()]}`;
}

// Deterministic mock day-status — same idea as DailyWorkoutCard's NutritionEntry recap
// (4 boolean factors → positiveCount → NPSStatus), but here every day (past or mock-active)
// needs a plausible recap, so the factors are derived from the day-of-month via modulo
// instead of real state. Divisors were chosen so the existing mock "active" day set
// (3, 7, 9, 11, 14, 16) and the current mock week (Jul 20-26) both produce a visible mix
// of green/yellow/red, not a uniform result.
function getMockDayFactors(date: Date): { label: string; positive: boolean }[] {
  const day = date.getDate();
  return [
    { label: "Entrenaste lo recomendado", positive: day % 3 !== 0 },
    { label: "Hiciste actividad", positive: day % 4 !== 0 },
    { label: "Dormiste bien", positive: day % 8 !== 0 },
    { label: "Comiste bien", positive: day % 2 !== 0 },
  ];
}

function getMockDayStatus(date: Date): NPSStatus {
  const factors = getMockDayFactors(date);
  const positiveCount = factors.filter((f) => f.positive).length;
  return positiveCount === 4 ? "green" : positiveCount >= 2 ? "yellow" : "red";
}

function isoWeekday(d: Date): number {
  // Monday = 1 … Sunday = 7
  const wd = d.getDay();
  return wd === 0 ? 7 : wd;
}

interface CalDay {
  date: Date;
  inMonth: boolean;
  dayOfMonth: number;
}

// Builds a Monday-start, Sunday-end week grid for the given month, padding with
// trailing days of the previous/next month — same algorithm as biggapp's StrikeMonth.js.
function buildMonthGrid(monthDate: Date): CalDay[][] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const days: CalDay[] = [];

  const leadCount = isoWeekday(first) - 1;
  for (let i = leadCount; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push({ date: d, inMonth: false, dayOfMonth: d.getDate() });
  }

  for (let dom = 1; dom <= last.getDate(); dom++) {
    days.push({ date: new Date(year, month, dom), inMonth: true, dayOfMonth: dom });
  }

  const trailCount = 7 - isoWeekday(last);
  for (let i = 1; i <= trailCount; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, inMonth: false, dayOfMonth: d.getDate() });
  }

  const weeks: CalDay[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

const MONTH_LABEL = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" });

function StrikeActividadModule() {
  const [period, setPeriod] = useState<"Semanal" | "Mensual">("Semanal");
  const monthWeeks = buildMonthGrid(new Date());
  const [recapDate, setRecapDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col gap-[14px] w-full">
      {/* Header row */}
      <div className="flex items-center justify-between w-full">
        <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.5px]">
          Strike de Actividad
        </p>
        <button type="button" onClick={() => {}} className="flex items-center gap-[6px] active:opacity-70 transition-opacity">
          <History size={14} className="text-[#3d3d3d]" strokeWidth={1.75} />
          <span className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px] underline">
            Ver historial
          </span>
        </button>
      </div>

      {/* Segmented control + date-range label */}
      <div className="flex items-center justify-between w-full gap-[10px]">
        <div className="flex items-center bg-[#f2f2f2] rounded-full p-[3px] shrink-0">
          {(["Semanal", "Mensual"] as const).map((opt) => {
            const active = period === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setPeriod(opt)}
                className="px-[14px] py-[7px] rounded-full transition-colors active:opacity-80"
                style={{ background: active ? LIME : "transparent" }}
              >
                <span
                  className={`text-[13px] tracking-[-0.26px] ${active ? "font-['MessinaSansWeb:Bold',sans-serif]" : "font-['MessinaSansWeb:Regular',sans-serif]"}`}
                  style={{ color: "#3d3d3d" }}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => {}} className="flex items-center gap-[4px] min-w-0 active:opacity-70 transition-opacity">
          <span className="truncate font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#565656] tracking-[-0.26px]">
            {period === "Semanal" ? "Jul. 20 - 26" : MONTH_LABEL}
          </span>
          <ChevronDown size={13} className="text-[#565656] shrink-0" strokeWidth={2} />
        </button>
      </div>

      {period === "Semanal" ? (
        <div className="flex flex-col w-full">
          <div
            className="w-full bg-white rounded-t-[20px] p-[20px] flex flex-col gap-[18px]"
            style={{ border: "1px solid #f0f0f0", borderBottom: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}
          >
            <WeeklyBarChart onDayTap={setRecapDate} />
            <div className="flex items-start justify-between w-full">
              {[
                { label: "BLOQUES", value: "4" },
                { label: "MÁS ELEGIDO", value: "FBA" },
                { label: "TIEMPO ACTIVO", value: "2h 15m" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-[4px] items-center flex-1">
                  <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[10px] text-[#a3a3a3] tracking-[0.6px] uppercase">
                    {stat.label}
                  </p>
                  <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[16px] text-[#3d3d3d] tracking-[-0.4px]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            className="w-full rounded-b-[20px] px-[18px] py-[16px] flex items-center gap-[10px]"
            style={{ backgroundImage: "linear-gradient(135deg, #DEFFA3 0%, #1EA05A 100%)" }}
          >
            <Sparkles size={18} className="text-white shrink-0" strokeWidth={2} />
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-white tracking-[-0.26px] leading-[1.35]">
              Esta semana llevás 4 actividades — vas mejor que la semana pasada. ¡Seguí así!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-[6px] w-full bg-white rounded-[20px] p-[20px]" style={{ border: "1px solid #f0f0f0", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[65px] text-[#3d3d3d] leading-[0.9] tracking-[-2.5px]">
            6
          </p>
          <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px] mb-[16px]">
            Días de actividad
          </p>

          <div className="flex items-center justify-between w-full px-[2px]">
            {WEEK_LETTERS.map((l, i) => (
              <span key={i} className="flex-1 text-center font-['MessinaSansWeb:Bold',sans-serif] text-[12px] text-[#3d3d3d] opacity-60">
                {l}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-[8px] w-full mt-[6px]">
            {monthWeeks.map((week, wi) => (
              <div key={wi} className="flex items-center justify-between w-full">
                {week.map((day, di) => {
                  const isActive = day.inMonth && ACTIVE_DAYS_MOCK.has(day.dayOfMonth);
                  const fill = isActive ? NPS_STATUS_META[getMockDayStatus(day.date)].color : "transparent";
                  return (
                    <div key={di} className="flex-1 flex items-center justify-center">
                      <button
                        type="button"
                        disabled={!day.inMonth}
                        onClick={() => setRecapDate(day.date)}
                        aria-label={`Ver recap del ${day.dayOfMonth}`}
                        className="flex items-center justify-center size-[30px] rounded-full active:opacity-70 transition-opacity disabled:cursor-default"
                        style={{ background: fill, opacity: day.inMonth ? 1 : 0.35 }}
                      >
                        <span
                          className={`text-[13px] tracking-[-0.26px] ${isActive ? "font-['MessinaSansWeb:Bold',sans-serif]" : "font-['MessinaSansWeb:Regular',sans-serif]"}`}
                          style={{ color: "#3d3d3d" }}
                        >
                          {day.dayOfMonth}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      <DayRecapSheet open={recapDate !== null} onClose={() => setRecapDate(null)} date={recapDate} />
    </div>
  );
}

function WeeklyBarChart({ onDayTap }: { onDayTap: (date: Date) => void }) {
  const chartAreaStyle: CSSProperties = { height: "88px" };
  return (
    <div className="w-full flex flex-col gap-[8px]">
      <div className="relative w-full" style={chartAreaStyle}>
        {/* Gridlines */}
        <div className="absolute inset-x-0 top-0 flex items-center gap-[6px]">
          <span className="font-['MessinaSansWeb:Regular',sans-serif] text-[9px] text-[#a3a3a3] shrink-0 w-[38px]">1h 0m</span>
          <div className="flex-1 h-px bg-[#ededed]" />
        </div>
        <div className="absolute inset-x-0" style={{ top: "50%" }}>
          <div className="flex items-center gap-[6px]">
            <span className="font-['MessinaSansWeb:Regular',sans-serif] text-[9px] text-[#a3a3a3] shrink-0 w-[38px]">0h 30m</span>
            <div className="flex-1 h-px bg-[#ededed]" />
          </div>
        </div>
        {/* Bars — each weekday column is tappable (even zero-height rest days have a valid
            sleep/nutrition recap), fill color reflects that day's mock NPS status. */}
        <div className="absolute inset-x-[44px] top-[4px] bottom-0 flex items-end justify-between gap-[8px]">
          {WEEK_BAR_MINUTES.map((m, i) => {
            const date = getWeekDate(i);
            const color = m > 0 ? NPS_STATUS_META[getMockDayStatus(date)].color : "#f2f2f2";
            return (
              <button
                key={i}
                type="button"
                onClick={() => onDayTap(date)}
                aria-label={`Ver recap del ${WEEK_LETTERS[i]}`}
                className="flex-1 h-full flex items-end active:opacity-70 transition-opacity"
              >
                <div
                  className="w-full rounded-[4px]"
                  style={{ height: `${Math.max((m / CHART_MAX_MIN) * 100, 3)}%`, background: color }}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between w-full pl-[44px]">
        {WEEK_LETTERS.map((l, i) => (
          <span key={i} className="flex-1 text-center font-['MessinaSansWeb:Regular',sans-serif] text-[11px] text-[#a3a3a3]">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── DayRecapSheet — "Así fue tu día" pattern reused for any past day, not just today ──
// Same visual pattern as DailyWorkoutCard's NutritionEntry end-of-day recap (Druk title,
// status dot + label, 4-factor checklist with check/thumbs-down circles), parameterized
// by date instead of hardcoded to "today". Mock factors are deterministic (see
// getMockDayFactors above) so reopening the same day always shows the same recap.
// Dismiss-only (drag-down / backdrop tap) — there's no "Ver mi semana"-style destination
// to chain into since this opens directly from the page the user is already on.

interface DayRecapSheetProps {
  open: boolean;
  onClose: () => void;
  date: Date | null;
}

function DayRecapSheet({ open, onClose, date }: DayRecapSheetProps) {
  if (!date) return <BottomSheet open={open} onClose={onClose} title="Así fue tu día"><></></BottomSheet>;

  const factors = getMockDayFactors(date);
  const positiveCount = factors.filter((f) => f.positive).length;
  const status: NPSStatus = positiveCount === 4 ? "green" : positiveCount >= 2 ? "yellow" : "red";
  const statusMeta = NPS_STATUS_META[status];

  return (
    <BottomSheet open={open} onClose={onClose} title="Así fue tu día">
      <div className="flex flex-col gap-[16px] px-[20px] pb-[32px]">
        <div className="flex flex-col gap-[2px]">
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.6px] uppercase">
            Así fue tu día
          </p>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#a3a3a3] tracking-[-0.26px]">
            {formatDayLabel(date)}
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="rounded-full size-[10px] shrink-0" style={{ background: statusMeta.color }} />
          <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px]" style={{ color: statusMeta.color }}>
            {statusMeta.label}
          </p>
        </div>
        <div className="flex flex-col">
          {factors.map((f) => (
            <div key={f.label} className="flex items-center justify-between py-[12px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px]">
                {f.label}
              </p>
              <div
                className="rounded-full size-[24px] flex items-center justify-center shrink-0"
                style={{ background: f.positive ? "#3ecf5f" : "#ff5c5c" }}
              >
                {f.positive
                  ? <Check size={13} strokeWidth={2.5} className="text-white" />
                  : <ThumbsDown size={12} strokeWidth={2} className="text-white" />
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}

// ─── Mapa corporal — body-heatmap SVG ported from biggapp's BodyMapFront.tsx ────

function MapaCorporalCard() {
  return (
    <div className="w-full bg-white rounded-[12px] p-[20px] flex flex-col items-center gap-[16px]" style={{ border: "1px solid #f0f0f0", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
      <p className="w-full font-['MessinaSansWeb:Bold',sans-serif] text-[16px] text-[#3d3d3d] tracking-[-0.4px]">
        Mapa corporal
      </p>
      <svg viewBox="0 0 135 263" fill="none" width="148" height="288">
        {/* Pecho / Pectorales */}
        <g fill={MUSCLE_GRAY}>
          <path d="M69.5244 55.8381L68.4295 73.9035L77.7359 77.7356L90.8744 74.451L94.7065 63.5022L83.2103 55.8381H69.5244Z" />
          <path d="M39.9628 62.4084L42.1525 74.452L54.7436 77.7366L64.5974 73.9045L64.05 56.3866H50.3641L39.9628 62.4084Z" />
        </g>
        {/* Abdominales */}
        <g fill={MUSCLE_GRAY}>
          <path d="M75.5462 79.379L77.736 85.9483L78.2834 104.561V124.269L75.5462 131.933L73.9039 139.597L68.977 144.524L68.4296 113.32L67.8821 90.3278L68.4296 76.6419L75.5462 79.379Z" />
          <path d="M58.5756 78.8316L65.1449 76.6419L65.6923 90.3278L65.1449 113.32L64.5974 143.977L59.6705 139.05L54.7436 122.627V105.109L55.291 86.4957L58.5756 78.8316Z" />
        </g>
        {/* Oblicuos */}
        <g fill={MUSCLE_GRAY}>
          <path d="M91.9692 84.8534L90.3269 76.6419L78.8307 79.9265L80.4731 85.9483L81.0205 111.678L88.1372 105.656L89.232 93.6124L91.9692 84.8534Z" />
          <path d="M45.4372 105.109L44.3423 96.3496L41.6052 84.8534L43.2475 76.6419L54.7436 79.379L52.5539 84.8534V112.225L45.4372 105.109Z" />
        </g>
        {/* Bíceps */}
        <g fill={MUSCLE_GRAY}>
          <path d="M22.4449 91.4221L24.0873 95.8016L30.6565 88.6849L38.868 72.2618L37.2257 66.24L27.3719 74.999L22.4449 91.4221Z" />
          <path d="M95.8013 66.24L94.159 73.3567L102.37 88.6849L109.487 96.349L111.129 92.5169L105.655 74.4515L95.8013 66.24Z" />
        </g>
        {/* Tríceps */}
        <g fill={MUSCLE_GRAY}>
          <path d="M93.0641 74.4522V82.6638L101.823 97.4445L104.013 94.1599L101.276 90.3279L93.0641 74.4522Z" />
        </g>
        <g fill={MUSCLE_GRAY}>
          <path d="M30.109 93.065L39.9628 74.4522V81.5689L30.6564 97.992L30.109 93.065Z" />
        </g>
        {/* Hombros / Deltoides + cuello */}
        <g fill={MUSCLE_GRAY}>
          <path d="M105.108 71.1677L106.75 64.051L106.203 55.292L101.823 50.9125L95.2539 48.7228L96.8962 57.4818L95.8013 63.5036L105.108 71.1677Z" />
          <path d="M37.7731 63.5035L28.4667 71.1676L26.8244 64.051L27.3718 54.7445L32.8462 49.8176H38.3205L36.1308 58.0292L37.7731 63.5035Z" />
          <path d="M74.4514 31.752L67.8821 44.8904V52.5546L82.6629 53.6494L94.7065 60.2187L93.0642 49.2699L84.8526 47.0802L78.2834 41.0584L74.4514 31.752Z" />
          <path d="M38.868 60.2186L40.5103 49.8173L48.7218 47.0801L55.291 40.5109L59.6705 32.8468L65.6923 45.4378L65.1449 52.5545L50.9116 53.1019L38.868 60.2186Z" />
        </g>
        {/* Antebrazos */}
        <g fill={MUSCLE_GRAY}>
          <path d="M8.21154 118.794L13.6859 100.728L19.7077 94.1591L21.8974 99.6334L25.7295 98.5386L6.0218 130.837L0 134.122L8.21154 118.794Z" />
          <path d="M113.319 93.6106L111.677 98.5376L107.297 97.9901L127.553 131.931L134.122 134.668L125.363 119.888L120.436 102.37L113.319 93.6106Z" />
          <path d="M104.013 96.8972V104.014L107.845 112.773L114.414 120.437L123.721 135.765L127.005 133.575L104.013 96.8972Z" />
          <path d="M9.30639 135.764L18.0654 121.531L25.182 112.772L29.0141 103.465L28.4667 96.3487L6.56921 132.48L9.30639 135.764Z" />
        </g>
        {/* Glúteos / Ingle */}
        <g fill={MUSCLE_GRAY}>
          <path d="M70.6193 147.808L72.8091 167.515L80.4732 147.808L83.2103 134.122L87.0424 126.458L80.4732 124.268L76.0937 140.143L70.6193 147.808Z" />
          <path d="M64.0501 148.356L60.218 168.064L56.386 155.473L54.1962 151.641L53.1014 143.977L50.9116 137.407L46.5321 125.911L53.1014 123.721L55.8385 133.028L58.5757 141.239L64.0501 148.356Z" />
        </g>
        {/* Cuádriceps — highlighted */}
        <g fill={LIME}>
          <path d="M46.5321 132.48L49.8167 145.071V171.348L45.9847 183.939L41.6052 177.917L39.4154 160.947L37.7731 149.451L39.4154 135.217L43.2475 127.006L46.5321 132.48Z" />
          <path d="M52.0064 173.538L51.459 150.546L55.2911 158.757L59.6705 173.538L57.4808 181.202L53.6487 195.983L48.7218 196.53L47.6269 187.771L52.0064 173.538Z" />
          <path d="M43.7949 185.58L35.5834 195.434L34.4885 183.391V170.8L36.1308 153.282L39.4155 179.011L43.7949 185.58Z" />
          <path d="M45.4372 187.77L46.532 192.149L47.6269 197.624L48.7218 202.55L47.0795 210.215H39.9628L36.6782 204.74V197.624L40.5102 193.244L45.4372 187.77Z" />
          <path d="M96.3488 151.64L99.086 166.421V188.319L97.4436 195.435L89.2321 185.582L94.159 179.012L96.3488 151.64Z" />
          <path d="M84.8526 141.787L86.4949 134.123L89.7795 127.006L94.159 135.765L95.2539 149.998L91.4219 178.465L87.5898 184.487L83.7577 172.443L83.2103 149.451L84.8526 141.787Z" />
          <path d="M79.9257 195.435L74.4513 172.99L81.568 152.735L82.1154 174.633L85.9475 187.224L84.3052 196.53L79.9257 195.435Z" />
          <path d="M88.1372 187.77L96.8962 198.171V204.193L93.6116 210.762L87.0423 210.215L84.3051 202.55L88.1372 187.77Z" />
        </g>
        {/* Gemelos / Tibiales — highlighted */}
        <g fill={LIME}>
          <path d="M95.8013 215.142L98.5385 205.835L102.918 216.237L106.75 224.996L105.108 251.82L106.75 262.221H100.181L95.8013 215.142Z" />
          <path d="M97.4437 261.674L93.6116 213.499L87.5898 212.404L85.9475 217.879V221.711L88.1372 237.586L97.4437 261.674Z" />
          <path d="M47.6269 212.404L48.1744 217.879V223.9L47.0795 231.017V237.039L43.2474 244.156L41.0577 251.272L36.1308 261.126L36.6782 251.82L37.7731 241.966L38.3205 235.397L38.868 227.733L39.9628 220.068L40.5103 212.952L47.6269 212.404Z" />
          <path d="M33.3936 261.126L37.2256 221.164L37.773 215.142L35.0359 206.93L33.3936 211.31L30.1089 216.784L27.9192 224.996L29.5615 252.367L27.9192 262.221L33.3936 261.126Z" />
        </g>
        {/* Cabeza */}
        <g fill="#f0f0f0">
          <path d="M56.9334 3.83205L53.6487 15.8756L56.3859 26.2769L61.8603 31.2039L66.7872 33.941L73.3564 30.109L77.1885 25.7295L79.3782 13.6859L76.6411 3.28462L66.7872 0L56.9334 3.83205Z" />
        </g>
      </svg>
    </div>
  );
}

// ─── Sueño / Pasos carousel — same cards as Train's RecommendationsCarousel, no section
// title here (removed per user request — only the "Recomendaciones basadas en tus hábitos"
// heading was cut, the cards themselves stayed). Sueño omits the Apple Health SourceChip
// (kept off since this session's earlier request); Pasos keeps its Garmin chip.

function ActividadSleepCard() {
  const sleepData = [7.5, 6.5, 8, 7, 8, 7, 6];
  const sleepDays = ["L", "M", "M", "J", "V", "S", "D"];
  const sleepMax = 9;
  const maxBarH = 62;

  return (
    <div className="relative rounded-[20px] shrink-0 w-full">
      <div
        className="overflow-clip relative rounded-[20px] w-full"
        style={{ background: "linear-gradient(70deg, #1a2040 2%, #2e1e6e 74%)" }}
      >
        <div className="flex flex-col h-[260px] p-[15px]">
          <div className="flex items-start justify-between shrink-0">
            <div className="flex flex-col gap-[4px]">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[rgba(255,255,255,0.5)] text-[8px] tracking-[-0.08px] uppercase whitespace-nowrap">
                SUEÑO ANOCHE
              </p>
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[rgba(255,255,255,0.5)] text-[8px] tracking-[-0.08px] uppercase whitespace-nowrap">
                OBJETIVO: 8 HORAS
              </p>
            </div>
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-white text-[40px] leading-[1] tracking-[-2px] shrink-0">
              6h
            </p>
          </div>
          <div className="flex items-end flex-1 pb-[6px] pt-[8px]">
            <div className="flex items-end w-full" style={{ gap: '4px' }}>
              {sleepData.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-[4px] flex-1">
                  <div
                    className="w-full rounded-[4px]"
                    style={{
                      height: `${(v / sleepMax) * maxBarH}px`,
                      background: i === sleepData.length - 1 ? '#7b9de8' : 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[rgba(255,255,255,0.3)] text-[7px]">
                    {sleepDays[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[rgba(255,255,255,0.55)] text-[11px] leading-[1.4] tracking-[-0.22px] shrink-0">
            Dormite temprano hoy para alcanzar tu objetivo mañana
          </p>
        </div>
      </div>
    </div>
  );
}

function ActividadStepsCard() {
  const current = 3200;
  const goal = 10000;
  const pct = Math.min((current / goal) * 100, 100);

  return (
    <div className="relative rounded-[20px] shrink-0 w-full">
      <div
        className="overflow-clip relative rounded-[20px] w-full"
        style={{ backgroundImage: "linear-gradient(70.32deg, rgb(237, 237, 237) 1.58%, rgb(222, 255, 163) 73.75%)" }}
      >
        <div className="flex flex-col h-[260px] p-[15px] gap-[10px]">
          <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#585858] text-[8px] tracking-[-0.08px] uppercase whitespace-nowrap shrink-0">
            PASOS DE HOY
          </p>
          <div className="flex items-baseline gap-[6px] flex-1">
            <p className="font-['Druk_Wide:Medium',sans-serif] text-[#3d3d3d] text-[48px] leading-[1] tracking-[-2px]">
              3.200
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[18px] leading-[1] tracking-[-0.5px]">
              / 10.000
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-[6px]">
            <div className="w-full h-[8px] rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: '#3d6b00' }}
              />
            </div>
            <div className="flex justify-between">
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[9px]">0</p>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[9px]">10.000</p>
            </div>
          </div>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[11px] leading-[1.4] tracking-[-0.22px] shrink-0">
            Caminá 6.800 pasos más para alcanzar tu objetivo diario
          </p>
          <SourceChip source="garmin" prefix="Datos de" />
        </div>
      </div>
    </div>
  );
}

const ACTIVIDAD_RECOMMENDATION_ITEMS = [
  { subtitle: "Dormiste menos de lo ideal", card: <ActividadSleepCard /> },
  { subtitle: "Movete más durante el día", card: <ActividadStepsCard /> },
];

function ActividadRecommendationsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const containerLeft = el.getBoundingClientRect().left;
    const containerRight = containerLeft + el.clientWidth;
    const children = Array.from(el.children).slice(0, ACTIVIDAD_RECOMMENDATION_ITEMS.length) as HTMLElement[];
    let best = 0, bestVis = -1;
    children.forEach((child, i) => {
      const rect = child.getBoundingClientRect();
      const vis = Math.min(rect.right, containerRight) - Math.max(rect.left, containerLeft);
      if (vis > bestVis) { bestVis = vis; best = i; }
    });
    setActiveIndex(best);
  }, []);

  return (
    <div className="flex flex-col gap-[14px] w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-[12px] overflow-x-auto"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {ACTIVIDAD_RECOMMENDATION_ITEMS.map(({ subtitle, card }, i) => (
          <div
            key={i}
            className="flex flex-col gap-[8px] shrink-0 flex-[0_0_76%]"
            style={{ scrollSnapAlign: "start" }}
          >
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#565656] text-[13px] tracking-[-0.3px] leading-[1.3]">
              {subtitle}
            </p>
            {card}
          </div>
        ))}
        <div className="shrink-0 w-[1px]" aria-hidden />
      </div>

      <div className="flex items-center justify-center gap-[6px]">
        {ACTIVIDAD_RECOMMENDATION_ITEMS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === activeIndex ? 16 : 6,
              height: 6,
              background: i === activeIndex ? "#3d3d3d" : "#d4d4d4",
            }}
          />
        ))}
      </div>
    </div>
  );
}

