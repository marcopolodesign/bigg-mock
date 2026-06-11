import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Dumbbell, Sparkles, MessageCircle, Layers, CalendarDays } from "lucide-react";

const PRIMARY_OPTIONS = [
  { label: "Reservar en BIGG Studios", Icon: Dumbbell },
  { label: "Reservar servicios", Icon: Sparkles },
  { label: "Contactar a Coach", Icon: MessageCircle },
];

interface FABProps {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onVerProgramacion?: () => void;
}

export default function FloatingActionButton({ open: controlledOpen, onOpenChange, onVerProgramacion }: FABProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="fab-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[45] backdrop-blur-sm bg-black/30"
            onClick={() => setOpen(false)}
          >
            <div
              className="absolute left-0 right-0 flex flex-col gap-[10px] px-[20px]"
              style={{ bottom: "calc(93px + 58px + 24px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Primary options — icon top, label centered, flex-row */}
              <motion.div
                className="flex gap-[10px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.14, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {PRIMARY_OPTIONS.map(({ label, Icon }) => (
                  <button
                    key={label}
                    className="flex-1 bg-white/50 rounded-[18px] flex flex-col items-center gap-[10px] px-[8px] pt-[18px] pb-[16px] active:opacity-70"
                    onClick={() => setOpen(false)}
                  >
                    <div className="size-[44px] rounded-full border border-[#3d3d3d]/30 flex items-center justify-center">
                      <Icon size={20} strokeWidth={1.75} className="text-[#3d3d3d]" />
                    </div>
                    <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#3d3d3d] text-[14px] tracking-[-0.28px] leading-[1.3] text-center">
                      {label}
                    </span>
                  </button>
                ))}
              </motion.div>

              {/* Secondary options — single row with icon + label + chevron */}
              {[
                { label: "Ver programación", Icon: CalendarDays, action: () => { setOpen(false); onVerProgramacion?.(); } },
                { label: "Cargar actividad", Icon: Plus, action: () => setOpen(false) },
                { label: "Ver rutinas de BIGG Move", Icon: Layers, action: () => setOpen(false) },
              ].map(({ label, Icon, action }, i, arr) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{
                    delay: (arr.length - 1 - i) * 0.07,
                    duration: 0.24,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full bg-white/50 rounded-[18px] px-[22px] py-[18px] flex items-center gap-[14px] active:opacity-70"
                  onClick={action}
                >
                  <Icon size={20} strokeWidth={1.75} className="shrink-0 text-[#3d3d3d]" />
                  <span className="flex-1 font-['MessinaSansWeb:SemiBold',sans-serif] text-[#3d3d3d] text-[14px] tracking-[-0.28px] text-left">
                    {label}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" className="size-[18px] shrink-0 text-[#3d3d3d]/40">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        className="fixed right-[20px] z-[55] size-[46px] bg-[#adff19] rounded-full flex items-center justify-center shadow-[0_6px_24px_rgba(0,0,0,0.18)] border border-[#3d3d3d]/40"
        style={{ bottom: "calc(93px + 16px)" }}
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.88 }}
        transition={{ duration: 0.12 }}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <Plus size={20} color="#3d3d3d" strokeWidth={2.5} />
        </motion.div>
      </motion.button>
    </>
  );
}
