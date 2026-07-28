import { useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { ChevronDown, ChevronRight, MapPin, Plus, Check, Sparkles, Moon, ThumbsUp, ThumbsDown, Utensils, Sun, Clock, CalendarPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SourceChip, { type DataSource } from "./SourceChip";
import WhyLine from "./WhyLine";
import LocationSheet from "./LocationSheet";
import BottomSheet from "./BottomSheet";
import AddLocationScreen from "./AddLocationScreen";
import { BlockCard, type StimulusBlock } from "./ProgrammingSection";
import imgBiggRun from "../../assets/bigg-run.jpg";

const BASE_CHIPS = ["FBA", "Upper Body", "HIIT", "Midline"];
const RECOVERY_TAGS = ["Piernas cargadas", "Espalda tensa", "Hombros", "Fatiga general", "Sin molestias"];
const NUTRITION_TAGS = ["Hinchazón", "Con energía", "Antojos", "Buena digestión", "Pesadez"];

type TimelineFilter = "todos" | "entrenamiento" | "sueno" | "nutricion";
const TIMELINE_FILTERS: { key: TimelineFilter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "entrenamiento", label: "Entrenamiento y actividad" },
  { key: "sueno", label: "Sueño" },
  { key: "nutricion", label: "Nutrición" },
];
const BIGG_LOCATIONS = new Set(["BIGG Recoleta", "BIGG Tortuguitas"]);

// TimePill style shared by every non-"Actividad del día" milestone — squares off
// the pill's bottom corners and extends it downward so the card below (pulled up via
// translateY(-15px) on its wrapper) reads as plugged into the pill, like a folder tab.
const CONNECTED_PILL_STYLE: CSSProperties = {
  borderRadius: "12px",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  paddingBottom: "20px",
  marginLeft: "1px",
};

// Weekly NPS recap — mocked variety since there's no real per-day completion tracking yet.
// Score = count of 4 factors (trained recommended / did activity / slept well / ate well):
// 4/4 green, 2-3 yellow, 0-1 red. Today's own day is always "pending" (not finished yet).
export type NPSStatus = "green" | "yellow" | "red" | "pending";
export const NPS_STATUS_META: Record<NPSStatus, { color: string; label: string }> = {
  green: { color: "#3ecf5f", label: "Excelente" },
  yellow: { color: "#f8b32e", label: "Bien" },
  red: { color: "#ff5c5c", label: "A mejorar" },
  pending: { color: "#c4c4c4", label: "En curso" },
};
const DAY_BLOCKS: StimulusBlock[] = [
  { id: "day-fba", stimulus: "FBA", modality: "Superset · 3 sets", duration: "15'",
    movements: ["SA DB Press 3 × 10 c/lado", "Nordic Curl 3 × 8", "Copenhagen Plank 3 × 30''", "Bulgarian Split 3 × 10 c/lado"],
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0fff5 100%)" },
  { id: "day-ub", stimulus: "Upper Body", modality: "Strength · 5 sets", duration: "20'",
    movements: ["Bench Press 4 × 5 @80%", "Weighted Pull-up 3 × 6", "DB Row 3 × 10 c/lado", "Face Pull 2 × 15"],
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #e8eeff 100%)" },
  { id: "day-hi", stimulus: "HIIT", modality: "AMRAP · 12'", duration: "12'",
    movements: ["Thruster × 10", "Box Jump × 10", "KB Swing × 15", "Burpee × 8"],
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff0e0 100%)" },
  { id: "day-mid", stimulus: "Midline", modality: "For Quality · 3 sets", duration: "12'",
    movements: ["Hollow Hold 3 × 30''", "V-Up 3 × 15", "Pallof Press 3 × 12 c/lado", "Dead Bug 3 × 10"],
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #f5f0ff 100%)" },
];

// ── Variant 4 block definitions ──────────────────────────────────────────────
interface V4BlockDef {
  id: string;
  bigg: { stimulus: string; modality: string; duration: string };
  away: { stimulus: string; modality: string; duration: string } | null;
  exercisesAdapt: boolean; // exercises change but name stays — show icon
}
const V4_BLOCKS: V4BlockDef[] = [
  { id: "v4-fba",  bigg: { stimulus: "FBA",        modality: "Superset · 3 sets",     duration: "15'" }, away: null,                                                              exercisesAdapt: true  },
  { id: "v4-ub",   bigg: { stimulus: "Upper Body",  modality: "Strength · 5 sets",     duration: "20'" }, away: { stimulus: "Push Pull",  modality: "Bodyweight · 4 sets",    duration: "20'" }, exercisesAdapt: false },
  { id: "v4-hiit", bigg: { stimulus: "HIIT",        modality: "AMRAP · 12'",           duration: "12'" }, away: { stimulus: "Cardio",     modality: "Intervalos · 3 rondas",  duration: "12'" }, exercisesAdapt: false },
  { id: "v4-mid",  bigg: { stimulus: "Midline",     modality: "For Quality · 3 sets",  duration: "12'" }, away: null,                                                              exercisesAdapt: false },
];

// Dark time pill used as the timeline node label (e.g. "10AM", "18:00hs").
function TimePill({ label, style }: { label: string; style?: CSSProperties }) {
  return (
    <div className="bg-[#3d3d3d] rounded-full px-[12px] py-[6px] flex items-center justify-center" style={style}>
      <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[13px] whitespace-nowrap tracking-[-0.26px] leading-[1.2]">
        {label}
      </p>
    </div>
  );
}

// Sleep summary at top of timeline — quality approve/disapprove + details sheet.
// Approval is controlled by the parent (DailyWorkoutCard) so it can default to
// "approved" for today and be read elsewhere (e.g. the end-of-day status recap).
interface SleepEntryProps {
  approval: "approved" | "rejected" | null;
  onApprovalChange: (value: "approved" | "rejected") => void;
  /** Bubbles up to BiggDayScreen so "Ver mi actividad" can switch to the Actividad tab. */
  onCompleteDay?: () => void;
}

function SleepEntry({ approval, onApprovalChange, onCompleteDay }: SleepEntryProps) {
  const [showToast, setShowToast] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllStats, setShowAllStats] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleApproval = (e: MouseEvent, value: "approved" | "rejected") => {
    e.stopPropagation();
    onApprovalChange(value);
    setShowToast(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setShowToast(false), 4000);
  };

  const openDetails = () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setShowToast(false);
    setShowDetails(true);
  };

  // "Ver mi actividad" CTA — close the sheet and switch to the Actividad tab.
  const handleViewActivity = () => {
    setShowDetails(false);
    onCompleteDay?.();
  };

  return (
    <>
      <motion.div
        role="button"
        tabIndex={0}
        whileTap={{ scale: 0.98 }}
        onClick={openDetails}
        className="relative z-10 flex items-center gap-[10px] w-full px-[16px] py-[14px] rounded-[16px] cursor-pointer overflow-hidden"
        style={{ background: "linear-gradient(70deg, #1a2040 2%, #2e1e6e 74%)" }}
      >
        <Moon size={13} className="text-white/60 shrink-0" />
        <p className="flex-1 font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-white/60 tracking-[-0.26px] leading-[1.2]">
          Dormiste <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white">7h 12m</span> — ¿Descansaste bien?
        </p>
        <div className="flex items-center gap-[6px] shrink-0">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleApproval(e, "approved")}
            className="w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors"
            style={{ background: approval === "approved" ? "#7b9de8" : "rgba(255,255,255,0.12)" }}
          >
            <ThumbsUp size={12} strokeWidth={2} className={approval === "approved" ? "text-white" : "text-white/60"} />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleApproval(e, "rejected")}
            className="w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors"
            style={{ background: approval === "rejected" ? "#7b9de8" : "rgba(255,255,255,0.12)" }}
          >
            <ThumbsDown size={12} strokeWidth={2} className={approval === "rejected" ? "text-white" : "text-white/60"} />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 bottom-[86px] z-[80] -translate-x-1/2 flex items-center gap-[10px] bg-[#3d3d3d] text-white text-[13px] font-['MessinaSansWeb:SemiBold',sans-serif] pl-[16px] pr-[8px] py-[8px] rounded-full shadow-lg whitespace-nowrap"
          >
            <span>Calidad de sueño guardada</span>
            <button
              type="button"
              onClick={openDetails}
              className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#3d3d3d] bg-[#adff19] px-[12px] py-[6px] rounded-full active:opacity-80 transition-opacity"
            >
              Agregar detalles
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomSheet open={showDetails} onClose={() => setShowDetails(false)} title="Detalles de sueño">
        <div className="flex flex-col gap-[16px] px-[20px] pb-[32px]">
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.6px] uppercase">
            Sueño de anoche
          </p>
          <SourceChip source="apple-health" prefix="Tomado desde" />
          <div className="flex flex-col">
            {[
              { label: "Duración", value: "7h 12m" },
              { label: "Calidad", value: "Buena" },
              ...(showAllStats ? [
                { label: "Sueño profundo", value: "1h 48m" },
                { label: "Sueño REM", value: "1h 32m" },
                { label: "Frecuencia cardíaca promedio", value: "58 bpm" },
              ] : []),
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-[12px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#6b7280] tracking-[-0.28px]">{row.label}</p>
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px]">{row.value}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowAllStats((v) => !v)}
            className="self-start font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#8b78e6] tracking-[-0.26px] underline active:opacity-70 transition-opacity"
          >
            {showAllStats ? "Ver menos" : "Ver todos"}
          </button>
          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-col gap-[2px]">
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#3d3d3d] tracking-[-0.26px]">
                ¿Cómo sentís tu cuerpo hoy?
              </p>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.24px]">
                Sumá tags para trackear tu recuperación muscular
              </p>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {RECOVERY_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="px-[14px] py-[8px] rounded-full transition-colors active:opacity-80"
                    style={{ background: isSelected ? "#8b78e6" : "rgba(139,120,230,0.1)" }}
                  >
                    <span
                      className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] tracking-[-0.26px]"
                      style={{ color: isSelected ? "#fff" : "#8b78e6" }}
                    >
                      {tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={handleViewActivity}
            className="w-full mt-[4px] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
            style={{ background: "#8b78e6" }}
          >
            <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] text-white tracking-[-0.3px]">
              Ver mi actividad
            </span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

// Nutrition check-in — same pattern as SleepEntry (approve/disapprove + toast + details sheet),
// plus a manual "what/when" log, collapsible digestion tags, and a Guardar CTA that chains into
// a BIGG Nutrition upsell sheet and (today only) an end-of-day status recap.
interface NutritionEntryProps {
  /** Chains Guardar → upsell → day-status recap, and enables the "Ver mi semana" CTA. */
  isToday?: boolean;
  /** Today's sleep-approval state, read into the day-status recap's "Dormiste bien" row. */
  sleepApproval?: "approved" | "rejected" | null;
  /** Bubbles up to BiggDayScreen so "Ver mi semana" can switch to the Actividad tab. */
  onCompleteDay?: () => void;
}

function NutritionEntry({ isToday = false, sleepApproval = null, onCompleteDay }: NutritionEntryProps) {
  const [approval, setApproval] = useState<"approved" | "rejected" | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [whatEaten, setWhatEaten] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDayStatus, setShowDayStatus] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleApproval = (e: MouseEvent, value: "approved" | "rejected") => {
    e.stopPropagation();
    setApproval(value);
    setShowToast(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setShowToast(false), 4000);
  };

  const openDetails = () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setShowToast(false);
    setShowDetails(true);
  };

  // Guardar → close details, open the BIGG Nutrition upsell promo sheet
  const handleSaveDetails = () => {
    setShowDetails(false);
    setShowUpsell(true);
  };

  // Upsell sheet closes (CTA tap or swipe) → today only, chain into the day-status recap
  const handleCloseUpsell = () => {
    setShowUpsell(false);
    if (isToday) setShowDayStatus(true);
  };

  const handleViewWeek = () => {
    setShowDayStatus(false);
    onCompleteDay?.();
  };

  // Day-status factors — sleep/nutrition read real local state; training/activity have no
  // clean per-day completion signal yet in this mock, so they're hardcoded positive (demo-only).
  const dayFactors: { label: string; positive: boolean }[] = [
    { label: "Entrenaste lo recomendado", positive: true },
    { label: "Hiciste actividad", positive: true },
    { label: "Dormiste bien", positive: sleepApproval !== "rejected" },
    { label: "Comiste bien", positive: approval !== "rejected" },
  ];
  const positiveCount = dayFactors.filter((f) => f.positive).length;
  const dayStatus: NPSStatus = positiveCount === 4 ? "green" : positiveCount >= 2 ? "yellow" : "red";
  const dayStatusMeta = NPS_STATUS_META[dayStatus];

  return (
    <>
      <motion.div
        role="button"
        tabIndex={0}
        whileTap={{ scale: 0.98 }}
        onClick={openDetails}
        className="relative z-10 flex h-full flex-col justify-center gap-[8px] w-full px-[16px] py-[14px] rounded-[16px] cursor-pointer"
        style={{ background: "linear-gradient(135deg, #fce8d8 0%, #fdf1e6 100%)" }}
      >
        <Utensils size={16} className="text-[#f2994a] shrink-0" />
        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.26px] leading-[1.25]">
          ¿Comiste bien hoy?
        </p>
        <div className="flex items-center gap-[6px]">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleApproval(e, "approved")}
            className="w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors"
            style={{ background: approval === "approved" ? "#f2994a" : "rgba(242,153,74,0.15)" }}
          >
            <ThumbsUp size={12} strokeWidth={2} className={approval === "approved" ? "text-white" : "text-[#f2994a]"} />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleApproval(e, "rejected")}
            className="w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors"
            style={{ background: approval === "rejected" ? "#f2994a" : "rgba(242,153,74,0.15)" }}
          >
            <ThumbsDown size={12} strokeWidth={2} className={approval === "rejected" ? "text-white" : "text-[#f2994a]"} />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 bottom-[86px] z-[80] -translate-x-1/2 flex items-center gap-[10px] bg-[#3d3d3d] text-white text-[13px] font-['MessinaSansWeb:SemiBold',sans-serif] pl-[16px] pr-[8px] py-[8px] rounded-full shadow-lg whitespace-nowrap"
          >
            <span>Nutrición guardada</span>
            <button
              type="button"
              onClick={openDetails}
              className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-white bg-[#f2994a] px-[12px] py-[6px] rounded-full active:opacity-80 transition-opacity"
            >
              Agregar detalles
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomSheet open={showDetails} onClose={() => setShowDetails(false)} title="Detalles de nutrición">
        <div className="flex flex-col gap-[16px] px-[20px] pb-[32px]">
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.6px] uppercase">
            Nutrición de hoy
          </p>

          {/* What + when — manual log, no integration */}
          <div className="flex gap-[10px]">
            <div className="flex-1 flex flex-col gap-[8px]">
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[11px] text-[#a3a3a3] uppercase tracking-[0.8px]">
                ¿Qué comiste?
              </p>
              <input
                type="text"
                placeholder="Ej: Pollo con arroz y ensalada"
                value={whatEaten}
                onChange={(e) => setWhatEaten(e.target.value)}
                className="w-full border border-[#e0e0e0] rounded-[14px] px-[16px] py-[14px] font-['MessinaSansWeb:Regular',sans-serif] text-[15px] text-[#3d3d3d] placeholder:text-[#c4c4c4] outline-none focus:border-[#f2994a] transition-colors bg-white"
              />
            </div>
            <div className="w-[104px] flex flex-col gap-[8px]">
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[11px] text-[#a3a3a3] uppercase tracking-[0.8px]">
                Hora
              </p>
              <input
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="w-full border border-[#e0e0e0] rounded-[14px] px-[12px] py-[14px] font-['MessinaSansWeb:Regular',sans-serif] text-[15px] text-[#3d3d3d] outline-none focus:border-[#f2994a] transition-colors bg-white"
              />
            </div>
          </div>

          {/* Digestion/energy tags — collapsed behind a chevron toggle */}
          <div className="flex flex-col gap-[10px]">
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#3d3d3d] tracking-[-0.26px]">
              ¿Cómo te cayó la comida?
            </p>
            <button
              type="button"
              onClick={() => setTagsOpen((v) => !v)}
              className="w-full flex items-center justify-between active:opacity-70 transition-opacity"
            >
              <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#f2994a] tracking-[-0.26px]">
                Tags de digestión y energía
              </span>
              <motion.div animate={{ rotate: tagsOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                <ChevronDown size={16} className="text-[#f2994a]" strokeWidth={2} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {tagsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="flex flex-wrap gap-[8px] pt-[2px]">
                    {NUTRITION_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="px-[14px] py-[8px] rounded-full transition-colors active:opacity-80"
                          style={{ background: isSelected ? "#f2994a" : "rgba(242,153,74,0.1)" }}
                        >
                          <span
                            className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] tracking-[-0.26px]"
                            style={{ color: isSelected ? "#fff" : "#f2994a" }}
                          >
                            {tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={handleSaveDetails}
            className="w-full mt-[4px] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
            style={{ background: "#adff19" }}
          >
            <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#1a3d00] tracking-[-0.3px]">
              Guardar
            </span>
          </button>
        </div>
      </BottomSheet>

      {/* BIGG Nutrition upsell — static promo, CTA is a no-op (provisional, no destination yet) */}
      <BottomSheet open={showUpsell} onClose={handleCloseUpsell} title="BIGG Nutrition">
        <div className="flex flex-col pb-[32px]">
          <div
            className="w-full aspect-[390/180] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #ffdcb0 0%, #f2994a 100%)" }}
          >
            <Utensils size={48} className="text-white/90" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-[10px] px-[20px] pt-[20px]">
            <p className="font-['Druk_Wide:Medium',sans-serif] text-[22px] text-[#3d3d3d] tracking-[-0.5px] uppercase leading-[1.15]">
              Llevá tu nutrición al siguiente nivel
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#6b7280] tracking-[-0.28px] leading-[1.4]">
              Un coach de nutrición diseña tu plan de comidas semana a semana, alineado con tu entrenamiento.
            </p>
            <button
              type="button"
              onClick={handleCloseUpsell}
              className="w-full mt-[8px] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
              style={{ background: "#adff19" }}
            >
              <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#1a3d00] tracking-[-0.3px]">
                Descubrí BIGG Nutrition
              </span>
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* End-of-day status recap — today only */}
      <BottomSheet open={showDayStatus} onClose={() => setShowDayStatus(false)} title="Así fue tu día">
        <div className="flex flex-col gap-[16px] px-[20px] pb-[32px]">
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.6px] uppercase">
            Así fue tu día
          </p>
          <div className="flex items-center gap-[8px]">
            <div className="rounded-full size-[10px] shrink-0" style={{ background: dayStatusMeta.color }} />
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px]" style={{ color: dayStatusMeta.color }}>
              {dayStatusMeta.label}
            </p>
          </div>
          <div className="flex flex-col">
            {dayFactors.map((f) => (
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
          <button
            type="button"
            onClick={handleViewWeek}
            className="w-full mt-[4px] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
            style={{ background: "#3d3d3d" }}
          >
            <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] text-white tracking-[-0.3px]">
              Ver mi semana
            </span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

// Daily step count. Like the Nutrición check-in beside it, the card itself is only an
// indicator — count, goal and what's left — and everything explanatory (where the data
// comes from, why the goal is what it is) lives in the sheet it opens on tap. That's why
// there's no SourceChip on the card: provenance belongs in the sheet, not the indicator.
const STEPS_TODAY = 3200;
const STEPS_GOAL = 10000;
const STEPS_WEEK_AVG = 6400;

function StepsEntry({ onCompleteDay }: { onCompleteDay?: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const pct = Math.min((STEPS_TODAY / STEPS_GOAL) * 100, 100);
  const remaining = Math.max(STEPS_GOAL - STEPS_TODAY, 0);
  const fmt = (n: number) => n.toLocaleString("es-AR");

  const handleViewActivity = () => {
    setShowDetails(false);
    onCompleteDay?.();
  };

  return (
    <>
      <div className="relative z-10 flex flex-1 min-w-0 flex-col items-start">
        <div className="relative z-10 flex flex-row items-center gap-[10px]">
          <TimePill label="Pasos de hoy" style={CONNECTED_PILL_STYLE} />
        </div>
        <motion.div
          role="button"
          tabIndex={0}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDetails(true)}
          className="relative z-10 w-full flex-1 rounded-[16px] overflow-hidden cursor-pointer"
          style={{ background: "linear-gradient(135deg, #ffffff 0%, #deffa3 100%)", border: "1px solid #3d3d3d", borderTopLeftRadius: "7px", transform: "translateY(-15px)" }}
        >
          <div className="flex h-full flex-col justify-center gap-[8px] px-[16px] py-[14px]">
            <div className="flex items-baseline gap-[4px] flex-wrap">
              <p className="font-['Druk_Wide:Medium',sans-serif] text-[24px] text-[#3d3d3d] leading-[1] tracking-[-1px]">
                {fmt(STEPS_TODAY)}
              </p>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.24px]">
                / {fmt(STEPS_GOAL)}
              </p>
            </div>
            <div className="w-full h-[6px] rounded-full bg-black/10 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#3d6b00" }} />
            </div>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.24px] leading-[1.3]">
              Te faltan {fmt(remaining)}
            </p>
          </div>
        </motion.div>
      </div>

      <BottomSheet open={showDetails} onClose={() => setShowDetails(false)} title="Detalles de pasos">
        <div className="flex flex-col gap-[16px] px-[20px] pb-[32px]">
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.6px] uppercase">
            Pasos de hoy
          </p>
          <SourceChip source="garmin" prefix="Tomado desde" />
          <div className="flex flex-col">
            {[
              { label: "Pasos de hoy", value: fmt(STEPS_TODAY) },
              { label: "Objetivo diario", value: fmt(STEPS_GOAL) },
              { label: "Te faltan", value: fmt(remaining) },
              { label: "Promedio últimos 7 días", value: fmt(STEPS_WEEK_AVG) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-[12px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#6b7280] tracking-[-0.28px]">{row.label}</p>
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px]">{row.value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#3d3d3d] tracking-[-0.26px]">
              ¿Por qué {fmt(STEPS_GOAL)} pasos?
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.26px] leading-[1.4]">
              Tu objetivo se calcula sobre tu promedio de las últimas semanas y el volumen de tu plan.
              En días de fuerza lo bajamos para que la caminata no compita con tu recuperación, y en
              días livianos lo subimos para sostener el gasto diario.
            </p>
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#3d3d3d] tracking-[-0.26px]">
              ¿De dónde salen estos datos?
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.26px] leading-[1.4]">
              Se sincronizan desde Garmin durante el día. BIGG no cuenta pasos por su cuenta: si
              desconectás la fuente, esta tarjeta deja de actualizarse.
            </p>
          </div>
          <button
            type="button"
            onClick={handleViewActivity}
            className="w-full mt-[4px] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
            style={{ background: "#adff19" }}
          >
            <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#1a3d00] tracking-[-0.3px]">
              Ver mi actividad
            </span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

// Generic addable recommendation card — dashed border, gradient, WhyLine + Agregar button.
// Shared by the Mobility recommendation and the BIGG Run Club recommendation (Wed/Sat).
interface RecommendationCardProps {
  title: string;
  chip: string;
  why: string;
  gradient: string;
}

function RecommendationCard({ title, chip, why, gradient }: RecommendationCardProps) {
  const [added, setAdded] = useState(false);

  return (
    <div className="relative rounded-[20px] w-full" style={{ borderTopLeftRadius: "7px" }}>
      {/* Solid white bg — sits behind content so opacity doesn't bleed into page grey */}
      <div className="absolute inset-0 bg-white rounded-[20px]" style={{ borderTopLeftRadius: "7px" }} />

      {/* Dashed border — z-10, always on top */}
      <motion.div
        aria-hidden
        className="absolute border border-dashed inset-0 pointer-events-none rounded-[20px] z-10"
        style={{ borderColor: "#3d3d3d", borderTopLeftRadius: "7px" }}
        animate={{ opacity: added ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className="content-stretch flex flex-col isolate items-center overflow-clip relative rounded-[20px] w-full"
        style={{ borderTopLeftRadius: "7px" }}
        animate={{ opacity: added ? 1 : 0.55 }}
        transition={{ duration: 0.5 }}
      >
        {/* Single gradient section — WhyLine inline (running pasadas pattern) */}
        <div
          className="backdrop-blur-[50px] content-stretch flex gap-[20px] items-start p-[20px] relative rounded-[20px] shrink-0 w-full"
          style={{ backgroundImage: gradient, borderTopLeftRadius: "7px" }}
        >
          {/* Left: title + chip + why */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative">
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-[26px] text-[#565656] tracking-[-1.3px] whitespace-nowrap">
              {title}
            </p>
            <div className="bg-[#ededed] px-[12px] py-[4px] rounded-[3px] flex items-center justify-center">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[11px] text-[#565656] tracking-[-0.11px] uppercase whitespace-nowrap">
                {chip}
              </p>
            </div>
            <WhyLine>{why}</WhyLine>
          </div>

          {/* Right: Agregar / Agregado button */}
          <button
            onClick={() => setAdded(true)}
            disabled={added}
            className="content-stretch flex flex-col gap-[9px] items-center relative shrink-0 w-[56px] cursor-pointer disabled:cursor-default"
          >
            <div className="bg-[rgba(255,255,255,0.5)] flex items-center justify-center size-[56px] relative rounded-[8px] shrink-0 overflow-hidden">
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  >
                    <Check size={20} strokeWidth={2} className="text-[#565656]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <Plus size={20} strokeWidth={1.5} className="text-[#565656]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.p
              className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[13px] text-center w-full leading-[1.25] whitespace-nowrap"
              animate={{ opacity: 1 }}
              key={added ? "added" : "add"}
            >
              {added ? "Agregado!" : "Agregar"}
            </motion.p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AfternoonRecommendationCard() {
  return (
    <RecommendationCard
      title="Mobility"
      chip="BIGG Soft Life"
      why="Cooldown recomendado por tu entrenamiento de la mañana en BIGG Recoleta"
      gradient="linear-gradient(112.876deg, rgba(255,255,255,0.9) 37.068%, rgba(42,179,204,0.9) 114.32%)"
    />
  );
}

// Merges the RecommendationCard mechanics (dashed border, Agregar button, connector corner)
// with the BIGG MOVE full-bleed photo treatment (fluid Fixture_Ultra title over an image).
function RunClubRecommendationCard() {
  const [added, setAdded] = useState(false);

  return (
    <div className="relative rounded-[20px] w-full overflow-hidden" style={{ borderTopLeftRadius: "7px", aspectRatio: "390 / 200", containerType: "inline-size" }}>
      <img alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" src={imgBiggRun} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 100%)" }} />

      <div className="absolute inset-0 z-[2] flex items-end justify-between gap-[16px] p-[20px]">
        <div className="flex flex-col gap-[8px] min-w-0">
          <p
            className="[word-break:break-word] font-['Fixture_Ultra:SemiBold',sans-serif] leading-[1.005] not-italic text-white whitespace-nowrap"
            style={{ fontSize: "clamp(24px, 12cqw, 44px)" }}
          >
            BIGG RUN CLUB
          </p>
          <div className="flex items-center gap-[6px]">
            <MapPin size={13} className="text-white/85 shrink-0" strokeWidth={1.75} />
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white/85 text-[13px] tracking-[-0.13px] whitespace-nowrap">
              Rosedal De Palermo
            </p>
          </div>
          <div className="flex items-center gap-[6px]">
            <Clock size={13} className="text-white/85 shrink-0" strokeWidth={1.75} />
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white/85 text-[13px] tracking-[-0.13px] whitespace-nowrap">
              19:00hs
            </p>
          </div>
        </div>

        <button
          onClick={() => setAdded(true)}
          disabled={added}
          className="content-stretch flex flex-col gap-[9px] items-center relative shrink-0 w-[56px] cursor-pointer disabled:cursor-default"
        >
          <div className="bg-white/20 backdrop-blur-sm flex items-center justify-center size-[56px] relative rounded-[8px] shrink-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {added ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                >
                  <Check size={20} strokeWidth={2} className="text-white" />
                </motion.div>
              ) : (
                <motion.div key="cal" exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.12 }}>
                  <CalendarPlus size={20} strokeWidth={1.5} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.p
            className="font-['MessinaSansWeb:Regular',sans-serif] text-white text-[13px] text-center w-full leading-[1.25] whitespace-nowrap"
            animate={{ opacity: 1 }}
            key={added ? "added" : "add"}
          >
            {added ? "¡Anotado!" : "Anotarse"}
          </motion.p>
        </button>
      </div>
    </div>
  );
}

export interface ReservedClass {
  time: string;
  location: string;
  classType: string;
  blocks: string[];
  attendeeCount?: number;
}

function AttendeeAvatars({ total = 20 }: { total?: number }) {
  const visible = 6;
  const size = 32;
  const overlap = 8;
  return (
    <div className="flex items-center gap-[8px]">
      <div
        className="relative shrink-0"
        style={{ width: size + (visible - 1) * (size - overlap) + "px", height: size + "px" }}
      >
        {Array.from({ length: visible }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 rounded-full bg-[#c8c8c8] border-[2px] border-white"
            style={{ left: i * (size - overlap) + "px", width: size + "px", height: size + "px" }}
          />
        ))}
      </div>
      <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#b5b5b5] text-[12px] tracking-[-0.24px] whitespace-nowrap">
        +{total}
      </p>
    </div>
  );
}

export interface ActivityEntry {
  time: string;
  timeRange?: string;
  title: string;
  gradient?: string;
  source?: DataSource;
  why?: string;
  addable?: boolean;
  /** Overrides the "Entrenamiento complementario" TimePill label for this entry. */
  sectionLabel?: string;
}

function ActivityCard({ entry, connected = false }: { entry: ActivityEntry; connected?: boolean }) {
  const [added, setAdded] = useState(false);
  const gradient = entry.gradient ?? "linear-gradient(115deg, rgba(255,255,255,0.9) 40%, rgba(163,163,163,0.15) 120%)";

  return (
    <div
      className={`backdrop-blur-[50px] flex flex-col relative rounded-[20px] w-full ${entry.addable ? "border border-dashed border-[#a3a3a3]" : "border border-solid border-[#a3a3a3]"}`}
      style={{ backgroundImage: gradient, ...(connected ? { borderTopLeftRadius: "7px", borderColor: "#3d3d3d" } : {}) }}
    >
      <div className="flex flex-col gap-[12px] items-start p-[20px]">
        {entry.timeRange && (
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-black tracking-[-0.325px]">
            {entry.timeRange}
          </p>
        )}
        <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-[26px] text-[#565656] tracking-[-1.3px] whitespace-nowrap">
          {entry.title}
        </p>
        {entry.source && <SourceChip source={entry.source} prefix="Tomado desde" />}
        {entry.why && <WhyLine>{entry.why}</WhyLine>}
        {entry.addable && (
          <button
            onClick={() => setAdded(true)}
            disabled={added}
            className="w-full mt-[4px] rounded-[12px] py-[12px] flex items-center justify-center gap-[8px] transition-all active:opacity-80"
            style={{ background: added ? "#adff19" : "#3d3d3d" }}
          >
            {added ? (
              <>
                <Check size={14} strokeWidth={2.5} className="text-[#3d3d3d]" />
                <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#3d3d3d] text-[14px] tracking-[-0.28px]">Agregado</span>
              </>
            ) : (
              <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[14px] tracking-[-0.28px]">Agregar</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

interface DailyWorkoutCardProps {
  onReservar?: () => void;
  onOpenFab?: () => void;
  onOpenDetail?: () => void;
  onOpenProgramming?: () => void;
  reservedClass?: ReservedClass;
  activities?: ActivityEntry[];
  showMorning?: boolean;
  showAfternoon?: boolean;
  /** Rest day (no programmed session): the timeline leads with a rest milestone, then Mobility. */
  isRestDay?: boolean;
  cardVariant?: 1 | 2 | 3 | 4;
  /** Sleep check-in reports on last night — never shown for days that haven't happened yet. */
  isFutureDay?: boolean;
  /** Overrides the 4 "Actividad del día" block titles (defaults to FBA/Upper Body/HIIT/Midline). */
  blockTitles?: string[];
  /** Weather context merged into the "Actividad del día" milestone, between the pill and the blocks. */
  weatherNote?: { temp: string; caption: string };
  /** Shows the "Run Club" recommendation milestone, above Mobility & recovery. */
  showRunClub?: boolean;
  /** Pre-selects a location in "Donde vas a entrenar?" instead of defaulting to BIGG Recoleta. */
  defaultLocation?: string;
  /** True for the current calendar day — defaults SleepEntry to "approved" and enables the nutrition → day-status completion flow. */
  isToday?: boolean;
  /** Bubbles up from the day-status recap's "Ver mi semana" CTA so the screen can switch to the Actividad tab. */
  onCompleteDay?: () => void;
}

export default function DailyWorkoutCard({ onReservar, onOpenFab, onOpenDetail, onOpenProgramming, reservedClass, activities, showMorning = true, showAfternoon = true, isRestDay = false, cardVariant = 1, isFutureDay = false, blockTitles, weatherNote, showRunClub = false, defaultLocation = "BIGG Recoleta", isToday = false, onCompleteDay }: DailyWorkoutCardProps) {
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [locationSheetFromCta, setLocationSheetFromCta] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [customLocations, setCustomLocations] = useState<string[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TimelineFilter>("todos");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  // Today's timeline reads as already complete except nutrition — sleep defaults to "approved".
  const [sleepApproval, setSleepApproval] = useState<"approved" | "rejected" | null>(isToday ? "approved" : null);
  const isBiggLocation = BIGG_LOCATIONS.has(selectedLocation);
  const isOutdoorsLocation = selectedLocation === "BIGG Outdoors";
  const activeFilterLabel = TIMELINE_FILTERS.find((f) => f.key === selectedFilter)?.label ?? "Todos";
  const showTrainingContent = selectedFilter === "todos" || selectedFilter === "entrenamiento";
  // Sleep/nutrition check-ins report on last night / today — never valid for a day that hasn't happened yet
  const showSleepContent = !isFutureDay && (selectedFilter === "todos" || selectedFilter === "sueno");
  const showNutritionContent = !isFutureDay && (selectedFilter === "todos" || selectedFilter === "nutricion");
  // "Pasos de hoy" is a live counter, so like the sleep/nutrition check-ins it has no
  // meaning on a day that hasn't happened yet.
  const showStepsContent = !isFutureDay && showTrainingContent;
  // Run Club appears on training days (Wed/Sat) whenever training content is visible
  const showRunClubContent = showRunClub && showTrainingContent;
  const isFilterEmpty = !showTrainingContent && !showSleepContent && !showNutritionContent && !showRunClubContent;

  // Defined once so it can render either in its normal slot or hoisted directly under the
  // rest-day milestone, without duplicating the JSX.
  const mobilityMilestone = showAfternoon && showTrainingContent ? (
    <div className="relative z-10 flex flex-col items-start w-full">
      <div className="relative z-10 flex flex-row items-center gap-[10px]">
        <TimePill label="Mobility & recovery" style={CONNECTED_PILL_STYLE} />
      </div>
      <div className="relative z-10 w-full" style={{ transform: "translateY(-15px)" }}>
        <AfternoonRecommendationCard />
      </div>
    </div>
  ) : null;

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setShowLocationSheet(false);
    if (locationSheetFromCta) {
      setLocationSheetFromCta(false);
      onOpenProgramming?.();
    }
  };

  // ── Single unified timeline. The reserved class does NOT get its own separate
  //    timeline: the header, filters, sleep/nutrition/steps and the "Actividad del día"
  //    card shell all stay put, and only that card's *contents* switch. ──
  return (
    <>
    {/* A rest day has nothing to filter, so it drops the "Tu BIGG day" header and the filter
        entirely and is titled by the centred rest block below instead. */}
    {!isRestDay && (
      <div className="relative z-10 flex items-center justify-between w-full mb-[16px] gap-[8px]">
        <p className="shrink-0 font-['MessinaSansWeb:Bold',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.4px] whitespace-nowrap">
          Tu BIGG day
        </p>
        <button
          type="button"
          onClick={() => setShowFilterSheet(true)}
          className="flex items-center gap-[4px] min-w-0 active:opacity-70 transition-opacity"
        >
          <span className="truncate max-w-[130px] font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] text-[#565656] tracking-[-0.28px]">
            {activeFilterLabel}
          </span>
          <ChevronDown size={14} className="text-[#565656] shrink-0" strokeWidth={2} />
        </button>
      </div>
    )}

    {/* Rest-day title — a centred heading ABOVE the timeline, not a milestone inside it:
        icon, then title, then note, all centre-aligned. The timeline starts under it. */}
    {isRestDay && showTrainingContent && (
      <div className="relative w-full mb-[24px]">
        {/* Blurred blue ambience bleeding down behind the start of the timeline — decorative,
            so it is aria-hidden and never intercepts taps. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-[28px] z-0 w-[520px] h-[300px]"
          style={{
            background: "radial-gradient(closest-side, rgba(139,120,230,0.72) 0%, rgba(116,140,235,0.48) 38%, rgba(106,181,255,0.28) 65%, rgba(106,181,255,0) 100%)",
            filter: "blur(36px)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center gap-[8px] px-[20px]">
          <Moon size={30} className="text-[#4a90d9]" strokeWidth={1.5} />
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-[22px] text-[#565656] tracking-[-1.1px] leading-[1.05]">
            Día de descanso
          </p>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.26px] leading-[1.4] max-w-[280px]">
            Tu plan no programa entrenamiento hoy — aprovechá para recuperar.
          </p>
        </div>
      </div>
    )}

    <div className="relative w-full">
      <div className="absolute left-[22px] top-0 bottom-0 w-[2.5px] bg-[#3d3d3d] z-0" />
      <div className="flex flex-col items-start gap-[24px]">

        {/* Rest day: the timeline itself starts with the mobility recommendation, since the
            rest heading now sits above the timeline rather than inside it. */}
        {isRestDay && mobilityMilestone}

        {/* BIGG Class at 10AM */}
        {showMorning && showTrainingContent && (
          <div
            className={cardVariant === 3 ? "relative z-10 flex flex-col items-start w-full bg-[#3d3d3d]" : "relative z-10 flex flex-col items-start gap-[10px] w-full"}
            style={cardVariant === 3 ? { borderRadius: "20px" } : undefined}
          >
            <div className="relative z-10 flex flex-row items-center justify-between w-full">
              <TimePill
                label="Actividad del día"
                style={cardVariant === 3 ? { padding: "12.5px 20px", backgroundColor: "unset" } : undefined}
              />
              <button
                type="button"
                onClick={reservedClass ? onOpenDetail : onOpenProgramming}
                className="shrink-0 p-[8px] active:opacity-60 transition-opacity"
              >
                <ChevronRight size={16} strokeWidth={2} className={cardVariant === 3 ? "text-white" : "text-[#565656]"} />
              </button>
            </div>
            {weatherNote && (
              <div className="relative z-10 flex items-center gap-[6px] w-full px-[20px] pb-[12px]">
                <Sun size={12} className="text-[#f8b32e] shrink-0" />
                <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-white/70 tracking-[-0.24px] leading-[1.2]">
                  <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white">{weatherNote.temp}</span> — {weatherNote.caption}
                </p>
              </div>
            )}
            <div
              className={`relative z-10 w-full flex flex-col items-center ${cardVariant === 3 ? "p-[20px]" : ""}`}
              style={cardVariant === 3 ? { padding: "7.5px 7.5px", paddingTop: 0 } : undefined}
            >
              <div className="relative w-full flex flex-col">
                {/* ── Content area ── */}
                <div
                  className={`backdrop-blur-[50px] flex flex-col gap-[16px] relative z-[2] w-full rounded-[20px] ${cardVariant === 3 ? "overflow-hidden pb-[0]" : "p-[20px]"} ${cardVariant === 1 ? "cursor-pointer active:opacity-90 transition-opacity" : ""}`}
                  style={{
                    backgroundImage: cardVariant === 1
                      ? "linear-gradient(115.214deg, rgba(255, 255, 255, 0.9) 51.472%, rgba(163, 163, 163, 0.9) 114.32%)"
                      : "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(245,245,245,0.97) 100%)",
                  }}
                  onClick={cardVariant === 1 ? onOpenProgramming : undefined}
                >
                  {/* Variant 1 — 2×2 chip grid */}
                  {cardVariant === 1 && (
                    <div className="grid grid-cols-2 gap-[6px] w-full">
                      {BASE_CHIPS.map((chip) => (
                        <div key={chip} className="flex items-center justify-center px-[12px] py-[10px] rounded-[8px] bg-[#ededed]">
                          <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px] whitespace-nowrap">
                            {chip}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Variant 2 — stacked full-width BlockCards */}
                  {cardVariant === 2 && (
                    <div className="flex flex-col gap-[10px] w-full">
                      {DAY_BLOCKS.map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          selected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(selectedBlockId === block.id ? null : block.id)}
                          fullWidth
                        />
                      ))}
                    </div>
                  )}

                  {/* Variant 3, class already booked — the card shell, header and timeline stay
                      identical; only these contents swap for the reserved class. */}
                  {cardVariant === 3 && reservedClass && (
                    <div className="flex flex-col gap-[14px] w-full p-[20px]">
                      <div className="flex flex-col gap-[6px]">
                        <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-[26px] text-[#565656] tracking-[-1.3px] leading-[1.05]">
                          {reservedClass.classType}
                        </p>
                        <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.26px]">
                          {reservedClass.time} · {reservedClass.location}
                        </p>
                      </div>
                      <AttendeeAvatars total={reservedClass.attendeeCount ?? 20} />
                      <div className="grid grid-cols-2 gap-[6px] w-full">
                        {reservedClass.blocks.map((block) => (
                          <div key={block} className="flex items-center justify-center px-[12px] py-[10px] rounded-[8px] bg-[#ededed]">
                            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px] uppercase truncate">
                              {block}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Variant 3 — "Entrenamiento de BIGG" title + small non-expandable block chips */}
                  {cardVariant === 3 && !reservedClass && (
                    <div className="flex flex-col gap-[16px] w-full p-[20px]">
                      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-[26px] text-[#565656] tracking-[-1.3px] leading-[1.05]">
                        Entrenamiento de BIGG
                      </p>
                      <div className="grid grid-cols-2 gap-[6px] w-full">
                        {V4_BLOCKS.map((vb, i) => {
                          const current = isBiggLocation
                            ? { ...vb.bigg, stimulus: blockTitles?.[i] ?? vb.bigg.stimulus }
                            : (vb.away ?? vb.bigg);
                          return (
                            <div key={vb.id} className="flex items-center justify-center px-[12px] py-[10px] rounded-[8px] bg-[#ededed]">
                              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px] uppercase truncate">
                                {i + 1}. {current.stimulus}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Variant 4 — hierarchical block list, animated on location change */}
                  {cardVariant === 4 && (
                    <div className="flex flex-col w-full">
                      {/* Card header */}
                      <div className="flex items-center justify-between pb-[14px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                        <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[10px] text-[#a3a3a3] tracking-[0.8px] uppercase">
                          {isBiggLocation ? "BIGG Class" : "Entrenamiento"}
                        </p>
                        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#a3a3a3] tracking-[-0.24px]">
                          4 bloques · 59'
                        </p>
                      </div>

                      {/* Animated block rows */}
                      {V4_BLOCKS.map((vblock, i) => {
                        const current = isBiggLocation ? vblock.bigg : (vblock.away ?? vblock.bigg);
                        const iconShows = !isBiggLocation && vblock.away === null && vblock.exercisesAdapt;
                        return (
                          <div
                            key={vblock.id}
                            className="flex items-center justify-between py-[13px]"
                            style={{ borderBottom: i < V4_BLOCKS.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}
                          >
                            <div className="flex flex-col gap-[4px] flex-1 min-w-0 pr-[8px]">
                              {/* Name: animates out upward / in from below when key changes */}
                              <div style={{ height: "19px", overflow: "hidden", position: "relative" }}>
                                <AnimatePresence mode="wait" initial={false}>
                                  <motion.p
                                    key={current.stimulus}
                                    initial={{ opacity: 0, y: 7 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -9 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    style={{ position: "absolute", width: "100%", lineHeight: "19px" }}
                                    className="font-['Druk_Wide:Medium',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.4px] uppercase"
                                  >
                                    {current.stimulus}
                                  </motion.p>
                                </AnimatePresence>
                              </div>
                              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[11px] text-[#a3a3a3] tracking-[-0.22px]">
                                {current.modality}
                              </p>
                            </div>
                            <div className="flex items-center gap-[8px] shrink-0">
                              {/* Icon fades in for blocks where exercises adapt but name stays */}
                              <AnimatePresence initial={false}>
                                {iconShows && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                  >
                                    <Sparkles size={12} className="text-[#2ab3cc]" strokeWidth={2} />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#a3a3a3] tracking-[-0.24px]">
                                {current.duration}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Footer: location + CTA — variants 1 and 2 only */}
                  {cardVariant <= 2 && (
                    <div className="flex flex-col gap-[16px]">
                      {!isBiggLocation && (
                        <WhyLine iconSize={18}>Bloques adaptados para entrenar en este espacio</WhyLine>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowLocationSheet(true); }}
                        className="flex items-center gap-[6px] active:opacity-70 transition-opacity self-start"
                      >
                        <MapPin size={20} className="text-[#565656]" strokeWidth={1.75} />
                        <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] text-[#565656] tracking-[-0.28px]">
                          {selectedLocation}
                        </p>
                        <ChevronDown size={14} className="text-[#565656]" strokeWidth={2} />
                      </button>
                    </div>
                  )}
                  {/* v3: adaptation indicator only — CTA is the overlap block below */}
                  {cardVariant === 3 && !isBiggLocation && (
                    <div className="flex items-center gap-[6px] px-[20px] pb-[20px]">
                      <Sparkles size={13} className="text-[#2ab3cc]" strokeWidth={2} />
                      <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#2ab3cc] tracking-[-0.26px]">
                        Bloque cambiado para esta ubicación
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── CTA: v1/v2 = centered overlap; v3 = items-start overlap with location; v4 = dark unified ── */}
              {cardVariant <= 2 ? (
                <button
                  type="button"
                  onClick={isBiggLocation ? onReservar : onOpenProgramming}
                  className="relative z-[1] w-full rounded-b-[16px] pt-[56px] pb-[16px] flex items-center justify-center active:opacity-80 transition-opacity mb-[-56px]"
                  style={{
                    background: isBiggLocation ? "#adff19" : "#3d3d3d",
                    transform: "translateY(-56px)",
                    transition: "background 0.3s ease-in-out, opacity 0.2s",
                  }}
                >
                  <span className={`font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] tracking-[-0.3px] ${isBiggLocation ? "text-[#3d3d3d]" : "text-white"}`}>
                    {isBiggLocation ? "Reservar clase" : "Iniciar entrenamiento"}
                  </span>
                </button>
              ) : cardVariant === 3 && reservedClass ? (
                /* Booked: no location picker (the class has one) and no "Reservar" — the
                   footer confirms the booking and leads into the class detail instead. */
                <div
                  className="relative z-[1] w-full rounded-b-[16px] pt-[150px] pb-[18px] px-[20px] flex flex-col gap-[6px] items-center mb-[-150px]"
                  style={{
                    background: "#adff19",
                    transform: "translateY(-150px)",
                    transition: "background 0.3s ease-in-out, opacity 0.2s",
                  }}
                >
                  <div className="flex items-center gap-[6px] mt-[10px]">
                    <Check size={15} strokeWidth={2.5} className="text-[#3d3d3d]" />
                    <span className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px]">
                      Tenés tu lugar reservado
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenDetail}
                    className="active:opacity-70 transition-opacity rounded-full px-[16px] py-[6px]"
                    style={{ background: "#3d3d3d" }}
                  >
                    <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.34px]">
                      Ver mi clase
                    </span>
                  </button>
                </div>
              ) : cardVariant === 3 ? (
                <div
                  className="relative z-[1] w-full rounded-b-[16px] pt-[150px] pb-[18px] px-[20px] flex flex-col items-start gap-[4px] mb-[-150px]"
                  style={{
                    background: isBiggLocation ? "#adff19" : isOutdoorsLocation ? "#f8b32e" : "#3d3d3d",
                    transform: "translateY(-150px)",
                    transition: "background 0.3s ease-in-out, opacity 0.2s",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowLocationSheet(true); }}
                    className="flex items-center gap-[4px] mt-[10px] active:opacity-70 transition-opacity"
                  >
                    <MapPin size={16} className={isBiggLocation || isOutdoorsLocation ? "text-[#3d3d3d]" : "text-white"} strokeWidth={1.75} />
                    <span className={`font-['MessinaSansWeb:Regular',sans-serif] text-[14px] tracking-[-0.28px] ${isBiggLocation || isOutdoorsLocation ? "text-[#3d3d3d]" : "text-white"}`}>
                      Donde vas a entrenar?{" "}
                    </span>
                    <span className={`font-['MessinaSansWeb:Regular',sans-serif] text-[14px] tracking-[-0.28px] underline ${isBiggLocation || isOutdoorsLocation ? "text-[#3d3d3d]" : "text-white"}`}>
                      {selectedLocation}
                    </span>
                    <ChevronDown size={13} className={isBiggLocation || isOutdoorsLocation ? "text-[#3d3d3d]" : "text-white"} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={isBiggLocation ? onReservar : onOpenProgramming}
                    className="active:opacity-70 transition-opacity rounded-full px-[16px] py-[6px]"
                    style={{ background: isBiggLocation ? "#3d3d3d" : "transparent" }}
                  >
                    <span className={`font-['MessinaSansWeb:SemiBold',sans-serif] text-[17px] tracking-[-0.34px] ${isBiggLocation ? "text-white" : isOutdoorsLocation ? "text-[#3d3d3d]" : "text-white"}`}>
                      {isBiggLocation ? "Reservar clase" : "Iniciar entrenamiento"}
                    </span>
                  </button>
                </div>
              ) : cardVariant === 4 ? (
                <div className="w-full mt-[20px] rounded-[14px] overflow-hidden flex flex-col">
                  {/* Location selector */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowLocationSheet(true); }}
                    className="w-full py-[13px] px-[20px] flex items-center justify-center gap-[6px] active:opacity-80 transition-opacity border-b border-white/10"
                    style={{ background: "#3d3d3d", transition: "opacity 0.2s" }}
                  >
                    <MapPin size={13} className="text-[rgba(255,255,255,0.55)]" strokeWidth={1.75} />
                    <span className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[rgba(255,255,255,0.6)] tracking-[-0.26px]">
                      Donde vas a entrenar?
                    </span>
                    <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-white underline tracking-[-0.26px]">
                      {selectedLocation}
                    </span>
                    <ChevronDown size={11} className="text-white" strokeWidth={2} />
                  </button>
                  {/* Primary CTA — opens location sheet first, then navigates to programming */}
                  <button
                    type="button"
                    onClick={() => { setLocationSheetFromCta(true); setShowLocationSheet(true); }}
                    className="w-full py-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
                    style={{ background: "#adff19", transition: "opacity 0.2s" }}
                  >
                    <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] tracking-[-0.3px] text-[#3d3d3d]">
                      Ver entrenamiento del día
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Sleep check-in — sits below the day's activity card, which leads the timeline */}
        {showSleepContent && <SleepEntry approval={sleepApproval} onApprovalChange={setSleepApproval} onCompleteDay={onCompleteDay} />}

        {/* Additional scheduled activities (e.g. Running pasadas) */}
        {showTrainingContent && activities?.map((activity, i) => (
          <div key={i} className="relative z-10 flex flex-col items-start w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <TimePill label={activity.sectionLabel ?? "Entrenamiento complementario"} style={CONNECTED_PILL_STYLE} />
            </div>
            <div className="relative z-10 w-full" style={{ transform: "translateY(-15px)" }}>
              <ActivityCard entry={activity} connected />
            </div>
          </div>
        ))}

        {/* Run Club recommendation — Wed/Sat, above Mobility */}
        {showRunClubContent && (
          <div className="relative z-10 flex flex-col items-start w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <TimePill label="BIGG Run Club" style={CONNECTED_PILL_STYLE} />
            </div>
            <div className="relative z-10 w-full" style={{ transform: "translateY(-15px)" }}>
              <RunClubRecommendationCard />
            </div>
          </div>
        )}

        {/* Afternoon Mobility recommendation — on a rest day it is hoisted to the top of the
            timeline instead, directly under the rest milestone (see mobilityMilestone above). */}
        {!isRestDay && mobilityMilestone}

        {/* Nutrición + Pasos — side by side at 50% each. `flex-1` (not a hard 50%)
            so whichever one survives the active filter still fills the row on its own.
            Steps are activity data, so they follow the training filter, not the sleep one. */}
        {(showNutritionContent || showStepsContent) && (
          <div className="relative z-10 flex flex-row items-stretch gap-[10px] w-full">
            {showNutritionContent && (
              <div className="relative z-10 flex flex-1 min-w-0 flex-col items-start">
                <div className="relative z-10 flex flex-row items-center gap-[10px]">
                  <TimePill label="Nutrición" style={CONNECTED_PILL_STYLE} />
                </div>
                <div className="relative z-10 w-full flex-1" style={{ transform: "translateY(-15px)" }}>
                  <NutritionEntry isToday={isToday} sleepApproval={sleepApproval} onCompleteDay={onCompleteDay} />
                </div>
              </div>
            )}
            {showStepsContent && <StepsEntry onCompleteDay={onCompleteDay} />}
          </div>
        )}

        {/* Empty state for filters with no matching content yet (e.g. sueño/nutrición on a future day) */}
        {isFilterEmpty && (
          <div className="relative z-10 w-full py-[40px] flex flex-col items-center gap-[6px]">
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] text-[#a3a3a3] tracking-[-0.28px]">
              Todavía no hay actividad de {activeFilterLabel.toLowerCase()}
            </p>
          </div>
        )}

        {/* Add to day */}
        <button
          onClick={onOpenFab}
          className="relative z-[20] w-full rounded-[16px] border border-dashed border-[#858585] py-[16px] flex items-center justify-center gap-[8px] bg-[#ededed] active:opacity-60 transition-opacity"
        >
          <Plus size={16} strokeWidth={2} className="text-[#858585]" />
          <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#858585] text-[14px] tracking-[-0.28px]">
            Agregar
          </span>
        </button>

      </div>
    </div>

    <LocationSheet
      open={showLocationSheet}
      onClose={() => { setShowLocationSheet(false); setLocationSheetFromCta(false); }}
      selected={selectedLocation}
      onSelect={handleLocationSelect}
      customLocations={customLocations}
      onAddLocation={() => { setShowLocationSheet(false); setLocationSheetFromCta(false); setShowAddLocation(true); }}
    />
    <AddLocationScreen
      open={showAddLocation}
      onClose={() => setShowAddLocation(false)}
      onSave={(name) => {
        setCustomLocations((prev) => [...prev, name]);
        setSelectedLocation(name);
        setShowAddLocation(false);
      }}
    />

    <BottomSheet open={showFilterSheet} onClose={() => setShowFilterSheet(false)} title="Filtrar timeline">
      <div className="flex flex-col gap-[8px] px-[20px] pb-[32px]">
        <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.6px] uppercase mb-[8px]">
          Filtrar
        </p>
        {TIMELINE_FILTERS.map((f) => {
          const active = selectedFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => { setSelectedFilter(f.key); setShowFilterSheet(false); }}
              className="w-full flex items-center justify-between px-[16px] py-[14px] rounded-[14px] transition-colors active:opacity-80"
              style={{ background: active ? "#3d3d3d" : "#ededed" }}
            >
              <span className={`font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] tracking-[-0.3px] ${active ? "text-white" : "text-[#3d3d3d]"}`}>
                {f.label}
              </span>
              {active && <Check size={16} strokeWidth={2.5} className="text-white" />}
            </button>
          );
        })}
      </div>
    </BottomSheet>
    </>
  );
}
