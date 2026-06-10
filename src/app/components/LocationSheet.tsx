import { Check, ChevronRight, Home, MapPin, Plus } from "lucide-react";
import BottomSheet from "./BottomSheet";

interface LocationSheetProps {
  open: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (location: string) => void;
  customLocations?: string[];
  onAddLocation: () => void;
}

function LocationRow({
  label,
  icon,
  selected,
  navigate,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  navigate?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-[14px] px-[20px] py-[14px] active:bg-black/5 transition-colors"
    >
      <div className="shrink-0 text-[#3d3d3d]">{icon}</div>
      <p className="flex-1 font-['MessinaSansWeb:Regular',sans-serif] text-[16px] text-[#3d3d3d] tracking-[-0.32px] text-left">
        {label}
      </p>
      {navigate ? (
        <ChevronRight size={16} className="text-[#a3a3a3]" strokeWidth={1.5} />
      ) : selected ? (
        <Check size={16} className="text-[#3d3d3d]" strokeWidth={2.5} />
      ) : null}
    </button>
  );
}

function Divider() {
  return <div className="h-[1px] bg-black/8 ml-[52px]" />;
}

const PIN = <MapPin size={18} strokeWidth={1.5} />;
const HOUSE = <Home size={18} strokeWidth={1.5} />;

export default function LocationSheet({
  open,
  onClose,
  selected,
  onSelect,
  customLocations = [],
  onAddLocation,
}: LocationSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Ubicación">
      <div className="pt-[8px] pb-[28px]">
        <p className="font-['Druk_Wide:Medium',sans-serif] text-[20px] text-[#3d3d3d] tracking-[-0.5px] leading-[1.1] px-[20px] pb-[16px]">
          ¿Dónde vas a entrenar?
        </p>

        {/* BIGG locations */}
        <LocationRow
          label="BIGG Recoleta"
          icon={PIN}
          selected={selected === "BIGG Recoleta"}
          onClick={() => onSelect("BIGG Recoleta")}
        />
        <LocationRow
          label="BIGG Tortuguitas"
          icon={PIN}
          selected={selected === "BIGG Tortuguitas"}
          onClick={() => onSelect("BIGG Tortuguitas")}
        />
        <LocationRow
          label="Seleccionar BIGG"
          icon={PIN}
          selected={false}
          navigate
          onClick={onClose}
        />

        <Divider />

        {/* Outdoors */}
        <LocationRow
          label="BIGG Outdoors"
          icon={PIN}
          selected={selected === "BIGG Outdoors"}
          onClick={() => onSelect("BIGG Outdoors")}
        />

        <Divider />

        {/* Home + custom */}
        <LocationRow
          label="En mi casa"
          icon={HOUSE}
          selected={selected === "En mi casa"}
          onClick={() => onSelect("En mi casa")}
        />
        {customLocations.map((loc) => (
          <LocationRow
            key={loc}
            label={loc}
            icon={PIN}
            selected={selected === loc}
            onClick={() => onSelect(loc)}
          />
        ))}

        <Divider />

        {/* Add location */}
        <button
          type="button"
          onClick={onAddLocation}
          className="w-full flex items-center gap-[14px] px-[20px] py-[14px] active:bg-black/5 transition-colors"
        >
          <div className="shrink-0 bg-[#3d3d3d] rounded-full flex items-center justify-center size-[18px]">
            <Plus size={11} className="text-white" strokeWidth={2.5} />
          </div>
          <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[16px] text-[#3d3d3d] tracking-[-0.32px]">
            Agregar ubicación
          </p>
        </button>
      </div>
    </BottomSheet>
  );
}
