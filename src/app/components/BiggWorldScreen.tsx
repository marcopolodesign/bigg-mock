import { useState } from "react";
import { Search, Navigation, MapPin, Star, ChevronRight, Lock } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

type MapFilter = "sedes" | "eventos" | "experiencias" | "beneficios";

interface Venue {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  baseDiscount: number;
  hasSponsoredWorkout?: boolean;
  sponsoredWorkoutName?: string;
  // 0–100% relative to map container
  x: number;
  y: number;
}

const VENUES: Venue[] = [
  { id: "fabric",    name: "Fabric Sushi",       category: "Sushi",       neighborhood: "Las Cañitas",   baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "HIIT × Fabric",       x: 38, y: 29 },
  { id: "gardiner",  name: "Gardiner",            category: "Vinoteca",    neighborhood: "Palermo",       baseDiscount: 10,                                                                              x: 53, y: 23 },
  { id: "volf",      name: "Volf",                category: "Cafetería",   neighborhood: "Recoleta",      baseDiscount: 10,                                                                              x: 66, y: 42 },
  { id: "cerini",    name: "Cerini Coffee",       category: "Café",        neighborhood: "Belgrano",      baseDiscount: 10,                                                                              x: 29, y: 17 },
  { id: "presidente",name: "Presidente Bar",      category: "Bar",         neighborhood: "Palermo",       baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "Cardio × Presidente", x: 48, y: 36 },
  { id: "happening", name: "Happening",           category: "Restaurante", neighborhood: "Núñez",         baseDiscount: 20,                                                                              x: 27, y: 11 },
  { id: "augusta",   name: "Augusta",             category: "Cafetería",   neighborhood: "Palermo",       baseDiscount: 10,                                                                              x: 56, y: 31 },
  { id: "slowkale",  name: "The Slow Kale",       category: "Healthy",     neighborhood: "Palermo",       baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "Recovery × Kale",     x: 44, y: 46 },
  { id: "gontran",   name: "Gontran Cherrier",    category: "Panadería",   neighborhood: "San Telmo",     baseDiscount: 10,                                                                              x: 73, y: 66 },
  { id: "tradesky",  name: "Trade SKY BAR",       category: "Bar",         neighborhood: "Puerto Madero", baseDiscount: 15,                                                                              x: 79, y: 56 },
  { id: "uptown",    name: "Up Town",             category: "Restaurante", neighborhood: "Microcentro",   baseDiscount: 10,                                                                              x: 71, y: 49 },
];

const BIGG_LOCATIONS = [
  { name: "BIGG Tortuguitas", x: 22, y: 48 },
  { name: "BIGG Recoleta",    x: 63, y: 38 },
];

// ─── Discount tier logic ───────────────────────────────────────────────────────

const CLASSES_THIS_MONTH = 8;
const TIERS = [
  { min: 4,  discount: 10, label: "Nivel 1" },
  { min: 8,  discount: 15, label: "Nivel 2" },
  { min: 12, discount: 20, label: "Nivel 3" },
];

function getActiveTier() {
  return [...TIERS].reverse().find((t) => CLASSES_THIS_MONTH >= t.min) ?? null;
}

// ─── Map background ────────────────────────────────────────────────────────────

function MapBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#e8e5de" }}>
      {/* Abstract street grid */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Main avenues */}
        <line x1="30%" y1="0" x2="45%" y2="100%" stroke="#d4cfc5" strokeWidth="6" />
        <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#d4cfc5" strokeWidth="6" />
        <line x1="0" y1="35%" x2="100%" y2="42%" stroke="#d4cfc5" strokeWidth="8" />
        <line x1="0" y1="58%" x2="100%" y2="62%" stroke="#d4cfc5" strokeWidth="6" />
        {/* Secondary streets */}
        <line x1="15%" y1="0" x2="20%" y2="100%" stroke="#dedad2" strokeWidth="3" />
        <line x1="50%" y1="0" x2="55%" y2="100%" stroke="#dedad2" strokeWidth="3" />
        <line x1="75%" y1="0" x2="78%" y2="100%" stroke="#dedad2" strokeWidth="3" />
        <line x1="0" y1="18%" x2="100%" y2="22%" stroke="#dedad2" strokeWidth="3" />
        <line x1="0" y1="48%" x2="100%" y2="50%" stroke="#dedad2" strokeWidth="3" />
        <line x1="0" y1="72%" x2="100%" y2="75%" stroke="#dedad2" strokeWidth="3" />
        {/* Park block */}
        <rect x="34%" y="26%" width="14%" height="10%" fill="#cee8a8" opacity="0.5" rx="4" />
        <rect x="55%" y="52%" width="12%" height="8%" fill="#cee8a8" opacity="0.4" rx="4" />
        {/* Block fills */}
        <rect x="20%" y="22%" width="9%" height="11%" fill="#dedad2" rx="2" />
        <rect x="62%" y="44%" width="11%" height="9%" fill="#dedad2" rx="2" />
        <rect x="40%" y="55%" width="8%" height="6%" fill="#dedad2" rx="2" />
      </svg>
    </div>
  );
}

// ─── Map pin components ────────────────────────────────────────────────────────

function BiggPin({ x, y, name, selected }: { x: number; y: number; name: string; selected: boolean }) {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -100%)", zIndex: selected ? 20 : 10 }}
    >
      <div
        className="flex items-center justify-center size-[36px] rounded-full border-[2px] border-white"
        style={{ background: "#1a1a1a", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
      >
        <span className="font-['Druk_Wide:Medium',sans-serif] text-[#adff19] text-[8px] leading-none tracking-tight">BIGG</span>
      </div>
      <div className="w-[2px] h-[6px] bg-[#1a1a1a]" />
      {selected && (
        <div className="bg-white px-[6px] py-[2px] rounded-[4px] mt-[2px] shadow-sm">
          <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[9px] text-[#3d3d3d] whitespace-nowrap">{name}</p>
        </div>
      )}
    </div>
  );
}

function BenefitPin({ venue, selected, onClick }: { venue: Venue; selected: boolean; onClick: () => void }) {
  const activeTier = getActiveTier();
  const unlocked = activeTier !== null && activeTier.discount >= venue.baseDiscount;

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute flex flex-col items-center active:scale-110 transition-transform"
      style={{ left: `${venue.x}%`, top: `${venue.y}%`, transform: "translate(-50%, -100%)", zIndex: selected ? 20 : 10 }}
    >
      <div
        className="flex items-center gap-[3px] px-[7px] py-[5px] rounded-[20px] border-[1.5px] border-white"
        style={{
          background: selected ? "#adff19" : unlocked ? "#1a1a1a" : "#a3a3a3",
          boxShadow: selected ? "0 2px 12px rgba(173,255,25,0.5)" : "0 2px 6px rgba(0,0,0,0.25)",
        }}
      >
        {!unlocked && <Lock size={8} className="text-white" strokeWidth={2} />}
        <span
          className="font-['MessinaSansWeb:Bold',sans-serif] text-[9px] leading-none whitespace-nowrap"
          style={{ color: selected ? "#1a3d00" : "white" }}
        >
          {venue.baseDiscount}% off
        </span>
      </div>
      <div className="w-[1.5px] h-[5px]" style={{ background: selected ? "#adff19" : unlocked ? "#1a1a1a" : "#a3a3a3" }} />
    </button>
  );
}

function UserDot() {
  return (
    <div className="absolute" style={{ left: "50%", top: "44%", transform: "translate(-50%,-50%)", zIndex: 30 }}>
      <div className="size-[14px] rounded-full bg-[#4a90e2] border-[2.5px] border-white shadow-md" />
    </div>
  );
}

// ─── Top map overlays ──────────────────────────────────────────────────────────

function SearchBar() {
  return (
    <div className="absolute top-[10px] left-[12px] right-[12px] flex items-center gap-[8px] z-20">
      <div className="flex-1 flex items-center gap-[8px] bg-white rounded-[12px] px-[12px] py-[10px] shadow-sm">
        <Search size={15} className="text-[#a3a3a3] shrink-0" strokeWidth={1.8} />
        <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[14px] text-[#a3a3a3] tracking-[-0.14px]">Buscar</p>
      </div>
      <button type="button" className="size-[40px] bg-white rounded-[12px] flex items-center justify-center shadow-sm active:opacity-70">
        <Navigation size={16} className="text-[#3d3d3d]" strokeWidth={1.8} />
      </button>
    </div>
  );
}

function MapFilterChips({ active, onChange }: { active: MapFilter; onChange: (f: MapFilter) => void }) {
  const chips: { id: MapFilter; label: string; icon: string }[] = [
    { id: "sedes",        label: "Sedes",        icon: "🏠" },
    { id: "beneficios",   label: "Beneficios",   icon: "⭐" },
    { id: "eventos",      label: "Eventos",      icon: "🎯" },
    { id: "experiencias", label: "Experiencias", icon: "✨" },
  ];

  return (
    <div className="absolute top-[62px] left-[12px] flex gap-[6px] z-20">
      {chips.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className="flex items-center gap-[5px] px-[10px] py-[6px] rounded-[100px] active:opacity-70 transition-all"
            style={{
              background: isActive ? "#1a1a1a" : "rgba(255,255,255,0.92)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
            }}
          >
            <p
              className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[12px] tracking-[-0.12px] whitespace-nowrap"
              style={{ color: isActive ? (c.id === "beneficios" ? "#adff19" : "white") : "#3d3d3d" }}
            >
              {c.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

// ─── Bottom panel — Beneficios ─────────────────────────────────────────────────

function ProgressHeader() {
  const activeTier = getActiveTier();
  const nextTier = TIERS.find((t) => t.min > CLASSES_THIS_MONTH);
  const toNext = nextTier ? nextTier.min - CLASSES_THIS_MONTH : 0;
  const progressPct = Math.min((CLASSES_THIS_MONTH / 12) * 100, 100);

  return (
    <div className="px-[16px] pt-[4px] pb-[14px] border-b border-black/6">
      <div className="flex items-center justify-between mb-[10px]">
        <div>
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[18px] text-[#3d3d3d] tracking-[-0.5px] leading-[1.1]">
            Club de Beneficios
          </p>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[12px] text-[#a3a3a3] tracking-[-0.12px] mt-[2px]">
            {CLASSES_THIS_MONTH} clases este mes
          </p>
        </div>
        {activeTier && (
          <div className="flex items-center gap-[4px] bg-[#adff19] px-[10px] py-[5px] rounded-full">
            <Star size={10} fill="#1a3d00" className="text-[#1a3d00]" />
            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[11px] text-[#1a3d00] tracking-[-0.11px]">
              {activeTier.label} · {activeTier.discount}% off
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-[5px]">
        <div className="w-full h-[5px] rounded-full bg-black/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #adff19, #7acc00)" }}
          />
        </div>
        <div className="flex justify-between items-center">
          {TIERS.map((t) => {
            const unlocked = CLASSES_THIS_MONTH >= t.min;
            return (
              <div key={t.min} className="flex items-center gap-[3px]">
                <div
                  className="size-[6px] rounded-full"
                  style={{ background: unlocked ? "#adff19" : "#d4d4d4" }}
                />
                <p
                  className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[10px] tracking-[-0.1px]"
                  style={{ color: unlocked ? "#3d3d3d" : "#a3a3a3" }}
                >
                  {t.discount}% · {t.min} cl.
                </p>
              </div>
            );
          })}
          {nextTier && (
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[10px] text-[#a3a3a3]">
              {toNext} más → {nextTier.discount}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function VenueCard({ venue, activeTierDiscount }: { venue: Venue; activeTierDiscount: number | null }) {
  const unlocked = activeTierDiscount !== null && activeTierDiscount >= venue.baseDiscount;
  const effectiveDiscount = unlocked ? venue.baseDiscount : null;

  return (
    <div
      className="shrink-0 w-[240px] rounded-[16px] overflow-hidden"
      style={{
        background: unlocked ? "white" : "#f5f5f5",
        border: unlocked ? "1px solid rgba(0,0,0,0.07)" : "1px solid #ebebeb",
        boxShadow: unlocked ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Header */}
      <div
        className="px-[14px] pt-[14px] pb-[10px]"
        style={{ background: unlocked ? "linear-gradient(135deg, #f9f9f9 0%, #edfde0 100%)" : "#f5f5f5" }}
      >
        <div className="flex items-start justify-between gap-[8px]">
          <div className="flex-1 min-w-0">
            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#3d3d3d] tracking-[-0.3px] leading-[1.2]">
              {venue.name}
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[11px] text-[#a3a3a3] tracking-[-0.11px] mt-[2px]">
              {venue.category} · {venue.neighborhood}
            </p>
          </div>
          {unlocked ? (
            <div className="bg-[#adff19] px-[8px] py-[4px] rounded-[6px] shrink-0">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#1a3d00] text-[13px] tracking-[-0.13px]">
                {effectiveDiscount}% off
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-[3px] bg-[#ebebeb] px-[8px] py-[4px] rounded-[6px] shrink-0">
              <Lock size={9} className="text-[#a3a3a3]" strokeWidth={2} />
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#a3a3a3] text-[11px] tracking-[-0.11px]">
                {venue.baseDiscount}% off
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sponsored workout */}
      {venue.hasSponsoredWorkout && (
        <div className="px-[14px] py-[10px] border-t border-black/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[11px] text-[#3d3d3d] tracking-[-0.11px]">
                Workout patrocinado
              </p>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[10px] text-[#a3a3a3] tracking-[-0.1px] mt-[1px]">
                {venue.sponsoredWorkoutName} → +5% extra
              </p>
            </div>
            <ChevronRight size={12} className="text-[#a3a3a3]" strokeWidth={1.5} />
          </div>
        </div>
      )}

      {/* CTA */}
      {unlocked && (
        <div className="px-[14px] pb-[14px]">
          <button
            type="button"
            className="w-full bg-[#1a1a1a] rounded-[10px] py-[10px] flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-white text-[12px] tracking-[-0.12px]">
              Usar beneficio
            </p>
          </button>
        </div>
      )}

      {!unlocked && (
        <div className="px-[14px] pb-[14px]">
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[10px] text-[#a3a3a3] tracking-[-0.1px]">
            Completá {venue.baseDiscount === 20 ? "Nivel 3 (12 cl.)" : venue.baseDiscount === 15 ? "Nivel 2 (8 cl.)" : "Nivel 1 (4 cl.)"} para desbloquear
          </p>
        </div>
      )}
    </div>
  );
}

function BeneficiosPanel({ selectedVenueId }: { selectedVenueId: string | null }) {
  const activeTier = getActiveTier();
  const activeTierDiscount = activeTier?.discount ?? null;

  // Sort: selected first, then unlocked, then locked
  const sorted = [...VENUES].sort((a, b) => {
    if (a.id === selectedVenueId) return -1;
    if (b.id === selectedVenueId) return 1;
    const aUnlocked = activeTierDiscount !== null && activeTierDiscount >= a.baseDiscount;
    const bUnlocked = activeTierDiscount !== null && activeTierDiscount >= b.baseDiscount;
    return Number(bUnlocked) - Number(aUnlocked);
  });

  return (
    <div className="flex flex-col h-full">
      <ProgressHeader />
      <div
        className="flex gap-[10px] px-[16px] py-[14px] overflow-x-auto"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {sorted.map((v) => (
          <VenueCard key={v.id} venue={v} activeTierDiscount={activeTierDiscount} />
        ))}
        <div className="shrink-0 w-[1px]" aria-hidden />
      </div>
    </div>
  );
}

// ─── Sedes panel ──────────────────────────────────────────────────────────────

const COUNTRIES = ["TODOS", "ARGENTINA", "URUGUAY", "PARAGUAY", "CHILE", "PERÚ", "COLOMBIA"];

function SedesPanel() {
  const [activeCountry, setActiveCountry] = useState("TODOS");

  return (
    <div className="flex flex-col h-full">
      {/* Country chips */}
      <div
        className="flex gap-[8px] px-[16px] pt-[14px] pb-[10px] overflow-x-auto"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {COUNTRIES.map((c) => {
          const isActive = activeCountry === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCountry(c)}
              className="shrink-0 px-[14px] py-[7px] rounded-full active:opacity-70 transition-colors"
              style={{
                background: isActive ? "#adff19" : "#ebebeb",
              }}
            >
              <p
                className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[12px] tracking-[-0.12px] whitespace-nowrap"
                style={{ color: isActive ? "#1a3d00" : "#565656" }}
              >
                {c}
              </p>
            </button>
          );
        })}
      </div>
      {/* Location card */}
      <div className="px-[16px] pb-[16px]">
        <div className="relative rounded-[16px] overflow-hidden bg-[#1a1a1a] h-[140px] flex flex-col justify-end p-[16px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="relative z-10">
            <p className="font-['Druk_Wide:Medium',sans-serif] text-white text-[22px] tracking-[-0.5px] leading-[1.1]">
              TORTUGUITAS
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-white/60 text-[12px] tracking-[-0.12px] mt-[2px]">
              Argentina · km 45 Panamericana
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export default function BiggWorldScreen() {
  const [activeFilter, setActiveFilter] = useState<MapFilter>("sedes");
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  const showBeneficios = activeFilter === "beneficios";

  const PANEL_HEIGHT = "52%";

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      {/* ── Map ── */}
      <div className="relative flex-1">
        <MapBackground />
        <SearchBar />
        <MapFilterChips active={activeFilter} onChange={(f) => { setActiveFilter(f); setSelectedVenueId(null); }} />

        {/* BIGG pins — always visible */}
        {BIGG_LOCATIONS.map((loc) => (
          <BiggPin key={loc.name} x={loc.x} y={loc.y} name={loc.name} selected={false} />
        ))}

        {/* Benefit venue pins — when Beneficios active */}
        {showBeneficios && VENUES.map((v) => (
          <BenefitPin
            key={v.id}
            venue={v}
            selected={selectedVenueId === v.id}
            onClick={() => setSelectedVenueId(selectedVenueId === v.id ? null : v.id)}
          />
        ))}

        <UserDot />
      </div>

      {/* ── Bottom panel ── */}
      <div
        className="shrink-0 bg-white rounded-t-[20px] overflow-hidden flex flex-col"
        style={{ height: PANEL_HEIGHT, boxShadow: "0 -4px 20px rgba(0,0,0,0.10)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-[10px] pb-[4px] shrink-0">
          <div className="w-[36px] h-[4px] rounded-full bg-[#d4d4d4]" />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {showBeneficios ? (
            <BeneficiosPanel selectedVenueId={selectedVenueId} />
          ) : (
            <SedesPanel />
          )}
        </div>
      </div>
    </div>
  );
}
