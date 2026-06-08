import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StimulusBlock {
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
      {
        id: "b1-1",
        stimulus: "Lower Body",
        modality: "Strength · 5 sets",
        duration: "20'",
        movements: ["Back Squat 4 × 5 @80%", "Romanian Deadlift 3 × 8", "Hip Thrust 3 × 10", "Goblet Squat 2 × 15"],
        gradient: "linear-gradient(135deg, #f9f9f9 0%, #ededed 100%)",
      },
      {
        id: "b1-2",
        stimulus: "Upper Body",
        modality: "Strength · 5 sets",
        duration: "20'",
        movements: ["Bench Press 4 × 5 @80%", "Weighted Pull-up 3 × 6", "DB Row 3 × 10 c/lado", "Face Pull 2 × 15"],
        gradient: "linear-gradient(135deg, #f9f9f9 0%, #e8eeff 100%)",
      },
      {
        id: "b1-3",
        stimulus: "Full Body",
        modality: "Strength · 4 sets",
        duration: "22'",
        movements: ["Power Clean 4 × 3", "Push Press 3 × 8", "Front Squat 3 × 8", "Ring Row 3 × 10"],
        gradient: "linear-gradient(135deg, #f9f9f9 0%, #edfde0 100%)",
      },
    ],
  },
  {
    label: "BLOQUE 2",
    blocks: [
      {
        id: "b2-1",
        stimulus: "HIIT Metabólico",
        modality: "AMRAP · 12'",
        duration: "12'",
        movements: ["Thruster × 10 reps", "Box Jump × 10 reps", "KB Swing × 15 reps", "Burpee × 8 reps"],
        gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff0e0 100%)",
      },
      {
        id: "b2-2",
        stimulus: "Cardio Sostenido",
        modality: "Steady State · 20'",
        duration: "20'",
        movements: ["Row 5' @75% FC max", "Bike 8' @70% FC max", "Run 1.200m @conversacional", "Row 3' @80% FC max"],
        gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0f7ff 100%)",
      },
    ],
  },
  {
    label: "BLOQUE 3",
    blocks: [
      {
        id: "b3-1",
        stimulus: "Core & Midline",
        modality: "For Quality · 3 sets",
        duration: "15'",
        movements: ["GHD Sit-up 3 × 15", "Pallof Press 3 × 12 c/lado", "L-Hold 3 × 30''", "Ab Wheel 3 × 10"],
        gradient: "linear-gradient(135deg, #f9f9f9 0%, #f5f0ff 100%)",
      },
      {
        id: "b3-2",
        stimulus: "FBA",
        modality: "Superset · 3 sets",
        duration: "15'",
        movements: ["SA DB Press 3 × 10 c/lado", "Nordic Curl 3 × 8", "Copenhagen Plank 3 × 30''", "Bulgarian Split 3 × 10 c/lado"],
        gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0fff5 100%)",
      },
    ],
  },
  {
    label: "BLOQUE 4",
    blocks: [
      {
        id: "b4-1",
        stimulus: "Mobility",
        modality: "For Quality · 12'",
        duration: "12'",
        movements: ["Hip Flexor Stretch × 2'", "Hamstring Floss × 90''", "Thoracic Opening × 2'", "Pigeon × 90'' c/lado"],
        gradient: "linear-gradient(135deg, #e8f8ff 0%, #b6fddd 100%)",
      },
      {
        id: "b4-2",
        stimulus: "Stretching",
        modality: "For Quality · 10'",
        duration: "10'",
        movements: ["Doorway Stretch × 2'", "Couch Stretch × 90'' c/lado", "Lat Stretch × 2'", "Ankle Mobility × 90'' c/lado"],
        gradient: "linear-gradient(135deg, #f0fff0 0%, #c8f7c5 100%)",
      },
    ],
  },
];

// ─── Individual block card ────────────────────────────────────────────────────

function BlockCard({
  block,
  rowLabel,
  isWarmup,
  selected,
  onSelect,
}: {
  block: StimulusBlock;
  rowLabel: string;
  isWarmup?: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const textColor = block.textColor ?? "#3d3d3d";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="relative rounded-[16px] shrink-0 text-left overflow-hidden"
      style={{
        width: "calc(83vw - 40px)",
        maxWidth: "300px",
        minHeight: "230px",
        backgroundImage: selected
          ? "linear-gradient(135deg, #adff19 0%, #7acc00 100%)"
          : block.gradient,
        boxShadow: selected
          ? "0 4px 20px rgba(173, 255, 25, 0.4)"
          : "0 2px 10px rgba(0,0,0,0.08)",
      }}
      animate={{
        scale: selected ? 1.015 : 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Header badges (top-left absolute row, like HeadersBlock) */}
      <div className="absolute top-[10px] left-[14px] flex items-center gap-[6px] z-10">
        <div
          className="flex items-center h-[20px] px-[10px] rounded-[3px]"
          style={{
            backgroundColor: selected
              ? "rgba(0,0,0,0.25)"
              : isWarmup
              ? "#ff5040"
              : "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
          }}
        >
          <p
            className="font-['MessinaSansWeb:Bold',sans-serif] text-[9px] tracking-[-0.09px] uppercase leading-none"
            style={{
              color: selected ? "white" : isWarmup ? "white" : "#3d3d3d",
            }}
          >
            {isWarmup ? "WARMUP" : rowLabel}
          </p>
        </div>

        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-[rgba(0,0,0,0.25)] rounded-[3px] flex items-center justify-center size-[20px]"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-[10px]">
              <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col pt-[44px] pb-[14px] px-[16px] h-full gap-[6px]">
        {/* Stimulus title */}
        <p
          className="font-['Druk_Wide:Medium',sans-serif] leading-[1.05] tracking-[-0.8px] shrink-0"
          style={{
            fontSize: block.stimulus.length > 12 ? "22px" : "26px",
            color: selected ? "#1a3d00" : textColor,
          }}
        >
          {block.stimulus}
        </p>

        {/* Modality tag */}
        <p
          className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[11px] tracking-[-0.22px] uppercase shrink-0"
          style={{ color: selected ? "rgba(0,60,0,0.6)" : "#a3a3a3" }}
        >
          {block.modality}
        </p>

        {/* Divider */}
        <div
          className="w-full shrink-0 mt-[2px]"
          style={{ height: "1px", background: selected ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.08)" }}
        />

        {/* Movements list */}
        <div className="flex flex-col gap-[5px] flex-1">
          {block.movements.map((mv, i) => (
            <p
              key={i}
              className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] leading-[1.3] tracking-[-0.26px]"
              style={{ color: selected ? "#1a3d00" : textColor }}
            >
              {mv}
            </p>
          ))}
        </div>

        {/* Footer: duration */}
        <div className="flex items-center gap-[6px] mt-[4px] shrink-0">
          <div
            className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full"
            style={{ background: selected ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.06)" }}
          >
            {/* Clock icon */}
            <svg viewBox="0 0 16 16" fill="none" className="size-[11px] shrink-0">
              <circle cx="8" cy="8" r="6.5" stroke={selected ? "white" : "#a3a3a3"} strokeWidth="1.2" />
              <path d="M8 5v3l2 1.5" stroke={selected ? "white" : "#a3a3a3"} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p
              className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[10px] tracking-[-0.2px]"
              style={{ color: selected ? "white" : "#a3a3a3" }}
            >
              {block.duration}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Single programming row ───────────────────────────────────────────────────

function ProgrammingRow({
  row,
  selectedId,
  onSelect,
}: {
  row: ProgrammingRow;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    // no-op: snap handles visual alignment
  }, []);

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Row label */}
      <div className="flex items-center justify-between px-[20px]">
        <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[13px] tracking-[-0.3px] uppercase">
          {row.label}
        </p>
        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#a3a3a3] text-[11px] tracking-[-0.22px]">
          {row.blocks.length} {row.blocks.length === 1 ? "opción" : "opciones"}
        </p>
      </div>

      {/* Horizontal scrollable list */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-[12px] overflow-x-auto px-[20px]"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}
      >
        {row.blocks.map((block) => (
          <div key={block.id} style={{ scrollSnapAlign: "start" }}>
            <BlockCard
              block={block}
              rowLabel={row.label}
              isWarmup={row.isWarmup}
              selected={selectedId === block.id}
              onSelect={() => onSelect(block.id)}
            />
          </div>
        ))}
        {/* trailing spacer so last card can reach snap point */}
        <div className="shrink-0 w-[1px]" aria-hidden />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ProgrammingSection() {
  // Tracks which block is selected per row index
  const [selected, setSelected] = useState<Record<number, string>>({});

  const handleSelect = useCallback((rowIndex: number, blockId: string) => {
    setSelected((prev) => {
      // Deselect if already selected
      if (prev[rowIndex] === blockId) {
        const next = { ...prev };
        delete next[rowIndex];
        return next;
      }
      return { ...prev, [rowIndex]: blockId };
    });
  }, []);

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="flex flex-col gap-[20px] w-full">
      {/* Selected count indicator */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end px-[20px]"
        >
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#a3a3a3] text-[13px] tracking-[-0.26px]">
            {selectedCount} bloque{selectedCount !== 1 ? "s" : ""} seleccionado{selectedCount !== 1 ? "s" : ""}
          </p>
        </motion.div>
      )}

      {/* Rows */}
      {PROGRAMMING_ROWS.map((row, i) => (
        <ProgrammingRow
          key={row.label}
          row={row}
          selectedId={selected[i] ?? null}
          onSelect={(id) => handleSelect(i, id)}
        />
      ))}

      {/* Confirm CTA — only visible when at least one block is selected */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-[20px]"
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
    </div>
  );
}
