import { motion } from "motion/react";
import { Check } from "lucide-react";
import ReferralContainer from "./ReferralContainer";
import type { ReservedClass } from "./DailyWorkoutCard";

// Post-class "thank you" screen — shown after finishing a reserved class. Congratulates the
// user and features the referral program (moved here from the daily timeline, see catchup).
//
// PROVISIONAL: there's no real "class finished" trigger in the app yet (no post-class flow
// exists). This screen is reached via a stand-in "Finalizar clase" button on ClassDetailScreen
// (onFinishClass) until a real class-completion flow is built.

interface ThankYouClassScreenProps {
  reservedClass?: ReservedClass | null;
  onClose: () => void;
}

export default function ThankYouClassScreen({ reservedClass, onClose }: ThankYouClassScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[66] bg-[#ededed] flex flex-col overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
    >
      {/* Status bar spacer */}
      <div className="shrink-0 h-[44px]" />

      {/* Close nav */}
      <div className="shrink-0 flex items-center justify-end px-[20px] pb-[10px]">
        <button
          onClick={onClose}
          className="flex items-center gap-[8px] active:opacity-60 transition-opacity"
        >
          <span className="font-['MessinaSansWeb:Regular',sans-serif] text-[#565656] text-[14px] tracking-[-0.28px]">
            Cerrar
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-[16px] pb-[40px]">
        <div className="flex flex-col gap-[20px]">

          {/* ── Congratulatory hero ── */}
          <div
            className="rounded-[20px] border border-[#a3a3a3] overflow-hidden"
            style={{ backgroundImage: "linear-gradient(105.33deg, rgba(255,255,255,0.95) 37%, rgba(222,255,163,0.95) 114%)" }}
          >
            <div className="flex flex-col gap-[14px] px-[20px] pt-[24px] pb-[24px]">
              <div className="bg-[#3d3d3d] rounded-full size-[48px] flex items-center justify-center">
                <Check size={24} strokeWidth={2.5} className="text-[#adff19]" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-['Druk_Wide:Medium',sans-serif] text-[#3d3d3d] text-[26px] leading-[1.1] tracking-[-1.3px] uppercase">
                  ¡Entrenamiento completado!
                </p>
                {reservedClass && (
                  <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#565656] text-[14px] tracking-[-0.28px]">
                    {reservedClass.classType} · {reservedClass.time} en {reservedClass.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Referral program — moved here from the daily timeline ── */}
          <ReferralContainer />

        </div>
      </div>
    </motion.div>
  );
}
