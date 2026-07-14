// Monthly NPS recap for the "Actividad" tab — same 4-factor score as the weekly
// recap (trained recommended / did activity / slept well / ate well), shown as a
// calendar grid instead of a vertical list. Mocked variety since there's no real
// per-day completion tracking yet; future days show as empty/no-data.

type NPSStatus = "green" | "yellow" | "red" | "pending";

const NPS_META: Record<NPSStatus, { color: string; label: string }> = {
  green: { color: "#3ecf5f", label: "Excelente" },
  yellow: { color: "#f8b32e", label: "Bien" },
  red: { color: "#ff5c5c", label: "A mejorar" },
  pending: { color: "#c4c4c4", label: "Sin datos" },
};

// Deterministic repeating pattern so past days show a realistic mix of colors.
const MOCK_PATTERN: NPSStatus[] = ["green", "green", "yellow", "green", "yellow", "red", "green"];

export default function MonthlyNPSGrid() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // JS getDay(): 0=Sun..6=Sat — shift so the grid starts on Monday.
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = firstOfMonth.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  return (
    <div className="w-full rounded-[16px] bg-white p-[16px]" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
      <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px] capitalize">
        {monthLabel}
      </p>
      <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.24px] mt-[2px] mb-[14px]">
        Tu NPS del mes — entrenamiento, actividad, sueño y nutrición
      </p>

      <div className="grid grid-cols-7 gap-[6px] mb-[6px]">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <p key={i} className="text-center font-['MessinaSansWeb:SemiBold',sans-serif] text-[11px] text-[#a3a3a3]">
            {d}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[6px]">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const isFuture = day > todayDate;
          const status: NPSStatus = isFuture ? "pending" : MOCK_PATTERN[(day - 1) % MOCK_PATTERN.length];
          const meta = NPS_META[status];
          const isToday = day === todayDate;
          return (
            <div
              key={i}
              className="aspect-square rounded-[8px] flex items-center justify-center"
              style={{
                background: isFuture ? "#f5f5f5" : `${meta.color}22`,
                border: isToday ? "2px solid #3d3d3d" : "1px solid transparent",
              }}
            >
              <p
                className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px]"
                style={{ color: isFuture ? "#c4c4c4" : meta.color }}
              >
                {day}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-[16px] mt-[16px] flex-wrap">
        {(["green", "yellow", "red"] as NPSStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-[6px]">
            <div className="rounded-full size-[8px] shrink-0" style={{ background: NPS_META[s].color }} />
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[11px] text-[#6b7280]">{NPS_META[s].label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
