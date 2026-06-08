import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import ProgrammingSection from "./ProgrammingSection";

interface ProgrammingScreenProps {
  onBack: () => void;
}

export default function ProgrammingScreen({ onBack }: ProgrammingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-[#ededed] flex flex-col overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
    >
      {/* Status bar spacer */}
      <div className="shrink-0 h-[40px] bg-[#ededed]" />

      {/* Navigation header */}
      <div className="shrink-0 flex items-center gap-[4px] px-[8px] py-[10px] bg-[#ededed]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center size-[40px] rounded-full active:bg-black/8 transition-colors"
        >
          <ArrowLeft size={22} strokeWidth={2} className="text-[#3d3d3d]" />
        </button>
        <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[18px] tracking-[-0.45px]">
          Programación
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[40px]">
        <ProgrammingSection />
      </div>
    </motion.div>
  );
}
