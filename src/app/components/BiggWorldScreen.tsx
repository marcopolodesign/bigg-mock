import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, Lock, ChevronRight, MapPin } from "lucide-react";

// ─── Types & data ─────────────────────────────────────────────────────────────

type MapFilter = "sedes" | "eventos" | "experiencias" | "beneficios";

interface Venue {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  baseDiscount: number;
  hasSponsoredWorkout?: boolean;
  sponsoredWorkoutName?: string;
  lat: number;
  lng: number;
}

interface BiggLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  gradient: string;
}

const VENUES: Venue[] = [
  { id: "fabric",     name: "Fabric Sushi",    category: "Sushi",       neighborhood: "Las Cañitas",   baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "HIIT × Fabric",       lat: -34.568, lng: -58.448 },
  { id: "gardiner",   name: "Gardiner",         category: "Vinoteca",    neighborhood: "Palermo",       baseDiscount: 10,                                                                              lat: -34.585, lng: -58.422 },
  { id: "volf",       name: "Volf",             category: "Cafetería",   neighborhood: "Recoleta",      baseDiscount: 10,                                                                              lat: -34.590, lng: -58.388 },
  { id: "cerini",     name: "Cerini Coffee",    category: "Café",        neighborhood: "Belgrano",      baseDiscount: 10,                                                                              lat: -34.562, lng: -58.453 },
  { id: "presidente", name: "Presidente Bar",   category: "Bar",         neighborhood: "Palermo",       baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "Cardio × Presidente", lat: -34.582, lng: -58.432 },
  { id: "happening",  name: "Happening",        category: "Restaurante", neighborhood: "Núñez",         baseDiscount: 20,                                                                              lat: -34.546, lng: -58.452 },
  { id: "augusta",    name: "Augusta",          category: "Cafetería",   neighborhood: "Palermo",       baseDiscount: 10,                                                                              lat: -34.578, lng: -58.421 },
  { id: "slowkale",   name: "The Slow Kale",    category: "Healthy",     neighborhood: "Palermo",       baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "Recovery × Kale",     lat: -34.591, lng: -58.416 },
  { id: "gontran",    name: "Gontran Cherrier", category: "Panadería",   neighborhood: "San Telmo",     baseDiscount: 10,                                                                              lat: -34.621, lng: -58.369 },
  { id: "tradesky",   name: "Trade SKY BAR",    category: "Bar",         neighborhood: "Puerto Madero", baseDiscount: 15,                                                                              lat: -34.608, lng: -58.361 },
  { id: "uptown",     name: "Up Town",          category: "Restaurante", neighborhood: "Microcentro",   baseDiscount: 10,                                                                              lat: -34.603, lng: -58.373 },
];

const BIGG_LOCATIONS: BiggLocation[] = [
  { id: "recoleta",    name: "BIGG Recoleta",    city: "Buenos Aires", country: "Argentina", address: "Av. del Libertador 4450",         lat: -34.567, lng: -58.415, gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" },
  { id: "palermo",     name: "BIGG Palermo",     city: "Buenos Aires", country: "Argentina", address: "Thames 1747",                     lat: -34.585, lng: -58.440, gradient: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)" },
  { id: "belgrano",    name: "BIGG Belgrano",    city: "Buenos Aires", country: "Argentina", address: "Av. Cabildo 2560",                lat: -34.559, lng: -58.449, gradient: "linear-gradient(135deg, #1a1a2e 0%, #0d1117 100%)" },
  { id: "tortuguitas", name: "BIGG Tortuguitas", city: "Tortuguitas",  country: "Argentina", address: "Ramal Pilar km 44.5",             lat: -34.471, lng: -58.630, gradient: "linear-gradient(135deg, #0d1117 0%, #1a1a2e 100%)" },
  { id: "montevideo",  name: "BIGG Montevideo",  city: "Montevideo",   country: "Uruguay",   address: "Av. 18 de Julio 1234",            lat: -34.906, lng: -56.191, gradient: "linear-gradient(135deg, #161b22 0%, #1a1a2e 100%)" },
];

// ─── Loyalty tiers ─────────────────────────────────────────────────────────────

const CLASSES_THIS_MONTH = 8;
const TIERS = [
  { min: 4,  discount: 10, label: "Nivel 1" },
  { min: 8,  discount: 15, label: "Nivel 2" },
  { min: 12, discount: 20, label: "Nivel 3" },
];

function getActiveTier() {
  return [...TIERS].reverse().find((t) => CLASSES_THIS_MONTH >= t.min) ?? null;
}

// ─── Custom Leaflet icons (inline HTML, no asset paths) ───────────────────────

function makeBiggIcon(selected: boolean) {
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          background:${selected ? "#adff19" : "#1a1a1a"};
          color:${selected ? "#1a3d00" : "#adff19"};
          font-family:'Druk Wide',sans-serif;
          font-size:8px;
          font-weight:700;
          letter-spacing:-0.5px;
          padding:5px 10px;
          border-radius:20px;
          border:2px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          white-space:nowrap;
          line-height:1;
        ">BIGG</div>
        <div style="width:2px;height:6px;background:${selected ? "#adff19" : "#1a1a1a"}"></div>
      </div>`,
    className: "",
    iconSize: [52, 32],
    iconAnchor: [26, 32],
  });
}

function makeVenueIcon(venue: Venue, selected: boolean, activeTierDiscount: number | null) {
  const unlocked = activeTierDiscount !== null && activeTierDiscount >= venue.baseDiscount;
  const bg = selected ? "#adff19" : unlocked ? "#1a1a1a" : "#a3a3a3";
  const color = selected ? "#1a3d00" : "white";
  const lock = !unlocked ? `<span style="margin-right:2px;font-size:8px;">🔒</span>` : "";
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          background:${bg};
          color:${color};
          font-family:sans-serif;
          font-size:9px;
          font-weight:700;
          padding:4px 8px;
          border-radius:20px;
          border:1.5px solid white;
          box-shadow:${selected ? "0 2px 12px rgba(173,255,25,0.5)" : "0 2px 6px rgba(0,0,0,0.25)"};
          white-space:nowrap;
          line-height:1;
          display:flex;align-items:center;gap:2px;
        ">${lock}${venue.baseDiscount}% off</div>
        <div style="width:1.5px;height:5px;background:${bg}"></div>
      </div>`,
    className: "",
    iconSize: [70, 28],
    iconAnchor: [35, 28],
  });
}

// ─── Map event handler (to deselect on map click) ─────────────────────────────

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: onMapClick });
  return null;
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

function MapFilterChips({ active, onChange }: { active: MapFilter; onChange: (f: MapFilter) => void }) {
  const chips: { id: MapFilter; label: string }[] = [
    { id: "sedes",        label: "Sedes" },
    { id: "beneficios",   label: "Beneficios" },
    { id: "eventos",      label: "Eventos" },
    { id: "experiencias", label: "Experiencias" },
  ];
  return (
    <div className="absolute top-[52px] left-[12px] flex gap-[6px] z-[1000]">
      {chips.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className="flex items-center px-[10px] py-[6px] rounded-[100px] active:opacity-70 transition-all"
            style={{
              background: isActive ? "#1a1a1a" : "rgba(255,255,255,0.95)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
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

// ─── Bottom panel — Sedes ─────────────────────────────────────────────────────

const COUNTRIES = ["TODOS", "ARGENTINA", "URUGUAY", "PARAGUAY", "CHILE", "PERÚ"];

function SedesPanel({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const [activeCountry, setActiveCountry] = useState("TODOS");

  const filtered = activeCountry === "TODOS"
    ? BIGG_LOCATIONS
    : BIGG_LOCATIONS.filter((l) => l.country.toUpperCase() === activeCountry);

  return (
    <div className="flex flex-col h-full">
      {/* Country chips */}
      <div
        className="flex gap-[8px] px-[16px] pt-[4px] pb-[10px] overflow-x-auto shrink-0"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {COUNTRIES.map((c) => {
          const isActive = activeCountry === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCountry(c)}
              className="shrink-0 px-[12px] py-[6px] rounded-full active:opacity-70 transition-colors"
              style={{ background: isActive ? "#adff19" : "#ebebeb" }}
            >
              <p
                className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[11px] tracking-[-0.11px] whitespace-nowrap"
                style={{ color: isActive ? "#1a3d00" : "#565656" }}
              >
                {c}
              </p>
            </button>
          );
        })}
      </div>

      {/* Location cards */}
      <div className="flex-1 overflow-y-auto px-[16px] pb-[16px] flex flex-col gap-[10px]">
        {filtered.map((loc) => {
          const isSelected = selectedId === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelect(loc.id)}
              className="w-full relative rounded-[16px] overflow-hidden h-[110px] active:opacity-80 transition-opacity text-left"
              style={{
                background: loc.gradient,
                boxShadow: isSelected ? "0 0 0 2.5px #adff19, 0 4px 16px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              {/* Subtle grid texture */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(255,255,255,0.5) 24px,rgba(255,255,255,0.5) 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,rgba(255,255,255,0.5) 24px,rgba(255,255,255,0.5) 25px)"
              }} />

              <div className="absolute inset-0 flex flex-col justify-between p-[14px]">
                {/* Top: country badge */}
                <div className="flex items-start justify-between">
                  <div className="bg-[#adff19] px-[8px] py-[3px] rounded-full">
                    <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#1a3d00] text-[9px] tracking-[-0.09px]">
                      {loc.country}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="bg-[#adff19] rounded-full size-[18px] flex items-center justify-center">
                      <MapPin size={10} fill="#1a3d00" className="text-[#1a3d00]" />
                    </div>
                  )}
                </div>

                {/* Bottom: name + address */}
                <div>
                  <p className="font-['Druk_Wide:Medium',sans-serif] text-white text-[20px] tracking-[-0.5px] leading-[1.1]">
                    {loc.name.replace("BIGG ", "")}
                  </p>
                  <p className="font-['MessinaSansWeb:Regular',sans-serif] text-white/50 text-[11px] tracking-[-0.11px] mt-[2px]">
                    {loc.address} · {loc.city}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Bottom panel — Beneficios ────────────────────────────────────────────────

function ProgressHeader() {
  const activeTier = getActiveTier();
  const nextTier = TIERS.find((t) => t.min > CLASSES_THIS_MONTH);
  const toNext = nextTier ? nextTier.min - CLASSES_THIS_MONTH : 0;
  const progressPct = Math.min((CLASSES_THIS_MONTH / 12) * 100, 100);

  return (
    <div className="px-[16px] pt-[4px] pb-[12px] border-b border-black/6 shrink-0">
      <div className="flex items-center justify-between mb-[10px]">
        <div>
          <p className="font-['Druk_Wide:Medium',sans-serif] text-[17px] text-[#3d3d3d] tracking-[-0.5px] leading-[1.1]">Club de Beneficios</p>
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[11px] text-[#a3a3a3] tracking-[-0.11px] mt-[2px]">{CLASSES_THIS_MONTH} clases este mes</p>
        </div>
        {activeTier && (
          <div className="flex items-center gap-[4px] bg-[#adff19] px-[9px] py-[4px] rounded-full">
            <Star size={9} fill="#1a3d00" className="text-[#1a3d00]" />
            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[10px] text-[#1a3d00] tracking-[-0.1px]">{activeTier.label} · {activeTier.discount}% off</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-[5px]">
        <div className="w-full h-[5px] rounded-full bg-black/8 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #adff19, #7acc00)" }} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-[10px]">
            {TIERS.map((t) => {
              const unlocked = CLASSES_THIS_MONTH >= t.min;
              return (
                <div key={t.min} className="flex items-center gap-[3px]">
                  <div className="size-[5px] rounded-full" style={{ background: unlocked ? "#adff19" : "#d4d4d4" }} />
                  <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[9px] tracking-[-0.09px]" style={{ color: unlocked ? "#3d3d3d" : "#a3a3a3" }}>
                    {t.discount}% · {t.min} cl.
                  </p>
                </div>
              );
            })}
          </div>
          {nextTier && (
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[9px] text-[#a3a3a3]">{toNext} más → {nextTier.discount}%</p>
          )}
        </div>
      </div>
    </div>
  );
}

function VenueCard({ venue, activeTierDiscount, selected, cardRef }: { venue: Venue; activeTierDiscount: number | null; selected: boolean; cardRef?: (el: HTMLDivElement | null) => void }) {
  const unlocked = activeTierDiscount !== null && activeTierDiscount >= venue.baseDiscount;

  return (
    <div
      ref={cardRef}
      className="shrink-0 w-[230px] rounded-[16px] overflow-hidden flex flex-col transition-all"
      style={{
        background: "white",
        border: selected ? "2px solid #adff19" : "1px solid rgba(0,0,0,0.07)",
        boxShadow: selected ? "0 0 0 3px rgba(173,255,25,0.2), 0 4px 16px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Venue header */}
      <div className="px-[13px] pt-[13px] pb-[10px]" style={{ background: unlocked ? "linear-gradient(135deg,#f9f9f9,#edfde0)" : "#f7f7f7" }}>
        <div className="flex items-start justify-between gap-[8px]">
          <div className="flex-1 min-w-0">
            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[14px] text-[#3d3d3d] tracking-[-0.28px] leading-[1.2]">{venue.name}</p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[10px] text-[#a3a3a3] tracking-[-0.1px] mt-[2px]">{venue.category} · {venue.neighborhood}</p>
          </div>
          {unlocked ? (
            <div className="bg-[#adff19] px-[7px] py-[3px] rounded-[6px] shrink-0">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#1a3d00] text-[12px] tracking-[-0.12px]">{venue.baseDiscount}% off</p>
            </div>
          ) : (
            <div className="flex items-center gap-[2px] bg-[#ebebeb] px-[7px] py-[3px] rounded-[6px] shrink-0">
              <Lock size={8} className="text-[#a3a3a3]" strokeWidth={2} />
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#a3a3a3] text-[10px] tracking-[-0.1px]">{venue.baseDiscount}% off</p>
            </div>
          )}
        </div>
      </div>

      {/* Sponsored workout */}
      {venue.hasSponsoredWorkout && (
        <div className="px-[13px] py-[9px] border-t border-black/5 flex items-center justify-between">
          <div>
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[10px] text-[#3d3d3d] tracking-[-0.1px]">Workout patrocinado</p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[9px] text-[#a3a3a3] tracking-[-0.09px] mt-[1px]">{venue.sponsoredWorkoutName} → +5% extra</p>
          </div>
          <ChevronRight size={11} className="text-[#a3a3a3]" strokeWidth={1.5} />
        </div>
      )}

      {/* CTA */}
      <div className="px-[13px] pb-[13px] mt-auto">
        {unlocked ? (
          <button type="button" className="w-full bg-[#1a1a1a] rounded-[10px] py-[9px] flex items-center justify-center active:opacity-70 transition-opacity">
            <p className="font-['MessinaSansWeb:Bold',sans-serif] text-white text-[11px] tracking-[-0.11px]">Usar beneficio</p>
          </button>
        ) : (
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[9px] text-[#a3a3a3] tracking-[-0.09px]">
            {venue.baseDiscount === 20 ? "Nivel 3 (12 cl.)" : venue.baseDiscount === 15 ? "Nivel 2 (8 cl.)" : "Nivel 1 (4 cl.)"} para desbloquear
          </p>
        )}
      </div>
    </div>
  );
}

function BeneficiosPanel({ selectedId }: { selectedId: string | null }) {
  const activeTier = getActiveTier();
  const activeTierDiscount = activeTier?.discount ?? null;
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedId && cardRefs.current[selectedId]) {
      cardRefs.current[selectedId]!.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedId]);

  const sorted = [...VENUES].sort((a, b) => {
    if (a.id === selectedId) return -1;
    if (b.id === selectedId) return 1;
    const aU = activeTierDiscount !== null && activeTierDiscount >= a.baseDiscount;
    const bU = activeTierDiscount !== null && activeTierDiscount >= b.baseDiscount;
    return Number(bU) - Number(aU);
  });

  return (
    <div className="flex flex-col h-full">
      <ProgressHeader />
      <div
        className="flex gap-[10px] px-[16px] py-[12px] overflow-x-auto flex-1"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", alignItems: "flex-start" } as React.CSSProperties}
      >
        {sorted.map((v) => (
          <VenueCard
            key={v.id}
            venue={v}
            activeTierDiscount={activeTierDiscount}
            selected={selectedId === v.id}
            cardRef={(el) => { cardRefs.current[v.id] = el; }}
          />
        ))}
        <div className="shrink-0 w-[1px]" aria-hidden />
      </div>
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

const BA_CENTER: [number, number] = [-34.583, -58.425];

export default function BiggWorldScreen() {
  const [activeFilter, setActiveFilter] = useState<MapFilter>("sedes");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isBeneficios = activeFilter === "beneficios";
  const activeTier = getActiveTier();
  const activeTierDiscount = activeTier?.discount ?? null;

  function handleFilterChange(f: MapFilter) {
    setActiveFilter(f);
    setSelectedId(null);
  }

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      {/* ── Map ── */}
      <div className="relative flex-1">
        <MapContainer
          center={BA_CENTER}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
          attributionControl={false}
        >
          {/* CartoDB Positron — clean grey tiles, no API key needed */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

          <MapClickHandler onMapClick={() => setSelectedId(null)} />

          {/* BIGG location pins */}
          {BIGG_LOCATIONS.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={makeBiggIcon(selectedId === loc.id)}
              eventHandlers={{ click: () => setSelectedId(selectedId === loc.id ? null : loc.id) }}
            />
          ))}

          {/* Venue pins — only when Beneficios is active */}
          {isBeneficios && VENUES.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={makeVenueIcon(v, selectedId === v.id, activeTierDiscount)}
              eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); setSelectedId(selectedId === v.id ? null : v.id); } }}
            />
          ))}
        </MapContainer>

        {/* Filter chips overlay */}
        <MapFilterChips active={activeFilter} onChange={handleFilterChange} />
      </div>

      {/* ── Bottom panel ── */}
      <div
        className="shrink-0 bg-white rounded-t-[20px] overflow-hidden flex flex-col"
        style={{ height: "50%", boxShadow: "0 -4px 20px rgba(0,0,0,0.10)" }}
      >
        <div className="flex justify-center pt-[10px] pb-[6px] shrink-0">
          <div className="w-[36px] h-[4px] rounded-full bg-[#d4d4d4]" />
        </div>

        <div className="flex-1 overflow-hidden">
          {isBeneficios ? (
            <BeneficiosPanel selectedId={selectedId} />
          ) : (
            <SedesPanel
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(selectedId === id ? null : id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
