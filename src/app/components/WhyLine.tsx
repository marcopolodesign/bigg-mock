// The "why" / AI-recommendation line — Sparkles + cyan text. Used across the
// home to explain *why* something is recommended (hero class, activities,
// mobility, activity streak). Keeps the cyan/type spec in one place.

import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface WhyLineProps {
  children: ReactNode;
  iconSize?: number;
}

export default function WhyLine({ children, iconSize = 16 }: WhyLineProps) {
  return (
    <div className="flex items-start gap-[8px]">
      <Sparkles size={iconSize} strokeWidth={1.5} className="text-[#2ab3cc] shrink-0 mt-[1px]" />
      <p className="flex-1 font-['MessinaSansWeb:Regular',sans-serif] text-[#2ab3cc] text-[13px] tracking-[-0.13px] leading-[1.13]">
        {children}
      </p>
    </div>
  );
}
