import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../../imports/BiggDay/svg-03sgvqmew7";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StimulusBlock {
  id: string;
  stimulus: string;
  modality: string;
  duration: string;
  movements: string[];
  gradient: string;
  textColor?: string;
}

interface ProgrammingRow {
  label: string;
  isWarmup?: boolean;
  blocks: StimulusBlock[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROGRAMMING_ROWS: ProgrammingRow[] = [
  {
    label: "BLOQUE 1",
    blocks: [
      { id: "b1-lb", stimulus: "Lower Body", modality: "Strength · 5 sets", duration: "20'", movements: ["Back Squat 4 × 5 @80%", "Romanian Deadlift 3 × 8", "Hip Thrust 3 × 10", "Goblet Squat 2 × 15"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #ededed 100%)" },
      { id: "b1-ub", stimulus: "Upper Body", modality: "Strength · 5 sets", duration: "20'", movements: ["Bench Press 4 × 5 @80%", "Weighted Pull-up 3 × 6", "DB Row 3 × 10 c/lado", "Face Pull 2 × 15"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e8eeff 100%)" },
      { id: "b1-fb", stimulus: "Full Body", modality: "Strength · 4 sets", duration: "22'", movements: ["Power Clean 4 × 3", "Push Press 3 × 8", "Front Squat 3 × 8", "Ring Row 3 × 10"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #edfde0 100%)" },
      { id: "b1-hi", stimulus: "HIIT", modality: "AMRAP · 12'", duration: "12'", movements: ["Thruster × 10", "Box Jump × 10", "KB Swing × 15", "Burpee × 8"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff0e0 100%)" },
      { id: "b1-ca", stimulus: "Cardio", modality: "Steady State · 20'", duration: "20'", movements: ["Row 5' @75% FC max", "Bike 8' @70% FC max", "Run 1.200m @conversacional", "Row 3' @80% FC max"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0f7ff 100%)" },
      { id: "b1-st", stimulus: "Strenght", modality: "For Quality · 3 sets", duration: "15'", movements: ["GHD Sit-up 3 × 15", "Pallof Press 3 × 12 c/lado", "L-Hold 3 × 30''", "Ab Wheel 3 × 10"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #f5f0ff 100%)" },
      { id: "b1-fba", stimulus: "FBA", modality: "Superset · 3 sets", duration: "15'", movements: ["SA DB Press 3 × 10 c/lado", "Nordic Curl 3 × 8", "Copenhagen Plank 3 × 30''", "Bulgarian Split 3 × 10 c/lado"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0fff5 100%)" },
      { id: "b1-hy", stimulus: "Hypertrophy", modality: "Hypertrophy · 4 sets", duration: "18'", movements: ["DB Curl 4 × 12", "Tricep Pushdown 4 × 12", "Lateral Raise 3 × 15", "Cable Row 3 × 12"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff8e0 100%)" },
    ],
  },
  {
    label: "BLOQUE 2",
    blocks: [
      { id: "b2-lb", stimulus: "Lower Body", modality: "Metcon · 12'", duration: "12'", movements: ["KB Deadlift × 12", "Goblet Squat × 10", "Step Up × 10 c/lado", "Lunge × 10 c/lado"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #ededed 100%)" },
      { id: "b2-ub", stimulus: "Upper Body", modality: "Metcon · 12'", duration: "12'", movements: ["Push-up × 15", "Ring Row × 12", "DB Push Press × 10", "Band Pull-apart × 20"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e8eeff 100%)" },
      { id: "b2-fb", stimulus: "Full Body", modality: "AMRAP · 12'", duration: "12'", movements: ["Thruster × 10", "Pull-up × 5", "Box Jump × 8", "Sit-up × 15"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #edfde0 100%)" },
      { id: "b2-hi", stimulus: "HIIT", modality: "Tabata · 8'", duration: "8'", movements: ["Jumping Squat × 20''", "Mountain Climber × 20''", "Jump Rope × 20''", "Push-up × 20''"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff0e0 100%)" },
      { id: "b2-ca", stimulus: "Cardio", modality: "EMOM · 12'", duration: "12'", movements: ["12 Cal Row", "10 Cal Bike", "200m Run", "15 Cal Ski"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0f7ff 100%)" },
      { id: "b2-st", stimulus: "Strenght", modality: "For Quality · 3 sets", duration: "12'", movements: ["Hollow Hold 3 × 30''", "V-Up 3 × 15", "Tuck L-Hold 3 × 20''", "Windmill 3 × 8 c/lado"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #f5f0ff 100%)" },
      { id: "b2-fba", stimulus: "FBA", modality: "Circuit · 3 sets", duration: "15'", movements: ["Single Leg DL 3 × 10 c/lado", "Cossack Squat 3 × 8 c/lado", "Lateral Lunge 3 × 10", "Hip Hinge 3 × 12"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0fff5 100%)" },
      { id: "b2-hy", stimulus: "Hypertrophy", modality: "Giant Set · 4 sets", duration: "18'", movements: ["Leg Extension 4 × 15", "Leg Curl 4 × 15", "Calf Raise 4 × 20", "Hip Thrust 4 × 12"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff8e0 100%)" },
    ],
  },
  {
    label: "BLOQUE 3",
    blocks: [
      { id: "b3-lb", stimulus: "Lower Body", modality: "Superset · 4 sets", duration: "15'", movements: ["Hip Thrust 4 × 12", "Lateral Band Walk 4 × 15", "Glute Bridge 4 × 15", "Clamshell 3 × 20"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #ededed 100%)" },
      { id: "b3-ub", stimulus: "Upper Body", modality: "Superset · 4 sets", duration: "15'", movements: ["Face Pull 4 × 15", "Band Pull-apart 4 × 20", "External Rotation 3 × 15", "Y-Raise 3 × 15"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e8eeff 100%)" },
      { id: "b3-fb", stimulus: "Full Body", modality: "For Quality · 3 sets", duration: "18'", movements: ["Turkish Get-up 3 × 3 c/lado", "KB Windmill 3 × 5 c/lado", "Bear Complex 3 × 5", "Man Maker 3 × 5"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #edfde0 100%)" },
      { id: "b3-hi", stimulus: "HIIT", modality: "For Time · 10'", duration: "10'", movements: ["Double Under × 50", "Box Step-up × 20", "KB Snatch × 10 c/lado", "Ring Dip × 10"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff0e0 100%)" },
      { id: "b3-ca", stimulus: "Cardio", modality: "Recovery · 15'", duration: "15'", movements: ["Easy Bike @60% FC 5'", "Light Row @65% FC 5'", "Walk 5'", "Nasal breathing"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0f7ff 100%)" },
      { id: "b3-st", stimulus: "Strenght", modality: "For Quality · 3 sets", duration: "15'", movements: ["Ab Wheel 3 × 10", "Side Plank 3 × 30'' c/lado", "Dead Bug 3 × 10", "RKC Plank 3 × 20''"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #f5f0ff 100%)" },
      { id: "b3-fba", stimulus: "FBA", modality: "Superset · 3 sets", duration: "15'", movements: ["SA DB Press 3 × 10 c/lado", "Nordic Curl 3 × 8", "Copenhagen Plank 3 × 30''", "Bulgarian Split 3 × 10 c/lado"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0fff5 100%)" },
      { id: "b3-hy", stimulus: "Hypertrophy", modality: "Drop Set · 3 sets", duration: "15'", movements: ["Bicep Curl × 3 drop sets", "Tricep Ext × 3 drop sets", "Shoulder Press 3 × 12", "Upright Row 3 × 12"], gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff8e0 100%)" },
    ],
  },
  {
    label: "BLOQUE 4",
    blocks: [
      { id: "b4-lb", stimulus: "Lower Body", modality: "Mobility · 12'", duration: "12'", movements: ["Hip Flexor Stretch × 2'", "Hamstring Floss × 90''", "Pigeon × 90'' c/lado", "Couch Stretch × 90'' c/lado"], gradient: "linear-gradient(135deg, #e8f8ff 0%, #b6fddd 100%)" },
      { id: "b4-ub", stimulus: "Upper Body", modality: "Mobility · 10'", duration: "10'", movements: ["Doorway Stretch × 2'", "Lat Stretch × 2'", "Shoulder CARs × 10", "Thoracic Opening × 90''"], gradient: "linear-gradient(135deg, #f0fff0 0%, #c8f7c5 100%)" },
      { id: "b4-fb", stimulus: "Full Body", modality: "Cool Down · 10'", duration: "10'", movements: ["Full Body Stretch × 3'", "Child's Pose × 90''", "Foam Roll × 2'", "Box Breathing × 2'"], gradient: "linear-gradient(135deg, #edfde0 0%, #c8f7c5 100%)" },
      { id: "b4-hi", stimulus: "HIIT", modality: "Recovery · 10'", duration: "10'", movements: ["Diaphragmatic Breathing 3'", "Light Stretch 3'", "Box Breathing 4'", "Walk 2'"], gradient: "linear-gradient(135deg, #fff0e0 0%, #ffd6aa 100%)" },
      { id: "b4-ca", stimulus: "Cardio", modality: "Walk · 10'", duration: "10'", movements: ["Easy Walk @50% FC 5'", "Breathing Practice 2'", "Nasal Breathing 2'", "Static Stretch 2'"], gradient: "linear-gradient(135deg, #e0f7ff 0%, #b6e8ff 100%)" },
      { id: "b4-st", stimulus: "Strenght", modality: "For Quality · 12'", duration: "12'", movements: ["Dead Bug 3 × 10", "Hollow Hold 3 × 30''", "Pallof Press 3 × 12 c/lado", "Copenhagen Plank 3 × 20''"], gradient: "linear-gradient(135deg, #f5f0ff 0%, #d4bfff 100%)" },
      { id: "b4-fba", stimulus: "FBA", modality: "Activation · 2 sets", duration: "10'", movements: ["Glute Bridge 2 × 15", "Clamshell 2 × 20", "Hip Flexor March 2 × 10 c/lado", "Band Squat 2 × 15"], gradient: "linear-gradient(135deg, #e0fff5 0%, #a0f0d0 100%)" },
      { id: "b4-hy", stimulus: "Hypertrophy", modality: "For Quality · 10'", duration: "10'", movements: ["Foam Roll Quads 2'", "Lacrosse Ball Hip 2'", "Couch Stretch 90'' c/lado", "Ankle Mobility 90''"], gradient: "linear-gradient(135deg, #fff8e0 0%, #ffeaa0 100%)" },
    ],
  },
];

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function IconChevronDown() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L5 5L9 1" stroke="#3d3d3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Individual block card ────────────────────────────────────────────────────

export function BlockCard({
  block,
  selected,
  onSelect,
  fullWidth = false,
}: {
  block: StimulusBlock;
  selected: boolean;
  onSelect: () => void;
  fullWidth?: boolean;
}) {
  const textColor = block.textColor ?? "#3d3d3d";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="relative rounded-[16px] shrink-0 text-left overflow-hidden"
      style={{
        width: fullWidth ? "100%" : "248px",
        minHeight: "210px",
        background: selected
          ? "linear-gradient(135deg, #adff19 0%, #7acc00 100%)"
          : "#f9f9f9",
        boxShadow: selected
          ? "0 4px 20px rgba(173, 255, 25, 0.4)"
          : "0 2px 8px rgba(0,0,0,0.06)",
      }}
      animate={{
        scale: selected ? 1.015 : 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Checkmark badge */}
      {selected && (
        <div className="absolute top-[10px] left-[14px] z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-[rgba(0,0,0,0.25)] rounded-[3px] flex items-center justify-center size-[20px]"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-[10px]">
              <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      )}

      {/* Body */}
      <div className="flex items-start justify-start pt-[10px] pb-[14px] pl-[16px] pr-0 gap-[8px]">
        {/* Left column */}
        <div className="flex flex-col justify-start gap-[10px] flex-1 min-w-0">
          <p
            className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] leading-[normal] tracking-[-1px]"
            style={{
              fontSize: block.stimulus.length > 12 ? "22px" : "26px",
              color: selected ? "#1a3d00" : textColor,
            }}
          >
            {block.stimulus}
          </p>

          <div
            className="backdrop-blur-[100px] flex items-center h-[18px] px-[6px] py-[3px] rounded-[3px] self-start"
            style={{ background: selected ? "rgba(0,0,0,0.18)" : "white" }}
          >
            <p
              className="font-['MessinaSansWeb:Bold',sans-serif] text-[8px] tracking-[-0.08px] uppercase leading-none whitespace-nowrap"
              style={{ color: selected ? "white" : "#565656" }}
            >
              {block.modality}
            </p>
          </div>

          <div className="flex flex-col gap-[6px]">
            {block.movements.map((mv, i) => (
              <p
                key={i}
                className="font-['MessinaSansWeb:Regular',sans-serif] leading-[133.75%] text-[12px]"
                style={{ color: selected ? "#1a3d00" : textColor }}
              >
                {mv}
              </p>
            ))}
          </div>
        </div>

        {/* Right column: clock SVG — flush to right edge */}
        <div className="shrink-0">
          <svg width="42" height="58" fill="none" preserveAspectRatio="none" viewBox="0 0 46 75">
            <path d={svgPaths.p3b47a200} fill={selected ? "rgba(255,255,255,0.4)" : "white"} shapeRendering="crispEdges" />
            <path d={svgPaths.pc724800} fill={selected ? "#1a3d00" : "black"} />
            <path d={svgPaths.p74cea80} fill={selected ? "#1a3d00" : "black"} />
            <path d={svgPaths.p1591d500} fill={selected ? "#1a3d00" : "black"} />
            <path d={svgPaths.p25011980} fill={selected ? "#1a3d00" : "black"} />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Flap row ─────────────────────────────────────────────────────────────────

function FlapRow({
  row,
  selectedId,
  onSelect,
}: {
  row: ProgrammingRow;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const selectedBlock = row.blocks.find((b) => b.id === selectedId) ?? null;

  return (
    <div
      className="w-full"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.09)",
        borderTopLeftRadius: "14px",
        borderTopRightRadius: "14px",
      }}
    >
      {/* ── Flap header ── */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-[16px] py-[14px] active:opacity-80 transition-opacity"
      >
        {/* Left: label + optional selection pip */}
        <div className="flex items-center gap-[7px]">
          <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[13px] text-[#3d3d3d] leading-none tracking-[-0.3px] uppercase">
            {row.label}
          </p>
          {selectedBlock && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded-full size-[7px] shrink-0"
              style={{ background: "#adff19", boxShadow: "0 0 6px rgba(173,255,25,0.6)" }}
            />
          )}
        </div>

        {/* Right: icon + chevron */}
        <div className="flex items-center gap-[8px] shrink-0">
          <img
            src="https://www.figma.com/api/mcp/asset/990e1119-13c5-4323-8fa8-cb9c96440cce"
            alt=""
            className="w-[18px] h-[18px] object-contain"
            style={{ filter: "brightness(0) invert(1) brightness(0.24)" }}
          />
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <IconChevronDown />
          </motion.div>
        </div>
      </button>

      {/* ── Expandable card area ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="cards"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{ overflow: "hidden" }}
          >
            {/* Horizontal card scroll — overflow-x:auto lives here, independent of the height clip */}
            <div
              className="flex gap-[12px] pl-[16px] pr-0 pt-[14px] pb-[16px]"
              style={{
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              } as React.CSSProperties}
            >
              {row.blocks.map((block) => (
                <div key={block.id} style={{ scrollSnapAlign: "start" }}>
                  <BlockCard
                    block={block}
                    selected={selectedId === block.id}
                    onSelect={() => onSelect(block.id)}
                  />
                </div>
              ))}
              <div className="shrink-0 w-[1px]" aria-hidden />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ProgrammingSection({ activeFilter }: { activeFilter?: string | null }) {
  const [selected, setSelected] = useState<Record<number, string>>({});

  const handleSelect = useCallback((rowIndex: number, blockId: string) => {
    setSelected((prev) => {
      if (prev[rowIndex] === blockId) {
        const next = { ...prev };
        delete next[rowIndex];
        return next;
      }
      return { ...prev, [rowIndex]: blockId };
    });
  }, []);

  const selectedCount = Object.keys(selected).length;

  const visibleRows = PROGRAMMING_ROWS.map((row) => ({
    ...row,
    blocks: activeFilter ? row.blocks.filter((b) => b.stimulus === activeFilter) : row.blocks,
  })).filter((row) => row.blocks.length > 0);

  return (
    <div className="flex flex-col w-full">
      {/* Rows */}
      {visibleRows.map((row, i) => (
        <FlapRow
          key={row.label}
          row={row}
          selectedId={selected[i] ?? null}
          onSelect={(id) => handleSelect(i, id)}
        />
      ))}

      {/* Confirm CTA */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="px-[20px] pt-[4px]"
          >
            <button
              type="button"
              className="w-full bg-[#adff19] rounded-[14px] py-[14px] flex items-center justify-center gap-[8px]"
            >
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#1a3d00] text-[15px] tracking-[-0.3px]">
                Agregar {selectedCount} bloque{selectedCount !== 1 ? "s" : ""} al entrenamiento
              </p>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
