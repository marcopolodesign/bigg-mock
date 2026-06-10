import { motion } from "motion/react";
import { BlockCard, type StimulusBlock } from "./ProgrammingSection";
import type { ReservedClass } from "./DailyWorkoutCard";

// ─── Block exercise data ──────────────────────────────────────────────────────

const BLOCK_DATA: Record<string, { gradient: string; modality: string; movements: string[] }> = {
  "UPPER BODY": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #e8eeff 100%)",
    modality: "Strength · 5 sets · 20'",
    movements: ["Bench Press 4 × 5 @80%", "Weighted Pull-up 3 × 6", "DB Row 3 × 10/lado", "Face Pull 2 × 15"],
  },
  "STRENGTH": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #ededed 100%)",
    modality: "Strength · 4 sets · 22'",
    movements: ["Back Squat 4 × 5 @80%", "Romanian Deadlift 3 × 8", "Hip Thrust 3 × 10", "Goblet Squat 2 × 15"],
  },
  "FBA": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0fff5 100%)",
    modality: "Superset · 3 sets · 15'",
    movements: ["SA DB Press 3 × 10/lado", "Nordic Curl 3 × 8", "Copenhagen Plank 3 × 30''", "Bulgarian Split 3 × 10/lado"],
  },
  "MIDLINE": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #f5f0ff 100%)",
    modality: "For Quality · 3 sets · 15'",
    movements: ["GHD Sit-up 3 × 15", "Pallof Press 3 × 12/lado", "L-Hold 3 × 30''", "Ab Wheel 3 × 10"],
  },
  "CORE": {
    gradient: "linear-gradient(135deg, #f5f0ff 0%, #e0e8ff 100%)",
    modality: "For Quality · 3 sets · 12'",
    movements: ["Plank 3 × 45''", "Side Plank 3 × 30''/lado", "Dead Bug 3 × 10", "V-Up 3 × 12"],
  },
  "PUSH": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff0e0 100%)",
    modality: "Superset · 4 sets · 18'",
    movements: ["Push Press 4 × 8", "DB Lateral Raise 3 × 15", "Tricep Dip 3 × 12", "Pike Push-up 3 × 10"],
  },
  "PULL": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #e8eeff 100%)",
    modality: "Strength · 4 sets · 18'",
    movements: ["Deadlift 4 × 5 @75%", "Barbell Row 3 × 8", "Lat Pulldown 3 × 12", "Face Pull 3 × 15"],
  },
  "CARDIO": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0f7ff 100%)",
    modality: "Intervals · 20'",
    movements: ["Row 5' @75% FC max", "Bike 8' @70% FC max", "Run 1.200m @conversacional", "Row 3' @80% FC max"],
  },
  "LEGS": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #edfde0 100%)",
    modality: "Strength · 5 sets · 22'",
    movements: ["Back Squat 4 × 5 @80%", "Leg Press 3 × 12", "Lunges 3 × 10/lado", "Leg Curl 3 × 12"],
  },
  "FULL BODY": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #edfde0 100%)",
    modality: "Strength · 4 sets · 22'",
    movements: ["Power Clean 4 × 3", "Push Press 3 × 8", "Front Squat 3 × 8", "Ring Row 3 × 10"],
  },
  "CONDITIONING": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #fff0e0 100%)",
    modality: "AMRAP · 12'",
    movements: ["Thruster × 10 reps", "Box Jump × 10 reps", "KB Swing × 15 reps", "Burpee × 8 reps"],
  },
  "ENDURANCE": {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #e0f7ff 100%)",
    modality: "Steady State · 20'",
    movements: ["Run 20' @conversacional", "Bike 10' @70% FC max", "Row 5' @75% FC max"],
  },
};

function parseBlock(raw: string): { num: number; name: string } {
  const match = raw.match(/^(\d+)\.\s*(.+)$/);
  if (match) return { num: parseInt(match[1]), name: match[2].trim() };
  return { num: 0, name: raw.trim() };
}

function toStimulusBlock(num: number, name: string): StimulusBlock {
  const data = BLOCK_DATA[name.toUpperCase()] ?? {
    gradient: "linear-gradient(135deg, #f9f9f9 0%, #ededed 100%)",
    modality: "For Quality",
    movements: ["Actividad principal"],
  };
  return {
    id: `block-${num || name}`,
    stimulus: name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "),
    modality: data.modality,
    duration: "",
    movements: data.movements,
    gradient: data.gradient,
  };
}

// ─── Attendee avatars ─────────────────────────────────────────────────────────

function AttendeeAvatars({ total = 20 }: { total?: number }) {
  const visible = 5;
  const size = 36;
  const overlap = 10;
  return (
    <div className="flex items-center gap-[8px]">
      <div
        className="relative shrink-0"
        style={{ width: size + (visible - 1) * (size - overlap) + "px", height: size + "px" }}
      >
        {Array.from({ length: visible }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 rounded-full bg-[#c8c8c8] border-[2px] border-[#3d3d3d]"
            style={{ left: i * (size - overlap) + "px", width: size + "px", height: size + "px" }}
          />
        ))}
      </div>
      <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#b5b5b5] text-[13px] tracking-[-0.26px] whitespace-nowrap">
        +{total}
      </p>
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

interface ClassDetailScreenProps {
  reservedClass: ReservedClass;
  onBack: () => void;
  onOpenProgramming?: () => void;
}

export default function ClassDetailScreen({ reservedClass, onBack, onOpenProgramming }: ClassDetailScreenProps) {
  const blocks = reservedClass.blocks.map(parseBlock);

  return (
    <motion.div
      className="fixed inset-0 z-[65] bg-[#ededed] flex flex-col overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
    >
      {/* Status bar spacer */}
      <div className="shrink-0 h-[44px]" />

      {/* Back nav */}
      <div className="shrink-0 flex items-center px-[20px] pb-[10px]">
        <button
          onClick={onBack}
          className="flex items-center gap-[8px] active:opacity-60 transition-opacity"
        >
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path d="M8 1L1 8L8 15" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-['MessinaSansWeb:Regular',sans-serif] text-[#565656] text-[14px] tracking-[-0.28px]">
            Volver
          </span>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Header card (adapted from Figma 20114:16150, light theme) ── */}
        <div
          className="mx-[16px] rounded-[20px] border border-[#a3a3a3] overflow-hidden"
          style={{ backgroundImage: "linear-gradient(105.33deg, rgba(255,255,255,0.95) 37%, rgba(222,255,163,0.95) 114%)" }}
        >
          <div className="flex flex-col gap-[16px] px-[20px] pt-[20px] pb-[20px]">

            {/* Title — e.g. "Clase de las 10:00AM hoy en Recoleta" */}
            <p className="font-['Druk_Wide:Medium',sans-serif] text-[#3d3d3d] text-[26px] leading-[1.1] tracking-[-1.3px]">
              {`Clase de las ${reservedClass.time} hoy en ${reservedClass.location.replace("BIGG ", "")}`}
            </p>

            {/* Attendees row (dark strip, matching biggapp Figma) */}
            <div className="bg-[#3d3d3d] rounded-[10px] px-[14px] py-[10px] flex items-center justify-between">
              <AttendeeAvatars total={reservedClass.attendeeCount ?? 20} />
              <div className="bg-[#565656] rounded-full size-[36px] flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-[10px]">
              <button className="flex-1 bg-[#3d3d3d] rounded-[10px] py-[12px] flex items-center justify-center gap-[7px] active:opacity-70 transition-opacity">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#adff19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#adff19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#adff19] text-[13px] tracking-[-0.26px]">
                  Editar
                </span>
              </button>
              <button className="flex-1 bg-[#3d3d3d] rounded-[10px] py-[12px] flex items-center justify-center gap-[7px] active:opacity-70 transition-opacity">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <polyline points="3 6 5 6 21 6" stroke="#ed4c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 6l-1 14H6L5 6" stroke="#ed4c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 11v6M14 11v6" stroke="#ed4c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 6V4h6v2" stroke="#ed4c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#ed4c5c] text-[13px] tracking-[-0.26px]">
                  Cancelar
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* ── Block cards ── */}
        <div className="flex flex-col gap-[12px] px-[16px] pt-[24px] pb-[24px]">

          {/* Section header with "Ver todos" link */}
          <div className="flex items-center justify-between">
            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[16px] tracking-[-0.4px]">
              Bloques de la clase
            </p>
            {onOpenProgramming && (
              <button
                onClick={onOpenProgramming}
                className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#565656] text-[13px] tracking-[-0.26px] active:opacity-60 transition-opacity"
              >
                Ver todos
              </button>
            )}
          </div>

          {blocks.map(({ num, name }) => (
            <BlockCard
              key={num || name}
              block={toStimulusBlock(num, name)}
              selected={false}
              onSelect={() => {}}
              fullWidth
            />
          ))}

        </div>
      </div>

      {/* ── Fixed bottom CTA ── */}
      <div className="shrink-0 px-[16px] pt-[10px] pb-[28px] bg-[#ededed] border-t border-[#e0e0e0]">
        <button className="w-full bg-[#adff19] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity">
          <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[#1a3d00] text-[16px] tracking-[-0.32px]">
            Iniciar clase
          </span>
        </button>
      </div>

    </motion.div>
  );
}
