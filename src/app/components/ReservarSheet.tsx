// Reservar clase bottom sheet content — Figma node 22619:3582
// Rendered inside <BottomSheet>; shell (handle, overlay, animation) lives there.

const MOCK_AVATAR_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];

interface ReservarSheetProps {
  onConfirm?: () => void;
}

export default function ReservarSheet({ onConfirm }: ReservarSheetProps) {
  return (
    <div className="px-[10px] pt-[6px] pb-[36px]">
      {/* Card */}
      <div className="bg-[rgba(250,250,250,0.4)] border border-[rgba(250,250,250,0.5)] border-solid rounded-[28px] flex flex-col items-center px-[28px] pt-[22px] pb-[37px] gap-[22px] overflow-hidden">

        {/* Title */}
        <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[16px] text-[#3d3d3d] tracking-[-0.48px] leading-normal">
          Reservar clase
        </p>

        {/* Location + Edit */}
        <div className="flex items-center justify-between w-full">
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#565656] leading-none">
            Recoleta • 10:00hs
          </p>
          <button className="flex items-center gap-[5px] opacity-80 active:opacity-50 transition-opacity">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M10 2L12 4L5 11H3V9L10 2Z" stroke="#565656" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[12px] text-[#565656] tracking-[-0.18px] leading-normal whitespace-nowrap">
              Editar
            </p>
          </button>
        </div>

        {/* Block picker */}
        <div className="border border-[#3d3d3d] border-dashed rounded-[8px] px-[30px] py-[15px] w-full flex items-center justify-center gap-[10px]">
          <div className="size-[26px] rounded-full bg-[#adff19] flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2V10M2 6H10" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[16px] text-[#565656] leading-[1.34] text-center">
            Elegí tus bloques para esta clase
          </p>
        </div>

        {/* Attendees */}
        <div className="bg-[rgba(255,255,255,0.5)] rounded-[8px] w-full px-[10px] py-[10px] flex items-center gap-[10px]">
          <div className="flex items-center">
            {MOCK_AVATAR_COLORS.map((color, i) => (
              <div
                key={i}
                className="size-[39px] rounded-full border-[2.5px] border-[#ededed] shrink-0"
                style={{ backgroundColor: color, marginLeft: i === 0 ? 0 : -12 }}
              />
            ))}
          </div>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#b5b5b5] whitespace-nowrap">
            +20
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onConfirm}
          className="w-full bg-[#565656] rounded-full py-[18px] flex items-center justify-center active:opacity-80 transition-opacity"
        >
          <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[17px] text-[#adff19]">
            Confirmar reserva
          </p>
        </button>
      </div>
    </div>
  );
}
