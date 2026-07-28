import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Flame, Moon, Footprints, Plus, Check, X } from "lucide-react";
import BottomSheet from "./BottomSheet";
import imgObjetivoPhoto from "../../imports/BiggDay/f40c659e63fd5fa932f8372e95797919cca4e6f9.png";

// Objetivos screen — opened from ProfileScreen's Objetivo card. Shows the primary training
// objective as a hero, the three measurable targets that drive the streak (weekly activity,
// sleep, steps), and lets the user stack ADDITIONAL training goals on top of the primary one.
//
// Everything here is local state: this is the design mock, there is no goals API in this repo.

/** Catalogue the "Agregar objetivo" sheet picks from. The first entry is the primary goal. */
const TRAINING_GOALS = [
  { id: "fuerza", label: "Ganar fuerza", plan: "Fuerza & Hipertrofia 12 semanas" },
  { id: "hipertrofia", label: "Hipertrofia", plan: "Volumen 8 semanas" },
  { id: "grasa", label: "Bajar grasa corporal", plan: "Recomposición 10 semanas" },
  { id: "resistencia", label: "Mejorar resistencia", plan: "Base aeróbica 6 semanas" },
  { id: "movilidad", label: "Movilidad y flexibilidad", plan: "BIGG Soft Life" },
  { id: "hyrox", label: "Competir en Hyrox", plan: "Hyrox Prep 12 semanas" },
];

const DAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];
const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface ObjetivosScreenProps {
  onClose: () => void;
}

/** One measurable target row — icon in a lime disc, label + hint, value, chevron. */
function TargetRow({
  icon,
  label,
  hint,
  value,
  children,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  value: string;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[14px] py-[18px]" style={last ? undefined : { borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <button type="button" className="flex items-center gap-[14px] w-full text-left active:opacity-70 transition-opacity">
        <div className="size-[44px] rounded-full bg-[#d6ff8c] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex flex-col gap-[1px] flex-1 min-w-0">
          <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[17px] text-[#3d3d3d] tracking-[-0.4px]">
            {label}
          </p>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#888888] tracking-[-0.26px] truncate">
            {hint}
          </p>
        </div>
        <p className="font-['Druk_Wide:Medium',sans-serif] text-[22px] text-[#3d3d3d] tracking-[-1.1px] shrink-0">
          {value}
        </p>
        <ChevronRight size={20} strokeWidth={2} className="text-[#a3a3a3] shrink-0" />
      </button>
      {children}
    </div>
  );
}

export default function ObjetivosScreen({ onClose }: ObjetivosScreenProps) {
  // Mon/Tue/Fri/Sat pre-selected, matching the reference design.
  const [trainingDays, setTrainingDays] = useState<number[]>([0, 1, 4, 5]);
  const [primaryGoalId, setPrimaryGoalId] = useState("fuerza");
  const [extraGoalIds, setExtraGoalIds] = useState<string[]>([]);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const primaryGoal = TRAINING_GOALS.find((g) => g.id === primaryGoalId)!;
  const extraGoals = TRAINING_GOALS.filter((g) => extraGoalIds.includes(g.id));
  // Anything not already in play is offerable in the sheet.
  const addableGoals = TRAINING_GOALS.filter((g) => g.id !== primaryGoalId && !extraGoalIds.includes(g.id));

  const toggleDay = (i: number) =>
    setTrainingDays((prev) => (prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i].sort((a, b) => a - b)));

  const addGoal = (id: string) => {
    setExtraGoalIds((prev) => [...prev, id]);
    setShowAddSheet(false);
  };

  /** Promoting an extra goal swaps it with the current primary, so nothing is lost. */
  const promoteGoal = (id: string) => {
    setExtraGoalIds((prev) => [...prev.filter((g) => g !== id), primaryGoalId]);
    setPrimaryGoalId(id);
  };

  const daysLabel = trainingDays.length
    ? trainingDays.map((i) => DAY_NAMES[i]).join(" · ")
    : "Sin días elegidos";

  return (
    <motion.div
      className="fixed inset-0 z-[68] bg-[#ededed] flex flex-col overflow-hidden"
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
          type="button"
          onClick={onClose}
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
      <div className="flex-1 overflow-y-auto px-[16px] pb-[40px]">
        <div className="flex flex-col gap-[20px]">

          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[15px] text-[#6b7280] tracking-[-0.3px] leading-[1.45] px-[4px]">
            Definí tus objetivos: los usamos para medir tu racha, tu descanso y tu actividad diaria.
          </p>

          {/* ── Primary objective hero ── */}
          <div
            className="relative w-full min-h-[210px] rounded-[12px] overflow-hidden flex flex-col justify-end"
            style={{ backgroundImage: `url(${imgObjetivoPhoto})`, backgroundSize: "cover", backgroundPosition: "center 20%" }}
          >
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 flex items-end justify-between gap-[12px] px-[20px] py-[20px]">
              <div className="flex flex-col gap-[6px] min-w-0">
                <p className="font-['MessinaSansWeb:Regular',sans-serif] text-white text-[13px] tracking-[-0.26px]">
                  Objetivo
                </p>
                <p className="font-['Druk_Wide:Medium',sans-serif] text-white text-[26px] leading-[1.05] tracking-[-1.3px] uppercase">
                  {primaryGoal.label}
                </p>
                <p className="font-['MessinaSansWeb:Regular',sans-serif] text-white text-[13px] tracking-[-0.26px]">
                  Plan de entrenamiento: <span className="underline">{primaryGoal.plan}</span>
                </p>
              </div>
              <ChevronRight size={22} strokeWidth={2} className="text-white shrink-0 mb-[2px]" />
            </div>
          </div>

          {/* ── Measurable targets ── */}
          <div className="bg-white rounded-[16px] px-[18px]">
            <TargetRow
              icon={<Flame size={20} strokeWidth={2} className="text-[#3d3d3d]" />}
              label="Actividad semanal"
              hint={daysLabel}
              value={`${trainingDays.length}`}
            >
              <div className="flex gap-[7px]">
                {DAY_LETTERS.map((letter, i) => {
                  const active = trainingDays.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(i)}
                      aria-pressed={active}
                      aria-label={DAY_NAMES[i]}
                      className="flex-1 h-[44px] rounded-[12px] flex items-center justify-center transition-colors active:opacity-70"
                      style={{
                        background: active ? "#d6ff8c" : "#ffffff",
                        border: active ? "1px solid #d6ff8c" : "1px solid #e0e0e0",
                      }}
                    >
                      <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px]">
                        {letter}
                      </span>
                    </button>
                  );
                })}
              </div>
            </TargetRow>

            <TargetRow
              icon={<Moon size={20} strokeWidth={2} className="text-[#3d3d3d]" />}
              label="Sueño"
              hint="Horas de descanso por noche"
              value="8h"
            />

            <TargetRow
              icon={<Footprints size={20} strokeWidth={2} className="text-[#3d3d3d]" />}
              label="Pasos diarios"
              hint="Pasos por día"
              value="10.000"
              last
            />
          </div>

          {/* ── Additional training goals ── */}
          <div className="flex flex-col gap-[10px]">
            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[17px] text-[#3d3d3d] tracking-[-0.4px] px-[4px]">
              Otros objetivos
            </p>

            {extraGoals.length === 0 ? (
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#888888] tracking-[-0.26px] leading-[1.4] px-[4px]">
                Podés sumar más de un objetivo. El principal define tu plan; el resto ajustan las
                recomendaciones del día.
              </p>
            ) : (
              <div className="flex flex-col gap-[8px]">
                {extraGoals.map((goal) => (
                  <div key={goal.id} className="bg-white rounded-[14px] px-[16px] py-[14px] flex items-center gap-[12px]">
                    <div className="flex flex-col gap-[1px] flex-1 min-w-0">
                      <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px] truncate">
                        {goal.label}
                      </p>
                      <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#888888] tracking-[-0.24px] truncate">
                        {goal.plan}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => promoteGoal(goal.id)}
                      className="shrink-0 rounded-full px-[12px] py-[6px] bg-[#ededed] active:opacity-70 transition-opacity"
                    >
                      <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[12px] text-[#3d3d3d] tracking-[-0.24px]">
                        Hacer principal
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExtraGoalIds((prev) => prev.filter((g) => g !== goal.id))}
                      aria-label={`Quitar ${goal.label}`}
                      className="shrink-0 size-[28px] rounded-full flex items-center justify-center active:opacity-70 transition-opacity"
                    >
                      <X size={15} strokeWidth={2} className="text-[#a3a3a3]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAddSheet(true)}
              disabled={addableGoals.length === 0}
              className="w-full rounded-[14px] border border-dashed border-[#858585] py-[15px] flex items-center justify-center gap-[8px] active:opacity-60 transition-opacity disabled:opacity-40"
            >
              <Plus size={16} strokeWidth={2} className="text-[#585858]" />
              <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] text-[#585858] tracking-[-0.28px]">
                {addableGoals.length === 0 ? "Ya sumaste todos los objetivos" : "Agregar objetivo"}
              </span>
            </button>
          </div>

          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#888888] tracking-[-0.26px] leading-[1.45] px-[4px]">
            Podés cambiarlos cuando quieras. Tu racha se recalcula con el objetivo nuevo desde la
            semana en curso.
          </p>
        </div>
      </div>

      {/* ── Add-goal picker ── */}
      <BottomSheet open={showAddSheet} onClose={() => setShowAddSheet(false)} title="Agregar objetivo">
        <div className="flex flex-col gap-[8px] px-[20px] pb-[32px]">
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.6px] uppercase mb-[4px]">
            Agregar objetivo
          </p>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.26px] leading-[1.4] mb-[8px]">
            Se suma a tu objetivo principal y afina las recomendaciones que ves en el día.
          </p>
          {addableGoals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => addGoal(goal.id)}
              className="w-full flex items-center gap-[12px] px-[16px] py-[14px] rounded-[14px] bg-[#ededed] active:opacity-80 transition-opacity text-left"
            >
              <div className="flex flex-col gap-[1px] flex-1 min-w-0">
                <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px]">
                  {goal.label}
                </span>
                <span className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#888888] tracking-[-0.24px]">
                  {goal.plan}
                </span>
              </div>
              <div className="size-[26px] rounded-full bg-white flex items-center justify-center shrink-0">
                <Plus size={14} strokeWidth={2.5} className="text-[#3d3d3d]" />
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>
    </motion.div>
  );
}
