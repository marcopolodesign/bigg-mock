import { useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { ChevronDown, ChevronRight, MapPin, Plus, Check, Pencil, Sparkles, Moon, ThumbsUp, ThumbsDown, Utensils, Sun, Clock, CalendarPlus } from "lucide-react";
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

type TimelineFilter = "todos" | "entrenamiento" | "sueno" | "nutricion" | "social";
const TIMELINE_FILTERS: { key: TimelineFilter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "entrenamiento", label: "Entrenamiento y actividad" },
  { key: "sueno", label: "Sueño" },
  { key: "nutricion", label: "Nutrición" },
  { key: "social", label: "Social" },
];
const BIGG_LOCATIONS = new Set(["BIGG Recoleta", "BIGG Tortuguitas"]);

// TimePill style shared by every non-"Entrenamiento del día" milestone — squares off
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
type NPSStatus = "green" | "yellow" | "red" | "pending";
const NPS_STATUS_META: Record<NPSStatus, { color: string; label: string }> = {
  green: { color: "#3ecf5f", label: "Excelente" },
  yellow: { color: "#f8b32e", label: "Bien" },
  red: { color: "#ff5c5c", label: "A mejorar" },
  pending: { color: "#c4c4c4", label: "En curso" },
};
const WEEKLY_NPS_MOCK: { day: string; status: NPSStatus }[] = [
  { day: "Lunes", status: "green" },
  { day: "Martes", status: "green" },
  { day: "Miércoles", status: "yellow" },
  { day: "Jueves", status: "green" },
  { day: "Viernes", status: "yellow" },
  { day: "Sábado", status: "red" },
  { day: "Domingo", status: "pending" },
];

function WeeklyNPSCard() {
  return (
    <div className="relative z-10 w-full rounded-[16px] overflow-hidden bg-white" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="flex flex-col gap-[2px] p-[16px]">
        <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px]">
          Tu semana
        </p>
        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.24px]">
          Entrenamiento, actividad, sueño y nutrición combinados
        </p>
      </div>
      <div className="flex flex-col">
        {WEEKLY_NPS_MOCK.map((row, i) => {
          const meta = NPS_STATUS_META[row.status];
          return (
            <div
              key={row.day}
              className="flex items-center justify-between px-[16px] py-[12px]"
              style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none" }}
            >
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px]">
                {row.day}
              </p>
              <div className="flex items-center gap-[8px]">
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px]" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <div className="rounded-full size-[10px] shrink-0" style={{ background: meta.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

const FLAP_OVERLAP = 12;

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

function FlapItem({ block, isOpen, onToggle, index, total, displayStimulus, stimulusKey, showAdaptIcon = false, duration }: { block: StimulusBlock; isOpen: boolean; onToggle: () => void; index: number; total: number; displayStimulus?: string; stimulusKey?: string; showAdaptIcon?: boolean; duration?: string }) {
  const isLast = index === total - 1;
  const titleText = displayStimulus ?? block.stimulus;
  const titleKey = stimulusKey ?? block.stimulus;
  return (
    <div
      className="w-full"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.09)",
        borderLeft: "1px solid rgba(0,0,0,0.09)",
        borderRight: "1px solid rgba(0,0,0,0.09)",
        borderBottom: "none",
        borderTopLeftRadius: isLast ? 0 : "14px",
        borderTopRightRadius: isLast ? 0 : "14px",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingBottom: isLast ? 0 : FLAP_OVERLAP,
        marginTop: index > 0 ? -FLAP_OVERLAP : 0,
        position: "relative",
        zIndex: total - index,
      }}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="w-full flex items-center justify-between px-[16px] py-[14px] active:opacity-70 transition-opacity"
        style={isLast ? { borderRadius: 0 } : undefined}
      >
        <div style={{ height: "21px", overflow: "hidden", position: "relative", flex: 1 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={titleKey}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ position: "absolute", lineHeight: "21px" }}
              className="font-['Druk_Wide:Medium',sans-serif] text-[17px] text-[#3d3d3d] tracking-[-0.5px] uppercase"
            >
              {titleText}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-[8px] shrink-0">
          {duration && (
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#a3a3a3] tracking-[-0.24px]">
              {duration}
            </p>
          )}
          <AnimatePresence initial={false}>
            {showAdaptIcon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.22 }}
              >
                <Sparkles size={13} className="text-[#2ab3cc]" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
            <ChevronDown size={14} className="text-[#a3a3a3]" strokeWidth={2} />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-[16px] pb-[16px] flex flex-col gap-[10px]">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[10px] text-[#a3a3a3] tracking-[0.6px] uppercase">
                {block.modality}
              </p>
              <div className="flex flex-col gap-[6px]">
                {block.movements.map((mv, i) => (
                  <p key={i} className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#3d3d3d] leading-[1.35]">
                    {mv}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

// Sleep summary at top of timeline — quality approve/disapprove + details sheet
function SleepEntry() {
  const [approval, setApproval] = useState<"approved" | "rejected" | null>(null);
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
        </div>
      </BottomSheet>
    </>
  );
}

// Nutrition check-in — same pattern as SleepEntry (approve/disapprove + toast + details sheet)
function NutritionEntry() {
  const [approval, setApproval] = useState<"approved" | "rejected" | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  return (
    <>
      <motion.div
        role="button"
        tabIndex={0}
        whileTap={{ scale: 0.98 }}
        onClick={openDetails}
        className="relative z-10 flex items-center gap-[10px] w-full px-[16px] py-[14px] rounded-[16px] cursor-pointer"
        style={{ background: "linear-gradient(135deg, rgba(242,153,74,0.16) 0%, rgba(242,153,74,0.08) 100%)" }}
      >
        <Utensils size={13} className="text-[#f2994a] shrink-0" />
        <p className="flex-1 font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.26px] leading-[1.2]">
          ¿Comiste bien hoy?
        </p>
        <div className="flex items-center gap-[6px] shrink-0">
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
          <SourceChip source="myfitnesspal" prefix="Tomado desde" />
          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-col gap-[2px]">
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] text-[#3d3d3d] tracking-[-0.26px]">
                ¿Cómo te cayó la comida?
              </p>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.24px]">
                Sumá tags para trackear tu digestión y energía
              </p>
            </div>
            <div className="flex flex-wrap gap-[8px]">
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
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

// Wind-down recommendation at bottom of timeline
function WindDownCard() {
  const [added, setAdded] = useState(false);
  return (
    <div className="relative z-10 flex flex-col items-start w-full">
      <div className="relative z-10 flex flex-row items-center gap-[10px]">
        <TimePill label="Wind down" style={CONNECTED_PILL_STYLE} />
      </div>
      <div className="relative z-10 w-full rounded-[16px] overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(235,231,255,0.95) 100%)", border: "1px solid #3d3d3d", borderTopLeftRadius: "7px", transform: "translateY(-15px)" }}>
        <div className="flex items-center justify-between px-[16px] py-[14px] gap-[12px]">
          <div className="flex flex-col gap-[2px] flex-1 min-w-0">
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px] leading-[1.3]">
              Rutina nocturna · 22:00hs
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.24px] leading-[1.3]">
              10 min de respiración + stretching para mejorar tu sueño
            </p>
          </div>
          <motion.button
            type="button"
            onClick={() => setAdded((v) => !v)}
            whileTap={{ scale: 0.92 }}
            className="shrink-0 w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors"
            style={{ background: added ? "#8b78e6" : "rgba(139,120,230,0.15)" }}
          >
            {added
              ? <Check size={15} strokeWidth={2.5} className="text-white" />
              : <Plus size={15} strokeWidth={2.5} className="text-[#8b78e6]" />
            }
          </motion.button>
        </div>
      </div>
    </div>
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

function ReservedClassCard({ data, onTap }: { data: ReservedClass; onTap?: () => void }) {
  return (
    <button
      onClick={onTap}
      className="backdrop-blur-[50px] border border-[#a3a3a3] border-solid flex gap-[20px] items-start p-[20px] relative rounded-[20px] w-full text-left active:opacity-80 transition-opacity"
      style={{ backgroundImage: "linear-gradient(105.33deg, rgba(255,255,255,0.9) 37%, rgba(222,255,163,0.9) 114%)" }}
    >
      <div className="flex flex-1 flex-col gap-[16px] items-start min-w-0">
        <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] leading-[normal] text-[26px] text-[#565656] tracking-[-1.3px] whitespace-nowrap">
          {data.classType}
        </p>
        <AttendeeAvatars total={data.attendeeCount ?? 20} />
        <div className="flex flex-wrap gap-[8px]">
          {data.blocks.map((block) => (
            <div key={block} className="bg-[#ededed] flex items-center justify-center px-[10px] py-[4px] rounded-[3px]">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[11px] text-[#565656] tracking-[-0.11px] uppercase whitespace-nowrap">
                {block}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Pencil size={16} className="text-[#565656] opacity-40 shrink-0 mt-[2px]" />
    </button>
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
  cardVariant?: 1 | 2 | 3 | 4;
  /** Sleep check-in reports on last night — never shown for days that haven't happened yet. */
  isFutureDay?: boolean;
  /** Overrides the 4 "Entrenamiento del día" block titles (defaults to FBA/Upper Body/HIIT/Midline). */
  blockTitles?: string[];
  /** Weather context merged into the "Entrenamiento del día" milestone, between the pill and the blocks. */
  weatherNote?: { temp: string; caption: string };
  /** Shows the "Run Club" recommendation milestone, above Mobility & recovery. */
  showRunClub?: boolean;
  /** Pre-selects a location in "Donde vas a entrenar?" instead of defaulting to BIGG Recoleta. */
  defaultLocation?: string;
  /** Shows the weekly NPS recap at the end of the timeline — Sundays only. */
  showWeeklyNPS?: boolean;
}

export default function DailyWorkoutCard({ onReservar, onOpenFab, onOpenDetail, onOpenProgramming, reservedClass, activities, showMorning = true, showAfternoon = true, cardVariant = 1, isFutureDay = false, blockTitles, weatherNote, showRunClub = false, defaultLocation = "BIGG Recoleta", showWeeklyNPS = false }: DailyWorkoutCardProps) {
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [locationSheetFromCta, setLocationSheetFromCta] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [customLocations, setCustomLocations] = useState<string[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [openFlapId, setOpenFlapId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TimelineFilter>("todos");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const isBiggLocation = BIGG_LOCATIONS.has(selectedLocation);
  const isOutdoorsLocation = selectedLocation === "BIGG Outdoors";
  const activeFilterLabel = TIMELINE_FILTERS.find((f) => f.key === selectedFilter)?.label ?? "Todos";
  const showTrainingContent = selectedFilter === "todos" || selectedFilter === "entrenamiento";
  // Sleep/nutrition check-ins report on last night / today — never valid for a day that hasn't happened yet
  const showSleepContent = !isFutureDay && (selectedFilter === "todos" || selectedFilter === "sueno");
  const showNutritionContent = !isFutureDay && (selectedFilter === "todos" || selectedFilter === "nutricion");
  // Run Club also counts as "Social" content, in addition to training days (Wed/Sat)
  const showRunClubContent = showRunClub && (showTrainingContent || selectedFilter === "social");
  const isFilterEmpty = !showTrainingContent && !showSleepContent && !showNutritionContent && !showRunClubContent;

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setShowLocationSheet(false);
    if (locationSheetFromCta) {
      setLocationSheetFromCta(false);
      onOpenProgramming?.();
    }
  };

  if (reservedClass) {
    return (
      <motion.div key="reserved" className="relative w-full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
        <div className="absolute left-[22px] top-0 bottom-0 w-[2.5px] bg-[#3d3d3d] z-0" />
        <div className="flex flex-col items-start gap-[24px]">
          <div className="relative z-10 flex flex-col items-start gap-[10px] w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <TimePill label={reservedClass.time} />
              <p className="font-['MessinaSansWeb:Regular',sans-serif] italic text-[#a3a3a3] text-[13px] tracking-[-0.26px]">
                {reservedClass.location}
              </p>
            </div>
            <div className="relative z-10 w-full">
              <ReservedClassCard data={reservedClass} onTap={onOpenDetail} />
            </div>
          </div>
          {/* Additional activity entries */}
          {activities?.map((activity, i) => (
            <div key={i} className="relative z-10 flex flex-col items-start gap-[10px] w-full">
              <div className="relative z-10 flex flex-row items-center gap-[10px]">
                <TimePill label={activity.time} />
              </div>
              <div className="relative z-10 w-full">
                <ActivityCard entry={activity} />
              </div>
            </div>
          ))}

          <button
            onClick={onOpenFab}
            className="relative z-10 w-full rounded-[16px] border border-dashed border-[#858585] py-[16px] flex items-center justify-center gap-[8px] active:opacity-60 transition-opacity"
          >
            <Plus size={16} strokeWidth={2} className="text-[#858585]" />
            <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#858585] text-[14px] tracking-[-0.28px]">
              Agregar
            </span>
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Single unified timeline (recommendation state) ──
  return (
    <>
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
    <div className="relative w-full">
      <div className="absolute left-[22px] top-0 bottom-0 w-[2.5px] bg-[#3d3d3d] z-0" />
      <div className="flex flex-col items-start gap-[24px]">

        {/* Sleep summary — timeline starts here */}
        {showSleepContent && <SleepEntry />}

        {/* BIGG Class at 10AM */}
        {showMorning && showTrainingContent && (
          <div
            className={cardVariant === 3 ? "relative z-10 flex flex-col items-start w-full bg-[#3d3d3d]" : "relative z-10 flex flex-col items-start gap-[10px] w-full"}
            style={cardVariant === 3 ? { borderRadius: "20px" } : undefined}
          >
            <div className="relative z-10 flex flex-row items-center justify-between w-full">
              <TimePill
                label="Entrenamiento del día"
                style={cardVariant === 3 ? { padding: "12.5px 20px", backgroundColor: "unset" } : undefined}
              />
              <button
                type="button"
                onClick={onOpenProgramming}
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

                  {/* Variant 3 — accordion flaps */}
                  {cardVariant === 3 && (
                    <div className="flex flex-col w-full">
                      {DAY_BLOCKS.map((block, i) => {
                        const vb = V4_BLOCKS[i];
                        const current = isBiggLocation
                          ? { ...vb.bigg, stimulus: blockTitles?.[i] ?? vb.bigg.stimulus }
                          : (vb.away ?? vb.bigg);
                        const showAdaptIcon = !isBiggLocation && vb.away === null && vb.exercisesAdapt;
                        return (
                          <FlapItem
                            key={block.id}
                            block={block}
                            isOpen={openFlapId === block.id}
                            onToggle={() => setOpenFlapId(openFlapId === block.id ? null : block.id)}
                            index={i}
                            total={DAY_BLOCKS.length}
                            displayStimulus={current.stimulus}
                            stimulusKey={current.stimulus}
                            showAdaptIcon={showAdaptIcon}
                            duration={current.duration}
                          />
                        );
                      })}
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

        {/* Run Club recommendation — Wed/Sat, above Mobility; also counts as "Social" content */}
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

        {/* Afternoon Mobility recommendation */}
        {showAfternoon && showTrainingContent && (
          <div className="relative z-10 flex flex-col items-start w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <TimePill label="Mobility & recovery" style={CONNECTED_PILL_STYLE} />
            </div>
            <div className="relative z-10 w-full" style={{ transform: "translateY(-15px)" }}>
              <AfternoonRecommendationCard />
            </div>
          </div>
        )}

        {/* Nutrition check-in */}
        {showNutritionContent && <NutritionEntry />}

        {/* Wind-down recommendation */}
        {showSleepContent && <WindDownCard />}

        {/* Weekly NPS recap — end of day, Sundays only */}
        {showWeeklyNPS && (
          <div className="relative z-10 flex flex-col items-start w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <TimePill label="Tu NPS semanal" style={CONNECTED_PILL_STYLE} />
            </div>
            <div className="relative z-10 w-full" style={{ transform: "translateY(-15px)" }}>
              <WeeklyNPSCard />
            </div>
          </div>
        )}

        {/* Empty state for filters with no matching content yet (Social) */}
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
