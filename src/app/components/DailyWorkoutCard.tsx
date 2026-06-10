import { useState } from "react";
import { Plus, Check, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SourceChip, { type DataSource } from "./SourceChip";
import WhyLine from "./WhyLine";
import svgPaths from "../../imports/BiggDay/svg-03sgvqmew7";

// Dark time pill used as the timeline node label (e.g. "10AM", "18:00hs").
function TimePill({ label }: { label: string }) {
  return (
    <div className="bg-[#3d3d3d] rounded-full px-[12px] py-[6px] flex items-center justify-center">
      <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[13px] whitespace-nowrap tracking-[-0.26px] leading-[1.2]">
        {label}
      </p>
    </div>
  );
}

// ─── Mode tab selector ────────────────────────────────────────────────────────

type WorkoutTabId = "bigg-class" | "home-gym" | "outdoors";

interface WorkoutTabData {
  id: WorkoutTabId;
  label: string;
  title: string;
  chips: string[];
  why: string;
  equipment?: string[];
}

const BASE_CHIPS = ["FBA", "Upper Body", "HIIT", "Midline"];

const WORKOUT_TABS: WorkoutTabData[] = [
  { id: "bigg-class", label: "BIGG Class", title: "Entrenamiento recomendado", chips: BASE_CHIPS, why: "Recomendado: llevás 2 días sin entrenar fuerza" },
  { id: "home-gym", label: "Freeride", title: "Entrenamiento recomendado", chips: ["Upper Body", "Core", "HIIT", "Mobility"], why: "", equipment: ["Mancuernas", "Mat", "Banda elástica"] },
  { id: "outdoors", label: "BIGG Outdoors", title: "Entrenamiento recomendado", chips: ["Running", "Upper Body", "HIIT", "Stretching"], why: "" },
];

function BiggClassIcon() {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p23dee300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HomeGymIcon() {
  return (
    <div className="h-[18px] relative shrink-0 w-[18px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 24 24.8889">
        <path d={svgPaths.p1fab3c00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function OutdoorsIcon() {
  return (
    <div className="h-[18px] relative shrink-0 w-[18px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 23.996 24">
        <path d={svgPaths.pbbc2500} fill="white" />
      </svg>
    </div>
  );
}

function WorkoutTabIcon({ id }: { id: WorkoutTabId }) {
  if (id === "bigg-class") return <BiggClassIcon />;
  if (id === "home-gym") return <HomeGymIcon />;
  return <OutdoorsIcon />;
}

function AfternoonRecommendationCard() {
  const [added, setAdded] = useState(false);

  return (
    <div className="relative rounded-[20px] w-full">
      {/* Solid white bg — sits behind content so opacity doesn't bleed into page grey */}
      <div className="absolute inset-0 bg-white rounded-[20px]" />

      {/* Dashed border — z-10, always on top */}
      <motion.div
        aria-hidden
        className="absolute border border-[#a3a3a3] border-dashed inset-0 pointer-events-none rounded-[20px] z-10"
        animate={{ opacity: added ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* White cover below card — masks the vertical line in the gap to the Agregar button */}
      <div className="absolute left-0 right-0 bg-[#ededed]" style={{ bottom: "-16px", height: "20px", zIndex: 20 }} />

      <motion.div
        className="content-stretch flex flex-col isolate items-center overflow-clip relative rounded-[20px] w-full"
        animate={{ opacity: added ? 1 : 0.55 }}
        transition={{ duration: 0.5 }}
      >
        {/* Single gradient section — WhyLine inline (running pasadas pattern) */}
        <div
          className="backdrop-blur-[50px] content-stretch flex gap-[20px] items-start p-[20px] relative rounded-[20px] shrink-0 w-full"
          style={{ backgroundImage: "linear-gradient(112.876deg, rgba(255,255,255,0.9) 37.068%, rgba(42,179,204,0.9) 114.32%)" }}
        >
          {/* Left: title + chip + why */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative">
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-[26px] text-[#565656] tracking-[-1.3px] whitespace-nowrap">
              Mobility
            </p>
            <div className="bg-[#ededed] px-[12px] py-[4px] rounded-[3px] flex items-center justify-center">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[11px] text-[#565656] tracking-[-0.11px] uppercase whitespace-nowrap">
                BIGG Soft Life
              </p>
            </div>
            <WhyLine>Cooldown recomendado por tu entrenamiento de la mañana en BIGG Recoleta</WhyLine>
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
}

function ActivityCard({ entry }: { entry: ActivityEntry }) {
  const [added, setAdded] = useState(false);
  const gradient = entry.gradient ?? "linear-gradient(115deg, rgba(255,255,255,0.9) 40%, rgba(163,163,163,0.15) 120%)";

  return (
    <div
      className={`backdrop-blur-[50px] flex flex-col relative rounded-[20px] w-full ${entry.addable ? "border border-dashed border-[#a3a3a3]" : "border border-solid border-[#a3a3a3]"}`}
      style={{ backgroundImage: gradient }}
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
}

export default function DailyWorkoutCard({ onReservar, onOpenFab, onOpenDetail, onOpenProgramming, reservedClass, activities, showMorning = true, showAfternoon = true }: DailyWorkoutCardProps) {
  const [activeWorkoutTab, setActiveWorkoutTab] = useState<WorkoutTabId>("bigg-class");
  const active = WORKOUT_TABS.find((t) => t.id === activeWorkoutTab)!;

  if (reservedClass) {
    return (
      <motion.div key="reserved" className="relative w-full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
        <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-[#c4c4c4]" />
        <div className="flex flex-col items-start gap-[24px]">
          <div className="flex flex-col items-start gap-[10px] w-full">
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
            <div key={i} className="flex flex-col items-start gap-[10px] w-full">
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
    <div className="relative w-full">
      <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-[#c4c4c4]" />
      <div className="flex flex-col items-start gap-[24px]">

        {/* BIGG Class at 10AM */}
        {showMorning && (
          <div className="flex flex-col items-start gap-[10px] w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <TimePill label="Entrenamiento del día" />
            </div>
            <div className="relative z-10 w-full flex flex-col items-center">
              {/* Inner card: children own their rounded corners so the indicator can protrude */}
              <div className="relative w-full flex flex-col">
                {/* ── Content area — FIRST ── */}
                <motion.div
                  layout="size"
                  className="backdrop-blur-[50px] flex flex-col gap-[16px] p-[20px] relative w-full cursor-pointer active:opacity-90 transition-opacity rounded-t-[20px]"
                  style={{ backgroundImage: "linear-gradient(115.214deg, rgba(255, 255, 255, 0.9) 51.472%, rgba(163, 163, 163, 0.9) 114.32%)" }}
                  onClick={onOpenProgramming}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                >
                  <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] leading-[1.1] text-[16px] text-[#565656] tracking-[-0.3px]">
                    {active.title}
                  </p>
                  {/* mode="wait": exit first → height animates → new content fades in with delay */}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeWorkoutTab}
                      className="flex flex-col gap-[16px] w-full"
                      initial="entering"
                      animate="visible"
                      exit="exiting"
                      variants={{
                        entering: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.18, delay: 0.18 } },
                        exiting: { opacity: 0, transition: { duration: 0.1 } },
                      }}
                    >
                    {/* Big 2×2 block grid */}
                    <div className="grid grid-cols-2 gap-[6px] w-full">
                      {active.chips.map((chip) => {
                        const changed = activeWorkoutTab !== "bigg-class" && !BASE_CHIPS.includes(chip);
                        return (
                          <div
                            key={chip}
                            className="flex items-center justify-center px-[12px] py-[10px] rounded-[8px]"
                            style={{ background: changed ? "rgba(173,255,25,0.18)" : "#ededed" }}
                          >
                            <p
                              className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] tracking-[-0.3px] whitespace-nowrap"
                              style={{ color: changed ? "#3d6b00" : "#3d3d3d" }}
                            >
                              {chip}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {/* Equipment row (home-gym only) */}
                    {active.equipment && (
                      <div className="flex flex-col gap-[5px]">
                        <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[10px] text-[#a3a3a3] tracking-[-0.2px] uppercase">
                          Equipamiento
                        </p>
                        <div className="flex gap-[6px] flex-wrap">
                          {active.equipment.map((item) => (
                            <div key={item} className="border border-[#c4c4c4] px-[8px] py-[4px] rounded-[6px]">
                              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[11px] text-[#565656] tracking-[-0.22px] whitespace-nowrap">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Dynamic why line */}
                    {(() => {
                      if (activeWorkoutTab === "bigg-class") return <WhyLine iconSize={18}>{active.why}</WhyLine>;
                      const n = active.chips.filter(c => !BASE_CHIPS.includes(c)).length;
                      const msg = n > 0
                        ? `Cambiamos ${n} bloque${n !== 1 ? "s" : ""} porque no tenés el equipamiento`
                        : "Mismos bloques adaptados para este formato";
                      return <WhyLine iconSize={18}>{msg}</WhyLine>;
                    })()}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* ── Mode selector — SECOND ── */}
                <div className="bg-[#3d3d3d] flex items-center justify-between px-[20px] py-[14px] w-full relative rounded-b-[20px]">
                  {WORKOUT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveWorkoutTab(tab.id)}
                      className={`relative cursor-pointer flex gap-[8px] items-center transition-opacity duration-200 ${activeWorkoutTab === tab.id ? "opacity-100" : "opacity-40"}`}
                    >
                      {/* Diamond indicator — layoutId animates via transform (GPU only) */}
                      {activeWorkoutTab === tab.id && (
                        <motion.div
                          layoutId="workout-tab-diamond"
                          className="absolute w-[12px] h-[12px] bg-[#3d3d3d] z-10"
                          style={{ rotate: 45, left: "50%", top: -8, translateX: "-50%", translateY: "-50%" }}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <WorkoutTabIcon id={tab.id} />
                      <p className={`leading-[1.13] text-white text-[13px] tracking-[-0.13px] whitespace-nowrap ${
                        activeWorkoutTab === tab.id
                          ? "font-['MessinaSansWeb:SemiBold',sans-serif] underline underline-offset-2"
                          : "font-['MessinaSansWeb:Regular',sans-serif]"
                      }`}>
                        {tab.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── CTA — THIRD ── CSS transition handles background, no JS animation */}
              <button
                type="button"
                onClick={activeWorkoutTab === "bigg-class" ? onReservar : onOpenProgramming}
                className="w-full rounded-bl-[20px] rounded-br-[20px] mt-[-10px] pt-[26px] pb-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
                style={{
                  background: activeWorkoutTab === "bigg-class" ? "#adff19" : "#3d3d3d",
                  transition: "background 0.3s ease-in-out, opacity 0.2s",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={activeWorkoutTab === "bigg-class" ? "reservar" : "iniciar"}
                    className={`font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] tracking-[-0.3px] ${activeWorkoutTab === "bigg-class" ? "text-[#3d3d3d]" : "text-white"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeWorkoutTab === "bigg-class" ? "Reservar clase" : "Iniciar entrenamiento"}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        )}

        {/* Additional scheduled activities (e.g. Running pasadas) */}
        {activities?.map((activity, i) => (
          <div key={i} className="flex flex-col items-start gap-[10px] w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <TimePill label="Entrenamiento complementario" />
            </div>
            <div className="relative z-10 w-full">
              <ActivityCard entry={activity} />
            </div>
          </div>
        ))}

        {/* Afternoon Mobility recommendation */}
        {showAfternoon && (
          <div className="flex flex-col items-start gap-[10px] w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <TimePill label="Mobility & recovery" />
            </div>
            <div className="relative z-10 w-full">
              <AfternoonRecommendationCard />
            </div>
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
  );
}
