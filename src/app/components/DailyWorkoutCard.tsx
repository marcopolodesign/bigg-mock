import { useState } from "react";
import { ChevronDown, MapPin, Plus, Check, Pencil, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SourceChip, { type DataSource } from "./SourceChip";
import WhyLine from "./WhyLine";
import LocationSheet from "./LocationSheet";
import AddLocationScreen from "./AddLocationScreen";
import { BlockCard, type StimulusBlock } from "./ProgrammingSection";

const BASE_CHIPS = ["FBA", "Upper Body", "HIIT", "Midline"];
const BIGG_LOCATIONS = new Set(["BIGG Recoleta", "BIGG Tortuguitas"]);

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

function FlapItem({ block, isOpen, onToggle, index, total, isAdapted = false }: { block: StimulusBlock; isOpen: boolean; onToggle: () => void; index: number; total: number; isAdapted?: boolean }) {
  const isLast = index === total - 1;
  return (
    <div
      className="w-full"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.09)",
        borderLeft: "1px solid rgba(0,0,0,0.09)",
        borderRight: "1px solid rgba(0,0,0,0.09)",
        borderBottom: isLast ? "1px solid rgba(0,0,0,0.09)" : "none",
        borderTopLeftRadius: "14px",
        borderTopRightRadius: "14px",
        borderBottomLeftRadius: isLast ? "14px" : 0,
        borderBottomRightRadius: isLast ? "14px" : 0,
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
      >
        <p className="font-['Druk_Wide:Medium',sans-serif] text-[17px] text-[#3d3d3d] leading-none tracking-[-0.5px] uppercase">
          {block.stimulus}
        </p>
        <div className="flex items-center gap-[8px] shrink-0">
          {isAdapted && <Sparkles size={13} className="text-[#2ab3cc]" strokeWidth={2} />}
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
function TimePill({ label }: { label: string }) {
  return (
    <div className="bg-[#3d3d3d] rounded-full px-[12px] py-[6px] flex items-center justify-center">
      <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-white text-[13px] whitespace-nowrap tracking-[-0.26px] leading-[1.2]">
        {label}
      </p>
    </div>
  );
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
  cardVariant?: 1 | 2 | 3 | 4;
}

export default function DailyWorkoutCard({ onReservar, onOpenFab, onOpenDetail, onOpenProgramming, reservedClass, activities, showMorning = true, showAfternoon = true, cardVariant = 1 }: DailyWorkoutCardProps) {
  const [selectedLocation, setSelectedLocation] = useState("BIGG Recoleta");
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [customLocations, setCustomLocations] = useState<string[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [openFlapId, setOpenFlapId] = useState<string | null>(null);
  const isBiggLocation = BIGG_LOCATIONS.has(selectedLocation);

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
    <>
    <div className="relative w-full">
      <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-[#c4c4c4]" />
      <div className="flex flex-col items-start gap-[24px]">

        {/* BIGG Class at 10AM */}
        {showMorning && (
          <div className="flex flex-col items-start gap-[10px] w-full">
            <div className="relative z-10 flex flex-row items-center justify-between w-full">
              <TimePill label="Entrenamiento del día" />
              {/* v4: location lives here, outside the card */}
              {cardVariant === 4 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowLocationSheet(true); }}
                  className="flex items-center gap-[5px] active:opacity-70 transition-opacity"
                >
                  <MapPin size={14} className="text-[#565656]" strokeWidth={1.75} />
                  <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[12px] text-[#565656] tracking-[-0.24px]">
                    {selectedLocation}
                  </p>
                  <ChevronDown size={11} className="text-[#565656]" strokeWidth={2} />
                </button>
              )}
            </div>
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="relative w-full flex flex-col">
                {/* ── Content area ── */}
                <div
                  className={`backdrop-blur-[50px] flex flex-col gap-[16px] relative z-[2] w-full rounded-[20px] ${cardVariant === 3 ? "pb-[20px]" : "p-[20px]"} ${cardVariant === 1 ? "cursor-pointer active:opacity-90 transition-opacity" : ""}`}
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
                      {DAY_BLOCKS.map((block, i) => (
                        <FlapItem
                          key={block.id}
                          block={block}
                          isOpen={openFlapId === block.id}
                          onToggle={() => setOpenFlapId(openFlapId === block.id ? null : block.id)}
                          index={i}
                          total={DAY_BLOCKS.length}
                          isAdapted={!isBiggLocation}
                        />
                      ))}
                    </div>
                  )}

                  {/* Variant 4 — hierarchical block list, location outside */}
                  {cardVariant === 4 && (
                    <div className="flex flex-col w-full">
                      {/* Card header: class type + total duration */}
                      <div className="flex items-center justify-between pb-[14px]" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                        <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[10px] text-[#a3a3a3] tracking-[0.8px] uppercase">
                          {isBiggLocation ? "BIGG Class" : "Entrenamiento"}
                        </p>
                        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#a3a3a3] tracking-[-0.24px]">
                          4 bloques · 59'
                        </p>
                      </div>

                      {/* Block rows */}
                      {DAY_BLOCKS.map((block, i) => (
                        <div
                          key={block.id}
                          className="flex items-center justify-between py-[13px]"
                          style={{ borderBottom: i < DAY_BLOCKS.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}
                        >
                          <div className="flex flex-col gap-[3px]">
                            <p className="font-['Druk_Wide:Medium',sans-serif] text-[15px] text-[#3d3d3d] leading-none tracking-[-0.4px] uppercase">
                              {block.stimulus}
                            </p>
                            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[11px] text-[#a3a3a3] tracking-[-0.22px]">
                              {block.modality}
                            </p>
                          </div>
                          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#a3a3a3] tracking-[-0.24px] shrink-0">
                            {block.duration}
                          </p>
                        </div>
                      ))}

                      {/* Adapted indicator for non-BIGG locations */}
                      {!isBiggLocation && (
                        <div className="flex items-center gap-[6px] pt-[12px]" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                          <Sparkles size={12} className="text-[#2ab3cc]" strokeWidth={2} />
                          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#2ab3cc] tracking-[-0.24px]">
                            Bloques adaptados para esta ubicación
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer: WhyLine + location — only for variants 1, 2, 3 */}
                  {cardVariant !== 4 && (
                    <div className={`flex flex-col gap-[16px] ${cardVariant === 3 ? "px-[20px]" : ""}`}>
                      {!isBiggLocation && cardVariant !== 3 && (
                        <WhyLine iconSize={18}>Bloques adaptados para entrenar en este espacio</WhyLine>
                      )}
                      {!isBiggLocation && cardVariant === 3 && (
                        <div className="flex items-center gap-[6px]">
                          <Sparkles size={13} className="text-[#2ab3cc]" strokeWidth={2} />
                          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#2ab3cc] tracking-[-0.26px]">
                            Bloque cambiado para esta ubicación
                          </p>
                        </div>
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
                </div>
              </div>

              {/* ── CTA: dominant for v1/2/3; secondary for v4 ── */}
              {cardVariant !== 4 ? (
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
              ) : (
                /* v4: reservar is a secondary action below the card */
                isBiggLocation && (
                  <button
                    type="button"
                    onClick={onReservar}
                    className="w-full mt-[10px] py-[13px] flex items-center justify-center gap-[8px] rounded-[14px] border border-[rgba(0,0,0,0.12)] active:opacity-70 transition-opacity"
                  >
                    <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px]">
                      Reservar clase
                    </span>
                    <ChevronDown size={13} className="text-[#a3a3a3] -rotate-90" strokeWidth={2} />
                  </button>
                )
              )}
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

    <LocationSheet
      open={showLocationSheet}
      onClose={() => setShowLocationSheet(false)}
      selected={selectedLocation}
      onSelect={(loc) => { setSelectedLocation(loc); setShowLocationSheet(false); }}
      customLocations={customLocations}
      onAddLocation={() => { setShowLocationSheet(false); setShowAddLocation(true); }}
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
    </>
  );
}
