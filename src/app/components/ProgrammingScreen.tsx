import { useState } from "react";
import { motion } from "motion/react";
import ProgrammingSection from "./ProgrammingSection";
import BottomSheet from "./BottomSheet";

const FILTER_CHIPS = ["FBA", "Strenght", "Upper Body", "Lower Body", "Hypertrophy", "Cardio", "HIIT", "Full Body"];

type ClassOption = "bigg-class" | "bigg-gym" | "outside-bigg" | "bigg-outdoors";
const CLASS_OPTIONS: { id: ClassOption; label: string }[] = [
  { id: "bigg-class", label: "BIGG Class" },
  { id: "bigg-gym", label: "BIGG Gym" },
  { id: "outside-bigg", label: "Outside BIGG" },
  { id: "bigg-outdoors", label: "BIGG Outdoors" },
];

const EQUIPMENT_ITEMS = [
  { id: "mancuernas", label: "Mancuernas" },
  { id: "barra", label: "Barra" },
  { id: "kettlebell", label: "Kettlebell" },
  { id: "cuerda", label: "Cuerda" },
  { id: "bandas", label: "Bandas" },
  { id: "banco", label: "Banco" },
  { id: "trx", label: "TRX" },
  { id: "soga", label: "Soga" },
];

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg width="9" height="18" viewBox="0 0 12.182 20.1213" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.1213 1.06066L2.12132 10.0607L11.1213 19.0607" stroke="#565656" strokeWidth="3" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="8" height="5" viewBox="0 0 8.5323 4.97326" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.353553 0.353553L4.26615 4.26615L8.17875 0.353553" stroke="black" strokeWidth="1.2" />
    </svg>
  );
}

function IconFilterToggle() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="3" r="2" stroke="white" strokeWidth="2" />
      <path d="M7 3H0" stroke="white" strokeWidth="2" />
      <circle cx="3" cy="9" r="2" stroke="white" strokeWidth="2" />
      <path d="M5 9H12" stroke="white" strokeWidth="2" />
    </svg>
  );
}

function IconBiggClass() {
  return (
    <svg width="16" height="18" viewBox="0 0 17.2829 19.735" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.06943 3.01343C4.55975 1.55292 6.56623 0.739562 8.65286 0.750101C10.7395 0.76064 12.7377 1.59423 14.2131 3.06971C15.6886 4.5452 16.5222 6.54337 16.5328 8.63C16.5433 10.7166 15.7299 12.7231 14.2694 14.2134L10.0834 18.3994C9.70837 18.7744 9.19976 18.985 8.66943 18.985C8.1391 18.985 7.63048 18.7744 7.25543 18.3994L3.06943 14.2134C1.58432 12.7282 0.75 10.7138 0.75 8.61343C0.75 6.51306 1.58432 4.4987 3.06943 3.01343Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.66943 11.6134C10.3263 11.6134 11.6694 10.2703 11.6694 8.61343C11.6694 6.95658 10.3263 5.61343 8.66943 5.61343C7.01257 5.61343 5.66943 6.95658 5.66943 8.61343C5.66943 10.2703 7.01257 11.6134 8.66943 11.6134Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEquipment() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.75" y="8.75" width="2.5" height="6.5" rx="1.25" stroke="#565656" strokeWidth="1.5" />
      <rect x="5.75" y="6.75" width="2.5" height="10.5" rx="1.25" stroke="#565656" strokeWidth="1.5" />
      <rect x="15.75" y="6.75" width="2.5" height="10.5" rx="1.25" stroke="#565656" strokeWidth="1.5" />
      <rect x="19.75" y="8.75" width="2.5" height="6.5" rx="1.25" stroke="#565656" strokeWidth="1.5" />
      <line x1="8.25" y1="12" x2="15.75" y2="12" stroke="#565656" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.3707 1.888 11.112C0.63 9.85333 0.000667196 8.316 5.29101e-07 6.5C-0.000666138 4.684 0.628667 3.14667 1.888 1.888C3.14733 0.629333 4.68467 0 6.5 0C8.31533 0 9.853 0.629333 11.113 1.888C12.373 3.14667 13.002 4.684 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5633 8.81333 11.0007 7.75067 11 6.5C10.9993 5.24933 10.562 4.187 9.688 3.313C8.814 2.439 7.75133 2.00133 6.5 2C5.24867 1.99867 4.18633 2.43633 3.313 3.313C2.43967 4.18967 2.002 5.252 2 6.5C1.998 7.748 2.43567 8.81067 3.313 9.688C4.19033 10.5653 5.25267 11.0027 6.5 11Z" fill="black" />
    </svg>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

interface ProgrammingScreenProps {
  onBack: () => void;
  onReservar?: () => void;
}

export default function ProgrammingScreen({ onBack, onReservar }: ProgrammingScreenProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassOption>("bigg-class");
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(new Set());
  const [classSheetOpen, setClassSheetOpen] = useState(false);
  const [materialesSheetOpen, setMaterialesSheetOpen] = useState(false);

  function toggleEquipment(id: string) {
    setSelectedEquipment((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const classLabel = CLASS_OPTIONS.find((o) => o.id === selectedClass)?.label ?? "BIGG Class";
  const materialesCount = selectedEquipment.size;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-[#ededed] flex flex-col overflow-hidden"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
      >
        {/* ── Header (lighter bg) ── */}
        <div className="shrink-0 bg-[#f5f5f5] relative z-10 pb-[20px]">
        <div className="h-[12px]" />

        {/* ── Top nav ── */}
        <div className="flex items-center justify-between px-[17.5px] py-[10px]">
          <div className="flex items-center justify-between w-[247px]">
            <button type="button" onClick={onBack} className="active:opacity-60 transition-opacity p-[4px]">
              <IconBack />
            </button>
            <p className="font-['Druk_Wide:Medium',sans-serif] leading-normal text-[16px] text-[#565656] text-center whitespace-nowrap">
              BIGG TRAIN
            </p>
          </div>

          <button
            type="button"
            className="h-[26px] w-[42px] rounded-[100px] bg-[#222] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center"
          >
            <IconFilterToggle />
          </button>
        </div>

        {/* ── Filter section ── */}
        <div className="shrink-0 flex flex-col gap-[10px] items-start px-[16px] pb-[10px] w-full">
          {/* Row 1: two pills + search */}
          <div className="flex items-center justify-between w-full gap-[8px]">
            <div className="flex gap-[6px] items-center overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
              {/* Class selector pill */}
              <button
                type="button"
                onClick={() => setClassSheetOpen(true)}
                className="flex items-center gap-[5px] px-[12px] py-[6px] rounded-[100px] border border-black shrink-0 active:opacity-70 transition-opacity"
              >
                <IconBiggClass />
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] tracking-[-0.13px] whitespace-nowrap leading-[1.13] text-black">
                  {classLabel}
                </p>
                <IconChevronDown />
              </button>

              {/* Materiales selector pill */}
              <button
                type="button"
                onClick={() => setMaterialesSheetOpen(true)}
                className="flex items-center gap-[5px] px-[12px] py-[6px] rounded-[100px] border border-black shrink-0 active:opacity-70 transition-opacity"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 3V8M6 3V8M20.5 4V5.5M20.5 5.5V7M20.5 5.5H22M3.5 4V5.5M3.5 5.5V7M3.5 5.5H2M18 5.5H6M9 8V16M15 8V16M16 19V21M8 19V21M7.277 19H16.724C17.961 19 18.58 19 18.836 18.697C19.416 18.011 18.304 17.103 17.898 16.646C17.441 16.13 17.106 16 16.43 16H7.57C6.894 16 6.56 16.13 6.102 16.646C5.696 17.103 4.584 18.011 5.164 18.697C5.42 19 6.04 19 7.277 19Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] tracking-[-0.13px] whitespace-nowrap leading-[1.13] text-black">
                  {materialesCount > 0 ? `${materialesCount} Materiales` : "Materiales"}
                </p>
                <IconChevronDown />
              </button>
            </div>

            <button type="button" className="bg-[#f9f9f9] flex items-center justify-center px-[12px] py-[6px] rounded-[6px] shrink-0 active:opacity-70 transition-opacity">
              <IconSearch />
            </button>
          </div>

          {/* Row 2: chip strip */}
          <div
            className="flex gap-[10px] items-center overflow-x-auto w-full"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
          >
            {FILTER_CHIPS.map((chip) => {
              const active = activeFilter === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveFilter(active ? null : chip)}
                  className="flex items-center px-[10px] py-[7px] rounded-[6px] shrink-0 transition-colors"
                  style={{
                    background: active ? "#adff19" : "#e8e8e8",
                  }}
                >
                  <p
                    className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] tracking-[-0.13px] whitespace-nowrap leading-[1.13]"
                    style={{ color: active ? "#1a3d00" : "#565656" }}
                  >
                    {chip}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        </div>{/* end header */}

        {/* ── Scrollable blocks content ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[40px] pt-[4px] -mt-[20px] bg-[#f5f5f5]">
          <ProgrammingSection activeFilter={activeFilter} />
        </div>

        {/* ── Bottom CTA ── */}
        <div className="shrink-0 px-[16px] pt-[10px] pb-[28px] bg-[#ededed] border-t border-[#e0e0e0]">
          {selectedClass === "bigg-class" ? (
            <button
              type="button"
              onClick={onReservar}
              className="w-full bg-[#adff19] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
            >
              <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[#1a3d00] text-[16px] tracking-[-0.32px]">
                Reservar clase
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="w-full bg-[#3d3d3d] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
            >
              <span className="font-['MessinaSansWeb:Bold',sans-serif] text-white text-[16px] tracking-[-0.32px]">
                Iniciar entrenamiento
              </span>
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Tipo de clase bottom sheet ── */}
      <BottomSheet open={classSheetOpen} onClose={() => setClassSheetOpen(false)} title="Tipo de clase">
        <div className="px-[16px] pt-[8px] pb-[36px] flex flex-col gap-[16px]">
          <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[17px] text-[#3d3d3d] tracking-[-0.17px]">
            Tipo de clase
          </p>
          <div className="grid grid-cols-2 gap-[10px]">
            {CLASS_OPTIONS.map((opt) => {
              const selected = selectedClass === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedClass(opt.id);
                    setClassSheetOpen(false);
                  }}
                  className="flex items-center justify-center py-[20px] px-[12px] rounded-[14px] transition-colors active:opacity-80"
                  style={{
                    background: selected ? "#adff19" : "white",
                    border: `1.5px solid ${selected ? "#1a3d00" : "#a3a3a3"}`,
                  }}
                >
                  <p
                    className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[14px] tracking-[-0.14px] leading-[1.2]"
                    style={{ color: selected ? "#1a3d00" : "#3d3d3d" }}
                  >
                    {opt.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </BottomSheet>

      {/* ── Materiales bottom sheet ── */}
      <BottomSheet open={materialesSheetOpen} onClose={() => setMaterialesSheetOpen(false)} title="Equipamiento">
        <div className="px-[16px] pt-[8px] pb-[36px] flex flex-col gap-[16px]">
          <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[17px] text-[#3d3d3d] tracking-[-0.17px]">
            ¿Qué equipamiento tenés?
          </p>

          <div className="grid grid-cols-3 gap-[10px]">
            {EQUIPMENT_ITEMS.map((item) => {
              const selected = selectedEquipment.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleEquipment(item.id)}
                  className="flex flex-col items-center justify-center gap-[8px] p-[14px] rounded-[10px] border border-[#a3a3a3] transition-colors active:opacity-80"
                  style={{ background: selected ? "#deffa3" : "rgba(255,255,255,0.5)" }}
                >
                  <IconEquipment />
                  <p
                    className="font-['MessinaSansWeb:Regular',sans-serif] text-[13px] leading-[1.2] text-center"
                    style={{ color: selected ? "#3d3d3d" : "#a3a3a3" }}
                  >
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Config CTA */}
          <button
            type="button"
            className="w-full border border-[#a3a3a3] rounded-[14px] py-[14px] flex items-center justify-center"
          >
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#565656] tracking-[-0.14px]">
              Configurar qué elementos tengo en casa
            </p>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
