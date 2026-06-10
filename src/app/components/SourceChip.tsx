// Provenance chip for data imported from external fitness/health sources.
// Used across the activity timeline and the habit-recommendation cards
// (sleep, steps) to make clear where each datapoint comes from.

export type DataSource = "strava" | "garmin" | "apple-health";

const SOURCE_META: Record<DataSource, { label: string; color: string }> = {
  strava: { label: "Strava", color: "#fc4c02" },
  garmin: { label: "Garmin", color: "#007cc3" },
  "apple-health": { label: "Apple Health", color: "#fe375f" },
};

interface SourceChipProps {
  source: DataSource;
  /** Optional leading text, e.g. "Tomado desde" or "Datos de". */
  prefix?: string;
  /** Use the light-on-dark variant for chips placed on dark backgrounds. */
  onDark?: boolean;
}

export default function SourceChip({ source, prefix, onDark = false }: SourceChipProps) {
  const meta = SOURCE_META[source];
  const text = prefix ? `${prefix} ${meta.label}` : meta.label;

  return (
    <div
      className="flex items-center gap-[6px] px-[10px] py-[5px] rounded-full self-start"
      style={{ background: onDark ? "rgba(255,255,255,0.15)" : `${meta.color}1a` }}
    >
      <div className="size-[7px] rounded-full shrink-0" style={{ background: meta.color }} />
      <p
        className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[12px] tracking-[-0.24px] whitespace-nowrap"
        style={{ color: onDark ? "rgba(255,255,255,0.9)" : meta.color }}
      >
        {text}
      </p>
    </div>
  );
}
