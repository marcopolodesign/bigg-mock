import { useState } from "react";
import { Plus, Check, Sparkles, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../../imports/BiggDay/svg-03sgvqmew7";

type TabId = "bigg-class" | "home-gym" | "outdoors";

interface TabData {
  id: TabId;
  label: string;
  title: string;
  chips: string[];
}

const TABS: TabData[] = [
  { id: "bigg-class", label: "BIGG Class", title: "BIGG Class", chips: ["10:00AM", "BIGG Recoleta"] },
  { id: "home-gym", label: "Home/Gym", title: "Bigg Workout", chips: ["Flexible", "En casa"] },
  { id: "outdoors", label: "Outdoors", title: "Bigg Outdoor Workout", chips: ["07:30AM", "Palermo"] },
];

function BiggClassIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p23dee300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HomeGymIcon() {
  return (
    <div className="h-[24.889px] relative shrink-0 w-[24px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 24 24.8889">
        <path d={svgPaths.p1fab3c00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function OutdoorsIcon() {
  return (
    <div className="h-[24px] relative shrink-0 w-[23.996px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 23.996 24">
        <path d={svgPaths.pbbc2500} fill="white" />
      </svg>
    </div>
  );
}

function TabIcon({ id }: { id: TabId }) {
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
        {/* Top: gradient section */}
        <div
          className="backdrop-blur-[50px] content-stretch flex gap-[20px] items-start mb-[-34px] p-[20px] relative rounded-bl-[20px] rounded-br-[20px] shrink-0 w-full z-[2]"
          style={{ backgroundImage: "linear-gradient(112.876deg, rgba(255,255,255,0.9) 37.068%, rgba(42,179,204,0.9) 114.32%)" }}
        >
          {/* Left: title + chip */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px relative">
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-[26px] text-[#565656] tracking-[-1.3px] whitespace-nowrap">
              Mobility
            </p>
            <div className="bg-[#ededed] px-[12px] py-[4px] rounded-[3px] flex items-center justify-center">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[11px] text-[#565656] tracking-[-0.11px] uppercase whitespace-nowrap">
                BIGG Soft Life
              </p>
            </div>
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

        {/* Bottom: AI recommendation */}
        <div className="bg-[rgba(255,255,255,0.8)] content-stretch flex gap-[10px] items-center pb-[15px] pt-[45px] px-[10px] relative shrink-0 w-full z-[1]">
          <Sparkles size={18} strokeWidth={1.5} className="text-[#2ab3cc] shrink-0" />
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] flex-[1_0_0] font-['MessinaSansWeb:Regular',sans-serif] text-[#2ab3cc] text-[13px] tracking-[-0.13px] leading-[1.13] min-w-px">
            Cooldown recomendado por tu entrenamiento de la mañana en BIGG Recoleta
          </p>
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

function ReservedClassCard({ data }: { data: ReservedClass }) {
  return (
    <div
      className="backdrop-blur-[50px] border border-[#a3a3a3] border-solid flex gap-[20px] items-start p-[20px] relative rounded-[20px] w-full"
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
    </div>
  );
}

export interface ActivityEntry {
  time: string;
  timeRange?: string;
  title: string;
  gradient?: string;
  source?: "strava";
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
        {entry.source === "strava" && (
          <div className="flex items-center gap-[6px] bg-[rgba(252,76,2,0.1)] px-[10px] py-[5px] rounded-full">
            <div className="size-[7px] rounded-full bg-[#fc4c02]" />
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#fc4c02] text-[12px] tracking-[-0.24px] whitespace-nowrap">
              Tomado desde Strava
            </p>
          </div>
        )}
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
  onConfirmWorkout?: (data: ReservedClass) => void;
  onOpenFab?: () => void;
  reservedClass?: ReservedClass;
  activities?: ActivityEntry[];
  showMorning?: boolean;
  showAfternoon?: boolean;
}

function buildReservedClass(tab: TabData): ReservedClass {
  return {
    time: tab.chips[0],
    location: tab.chips[1] ?? "",
    classType: tab.title,
    blocks: ["1. UPPER BODY", "2. STRENGTH", "3. FBA", "4. MIDLINE"],
    attendeeCount: tab.id === "bigg-class" ? 26 : 0,
  };
}

export default function DailyWorkoutCard({ onReservar, onConfirmWorkout, onOpenFab, reservedClass, activities, showMorning = true, showAfternoon = true }: DailyWorkoutCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("bigg-class");
  const active = TABS.find((t) => t.id === activeTab)!;

  if (reservedClass) {
    return (
      <motion.div key="reserved" className="relative w-full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
        <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-[#c4c4c4]" />
        <div className="flex flex-col items-start gap-[24px]">
          <div className="flex flex-col items-start gap-[10px] w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <div className="bg-[#3d3d3d] rounded-full px-[12px] py-[6px] flex items-center justify-center">
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[13px] whitespace-nowrap tracking-[-0.26px] leading-[1.2]">
                  {reservedClass.time}
                </p>
              </div>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] italic text-[#a3a3a3] text-[13px] tracking-[-0.26px]">
                {reservedClass.location}
              </p>
            </div>
            <div className="relative z-10 w-full">
              <ReservedClassCard data={reservedClass} />
            </div>
          </div>
          {/* Additional activity entries */}
          {activities?.map((activity, i) => (
            <div key={i} className="flex flex-col items-start gap-[10px] w-full">
              <div className="relative z-10 flex flex-row items-center gap-[10px]">
                <div className="bg-[#3d3d3d] rounded-full px-[12px] py-[6px] flex items-center justify-center">
                  <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[13px] whitespace-nowrap tracking-[-0.26px] leading-[1.2]">
                    {activity.time}
                  </p>
                </div>
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

  const isClassReservation = activeTab === "bigg-class";

  return (
    <div className="flex flex-col gap-[15px] items-start relative shrink-0 w-full">
      {/* Section title */}
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['MessinaSansWeb:Bold',sans-serif] text-[18px] text-[#3d3d3d] tracking-[-0.45px]">
        Tu BIGG day recomendado
      </p>

      {/* Timeline: both entries stacked, vertical line runs behind all */}
      <div className="relative w-full">
        {/* Vertical line spanning both entries + tail below */}
        <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-[#c4c4c4]" />

        <div className="flex flex-col items-start gap-[24px]">

          {/* ── Entry 1: 10AM ── */}
          {showMorning && <div className="flex flex-col items-start gap-[10px] w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <div className="bg-[#3d3d3d] rounded-full px-[12px] py-[6px] flex items-center justify-center">
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[13px] whitespace-nowrap tracking-[-0.26px] leading-[1.2]">
                  10AM
                </p>
              </div>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] italic text-[#a3a3a3] text-[13px] tracking-[-0.26px]">
                Tu entrenamiento del día
              </p>
            </div>
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="overflow-clip relative rounded-[20px] w-full">
                {/* Diamond indicator */}
                <div
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-[20px]"
                  style={{
                    top: "49px",
                    left: activeTab === "bigg-class" ? "16%" : activeTab === "home-gym" ? "50%" : "84%",
                    transition: "left 0.2s ease-in-out",
                  }}
                >
                  <div className="-rotate-45">
                    <div className="bg-[#3d3d3d] relative rounded-[1.5px] size-[14px]" />
                  </div>
                </div>
                {/* Tab selector */}
                <div className="bg-[#3d3d3d] content-stretch flex items-center justify-between mb-[-34px] pb-[45px] pt-[15px] px-[20px] relative rounded-[20px] shrink-0 w-full">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`content-stretch cursor-pointer flex gap-[10px] items-center relative shrink-0 transition-opacity duration-200 ${activeTab === tab.id ? "opacity-100" : "opacity-40"}`}
                    >
                      <TabIcon id={tab.id} />
                      <p
                        className={`[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid leading-[1.13] not-italic relative shrink-0 text-white text-[13px] text-left tracking-[-0.13px] whitespace-nowrap ${
                          activeTab === tab.id
                            ? "font-['MessinaSansWeb:SemiBold',sans-serif] underline"
                            : "font-['MessinaSansWeb:Regular',sans-serif]"
                        }`}
                      >
                        {tab.label}
                      </p>
                    </button>
                  ))}
                </div>
                {/* Content area */}
                <div
                  className="backdrop-blur-[50px] content-stretch flex gap-[20px] items-center p-[20px] relative rounded-bl-[20px] rounded-br-[20px] rounded-tl-[8px] rounded-tr-[20px] shrink-0 w-full"
                  style={{ backgroundImage: "linear-gradient(115.214deg, rgba(255, 255, 255, 0.9) 51.472%, rgba(163, 163, 163, 0.9) 114.32%)" }}
                >
                  <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative">
                    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0">
                      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Druk_Wide:Medium',sans-serif] leading-[27px] not-italic relative shrink-0 text-[26px] text-[#565656] tracking-[-1.3px]">
                        {active.title}
                      </p>
                      <div className="content-stretch flex gap-[15px] items-start relative shrink-0">
                        {active.chips.map((chip) => (
                          <div key={chip} className="bg-[#ededed] content-stretch flex items-center justify-center p-[7.5px] relative rounded-[8px] shrink-0">
                            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[13px] text-black tracking-[-0.325px] whitespace-nowrap">
                              {chip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Reservar clase / Entrenar button */}
              <button
                onClick={isClassReservation ? onReservar : () => onConfirmWorkout?.(buildReservedClass(active))}
                className="w-full bg-[#adff19] rounded-bl-[20px] rounded-br-[20px] mt-[-10px] pt-[26px] pb-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
              >
                <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#3d3d3d] text-[15px] tracking-[-0.3px]">
                  {isClassReservation ? "Reservar clase" : "Entrenar"}
                </span>
              </button>
            </div>
          </div>}

          {/* ── Additional activity entries (non-reserved state) ── */}
          {activities?.map((activity, i) => (
            <div key={i} className="flex flex-col items-start gap-[10px] w-full">
              <div className="relative z-10 flex flex-row items-center gap-[10px]">
                <div className="bg-[#3d3d3d] rounded-full px-[12px] py-[6px] flex items-center justify-center">
                  <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[13px] whitespace-nowrap tracking-[-0.26px] leading-[1.2]">
                    {activity.time}
                  </p>
                </div>
              </div>
              <div className="relative z-10 w-full">
                <ActivityCard entry={activity} />
              </div>
            </div>
          ))}

          {/* ── Entry 2: Afternoon recommendation ── */}
          {showAfternoon && <div className="flex flex-col items-start gap-[10px] w-full">
            <div className="relative z-10 flex flex-row items-center gap-[10px]">
              <div className="bg-[#3d3d3d] rounded-full px-[12px] py-[6px] flex items-center justify-center">
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[13px] whitespace-nowrap tracking-[-0.26px] leading-[1.2]">
                  Afternoon
                </p>
              </div>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] italic text-[#a3a3a3] text-[13px] tracking-[-0.26px]">
                Mobility & recovery
              </p>
            </div>
            <div className="relative z-10 w-full">
              <AfternoonRecommendationCard />
            </div>
          </div>}

          {/* ── Add to day — always shown ── */}
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
    </div>
  );
}
