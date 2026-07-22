import { motion } from "motion/react";
import { Pencil, ChevronRight, Dumbbell } from "lucide-react";
import imgEllipse167 from "../../imports/BiggDay/0bdccca1063fe17c8030deb1278cb4c21c493290.png";
import imgObjetivoPhoto from "../../imports/BiggDay/f40c659e63fd5fa932f8372e95797919cca4e6f9.png";

// Profile screen — ported from biggapp's Screens/Profile/Profile.js (light version, for design
// iteration only). Real screen has image-picker, i18n switching, sign-out/delete-account logic —
// out of scope here. This keeps: avatar + edit badge, member-since/friends line, "Editar" pill,
// and the two Activity-page tail components reassigned here (Objetivo, Mis Pesos) per the new IA
// (the third, BIGG Benchmark, moved to the Train tab instead — see BiggDayScreen's BenchmarkContainer).

// ─── Objetivo card — ported from biggapp Components/Objetives/Objetives.js ────────────────────
// Always shows the "has an objective" state (skips the empty state — more interesting visually).

function ObjetivoCard() {
  return (
    <div
      className="relative w-full min-h-[250px] rounded-[12px] overflow-hidden flex flex-col justify-end"
      style={{ backgroundImage: `url(${imgObjetivoPhoto})`, backgroundSize: "cover", backgroundPosition: "center 20%" }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col gap-[8px] px-[20px] pb-[20px] pt-[20px]">
        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-white text-[13px] tracking-[-0.26px]">
          Objetivo
        </p>
        <div className="flex items-center justify-between gap-[12px]">
          <p className="font-['Druk_Wide:Medium',sans-serif] text-white text-[28px] leading-[1.05] tracking-[-1.4px] uppercase">
            Ganar fuerza
          </p>
          <ChevronRight size={22} strokeWidth={2} className="text-white shrink-0" />
        </div>
        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-white text-[13px] tracking-[-0.26px]">
          Plan de entrenamiento: <span className="underline">Fuerza &amp; Hipertrofia 12 semanas</span>
        </p>
      </div>
    </div>
  );
}

// ─── Mis Pesos card — ported from biggapp Components/Weights/Weights.js ───────────────────────
// Half-width in the real app (paired with Benchmark); here it stands alone so it gets a sensible
// half-ish width rather than stretching full-bleed.

function MisPesosCard() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] rounded-[12px] p-[20px] flex flex-col gap-[40px] w-[47%]">
      <div className="flex items-center justify-between w-full">
        <Dumbbell size={22} strokeWidth={1.75} className="text-[#3d3d3d]" />
        <div className="size-[26px] rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center shrink-0">
          <ChevronRight size={13} strokeWidth={2} className="text-[#3d3d3d]" />
        </div>
      </div>
      <div className="flex flex-col gap-[2px]">
        <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[16px] tracking-[-0.48px]">
          Mis Pesos
        </p>
        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#888888] text-[13px] tracking-[-0.26px]">
          Ver todos
        </p>
      </div>
    </div>
  );
}

// ─── Screen ─────────────────────────────────────────────────────────────────────────────────

interface ProfileScreenProps {
  onClose: () => void;
}

export default function ProfileScreen({ onClose }: ProfileScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[67] bg-[#ededed] flex flex-col overflow-hidden"
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
        <div className="flex flex-col gap-[24px]">

          {/* ── Header: avatar + edit badge + name + member line + Editar pill ── */}
          <div className="flex flex-col items-center gap-[12px] pt-[4px]">
            <div className="relative size-[88px] shrink-0">
              <img alt="" src={imgEllipse167} className="size-full rounded-full object-cover" />
              <div className="absolute -bottom-[2px] -right-[2px] size-[28px] rounded-full bg-[#3d3d3d] border-[2px] border-[#ededed] flex items-center justify-center">
                <Pencil size={13} strokeWidth={2} className="text-[#adff19]" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-[3px]">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[20px] tracking-[-0.5px]">
                Mateo
              </p>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#888888] text-[13px] tracking-[-0.26px]">
                Miembro desde 2023 · 4 amigos
              </p>
            </div>
            <button
              type="button"
              className="bg-white border border-[#a3a3a3] rounded-full px-[18px] py-[8px] active:opacity-70 transition-opacity"
            >
              <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[13px] tracking-[-0.39px]">
                Editar
              </span>
            </button>
          </div>

          {/* ── Objetivo (moved from Activity tail) ── */}
          <ObjetivoCard />

          {/* ── Mis Pesos (moved from Activity tail) ── */}
          <div className="flex w-full">
            <MisPesosCard />
          </div>

          {/* ── Decorative tail rows — static, matching the real Profile screen's language row / sign-out row ── */}
          <div className="flex flex-col mt-[4px]">
            <button
              type="button"
              className="flex items-center justify-between py-[16px] border-b border-[#dcdcdc] active:opacity-60 transition-opacity"
            >
              <div className="flex items-center gap-[10px]">
                <span className="text-[16px] leading-none">🇦🇷</span>
                <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[14px] tracking-[-0.35px]">
                  Idioma
                </span>
              </div>
              <ChevronRight size={16} strokeWidth={1.5} className="text-[#a3a3a3]" />
            </button>
            <button
              type="button"
              className="flex items-center py-[16px] active:opacity-60 transition-opacity"
            >
              <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[#c94b4b] text-[14px] tracking-[-0.35px]">
                Cerrar sesión
              </span>
            </button>
          </div>

          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#a3a3a3] text-[11px] tracking-[-0.22px] text-center pt-[4px]">
            BIGG v1.0.0
          </p>

        </div>
      </div>
    </motion.div>
  );
}
