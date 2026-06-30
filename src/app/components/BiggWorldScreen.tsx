import { useState, useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, Lock, ChevronRight, MapPin, Calendar, Compass, Tag, Globe, X } from "lucide-react";

const BIGG_API_TOKEN = "88224c27a0de9817d3249ee3af412f8d";

// ─── Colors (matching biggapp CONSTANTS) ──────────────────────────────────────
const C = {
  GREEN: "#ADFF19",
  NEW_GREEN: "#D6FF8C",
  NEW_DARK: "#3D3D3D",
  BG: "#EDEDED",
  MID: "#A3A3A3",
  WHITE: "#FFFFFF",
};

// ─── Types & data ─────────────────────────────────────────────────────────────

type MapFilter = "all" | "sedes" | "beneficios" | "eventos" | "experiencias";

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
  photoSeed: string;
}

interface BiggLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  photoSeed: string;
}

const VENUES: Venue[] = [
  { id: "fabric",     name: "Fabric Sushi",    category: "Sushi",       neighborhood: "Las Cañitas",   baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "HIIT × Fabric",       lat: -34.568, lng: -58.448, photoSeed: "fabric"     },
  { id: "gardiner",   name: "Gardiner",         category: "Vinoteca",    neighborhood: "Palermo",       baseDiscount: 10,                                                                              lat: -34.585, lng: -58.422, photoSeed: "gardiner"   },
  { id: "volf",       name: "Volf",             category: "Cafetería",   neighborhood: "Recoleta",      baseDiscount: 10,                                                                              lat: -34.590, lng: -58.388, photoSeed: "volf"       },
  { id: "cerini",     name: "Cerini Coffee",    category: "Café",        neighborhood: "Belgrano",      baseDiscount: 10,                                                                              lat: -34.562, lng: -58.453, photoSeed: "cerini"     },
  { id: "presidente", name: "Presidente Bar",   category: "Bar",         neighborhood: "Palermo",       baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "Cardio × Presidente", lat: -34.582, lng: -58.432, photoSeed: "bar"        },
  { id: "happening",  name: "Happening",        category: "Restaurante", neighborhood: "Núñez",         baseDiscount: 20,                                                                              lat: -34.546, lng: -58.452, photoSeed: "happening"  },
  { id: "augusta",    name: "Augusta",          category: "Cafetería",   neighborhood: "Palermo",       baseDiscount: 10,                                                                              lat: -34.578, lng: -58.421, photoSeed: "coffee"     },
  { id: "slowkale",   name: "The Slow Kale",    category: "Healthy",     neighborhood: "Palermo",       baseDiscount: 15, hasSponsoredWorkout: true,  sponsoredWorkoutName: "Recovery × Kale",     lat: -34.591, lng: -58.416, photoSeed: "salad"      },
  { id: "gontran",    name: "Gontran Cherrier", category: "Panadería",   neighborhood: "San Telmo",     baseDiscount: 10,                                                                              lat: -34.621, lng: -58.369, photoSeed: "bakery"     },
  { id: "tradesky",   name: "Trade SKY BAR",    category: "Bar",         neighborhood: "Puerto Madero", baseDiscount: 15,                                                                              lat: -34.608, lng: -58.361, photoSeed: "rooftop"   },
  { id: "uptown",     name: "Up Town",          category: "Restaurante", neighborhood: "Microcentro",   baseDiscount: 10,                                                                              lat: -34.603, lng: -58.373, photoSeed: "restaurant" },
];

// Populated dynamically from API — see BiggWorldScreen useEffect
const BIGG_LOCATIONS_INITIAL: BiggLocation[] = [];

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

// ─── BIGG SVG pin (matches PinBIGG.js from biggapp exactly) ──────────────────

const BIGG_LOGO =
  "M26.1035 22.6628C26.8641 22.6647 27.6048 22.8978 28.2208 23.3291L29.6812 21.9174L21.3757 22.425C21.2784 22.5565 21.1904 22.6941 21.1124 22.8371V22.4406L14.7463 22.8371C14.7926 22.9023 14.8156 22.9803 14.812 23.0593V23.0753C14.812 23.4086 14.4837 23.5989 13.7945 23.5989H12.3995V22.9642L9.28119 23.1544V24.519L24.5444 25.7565C24.3491 25.6007 24.193 25.4041 24.0878 25.1815C23.9826 24.9589 23.931 24.7161 23.937 24.4714V24.4555C23.937 23.4082 24.8396 22.6468 26.1019 22.6624L26.1035 22.6628ZM17.5528 24.9615C17.1565 24.577 16.6458 24.3218 16.0921 24.2317C16.8636 24.0255 17.4213 23.629 17.5528 23.0258V24.9615ZM34.0142 19.442C33.2426 19.4232 32.476 19.5668 31.7675 19.8628C31.059 20.1588 30.4256 20.6002 29.911 21.1563L37.6902 20.5684C36.6221 19.8201 35.3327 19.4251 34.0138 19.442H34.0142ZM34.3255 23.726V25.3603H35.9666V26.1214C35.6182 26.2587 35.2423 26.3184 34.8668 26.296C33.521 26.296 32.5837 25.5502 32.5837 24.4714V24.4555C32.5837 23.4242 33.4863 22.6624 34.7337 22.6624C35.4952 22.6639 36.2368 22.8972 36.8534 23.3291L38.6424 21.5996C38.5275 21.5205 38.4125 21.4569 38.2976 21.3774L30.52 21.8534C29.9638 22.3539 29.5799 23.0074 29.4202 23.7256H25.6784V25.36H27.3194V25.9947L38.9557 26.9308V23.7256L34.3255 23.726ZM26.7105 26.7721C26.3687 26.9323 25.9896 27.0034 25.6107 26.9783C25.3017 26.988 24.9939 26.9367 24.706 26.8276C24.4182 26.7185 24.1564 26.5538 23.9366 26.3436L8.67383 24.8523V29.3425H13.9748C15.6489 29.3425 16.7648 28.8189 17.2899 28.0107V29.3425H20.49V26.661C21.2942 28.438 23.2143 29.5328 25.4627 29.5328C26.9985 29.5538 28.4945 29.0605 29.6969 28.1366V27.5659C30.2258 28.1958 30.8977 28.6995 31.6604 29.0379C32.4232 29.3763 33.2564 29.5403 34.0953 29.5172C35.6315 29.538 37.1278 29.0443 38.3303 28.1199V27.7238L26.6939 26.5822L26.7105 26.7721ZM14.4511 26.3276C14.4511 26.7241 14.0901 26.9939 13.4009 26.9939H11.7921V25.6297H13.4005C14.0897 25.6297 14.4345 25.9155 14.4345 26.296V26.3276H14.4511ZM29.3859 20.8382C28.2771 19.9076 26.8493 19.4098 25.3812 19.442C24.4622 19.4135 23.5517 19.6202 22.7419 20.0412C21.9321 20.4622 21.2517 21.0825 20.7695 21.8393L29.075 21.2206L29.3859 20.8382ZM11.7909 21.9798H13.1686C13.6776 21.9798 13.9893 22.1069 14.1204 22.3287L20.4904 21.8534V19.6342H17.3064V21.4729C17.238 21.0927 17.0486 20.7427 16.7648 20.4714C16.2066 19.9318 15.3698 19.6464 14.0405 19.6464H8.67383V22.7579L11.7921 22.5201L11.7909 21.9798Z";

function makeBiggIcon(selected: boolean) {
  const bg = selected ? C.GREEN : "#111111";
  const fg = selected ? "#111111" : C.GREEN;
  return L.divIcon({
    html: `<div style="filter:drop-shadow(0 2px 6px rgba(0,0,0,0.55))">
      <svg width="48" height="53" viewBox="0 0 48 53" fill="none">
        <circle cx="23.79" cy="23.82" r="23.80" fill="${bg}"/>
        <path d="M23.79 52.05L18.25 46.51H29.32L23.79 52.05Z" fill="${bg}"/>
        <path d="${BIGG_LOGO}" fill="${fg}"/>
      </svg>
    </div>`,
    className: "",
    iconSize: [48, 53],
    iconAnchor: [24, 53],
  });
}

function makeVenueIcon(v: Venue, selected: boolean, tierDiscount: number | null) {
  const unlocked = tierDiscount !== null && tierDiscount >= v.baseDiscount;
  const bg = selected ? C.GREEN : unlocked ? C.NEW_GREEN : C.MID;
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${bg};box-shadow:0 1px 4px rgba(0,0,0,0.32);border:2px solid #fff"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

// ─── Map click passthrough ─────────────────────────────────────────────────────

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: onMapClick });
  return null;
}

// Grey Positron tile — replaces dark CartoDB
const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

// ─── Top filter chips — fixed on map (matches MapLocations.js) ────────────────

const CHIPS: { id: MapFilter; label: string; Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }> }[] = [
  { id: "all",          label: "Todos",        Icon: Globe    },
  { id: "sedes",        label: "Sedes",        Icon: MapPin   },
  { id: "beneficios",   label: "Beneficios",   Icon: Tag      },
  { id: "eventos",      label: "Eventos",      Icon: Calendar },
  { id: "experiencias", label: "Experiencias", Icon: Compass  },
];

function MapFilterChips({ active, onChange }: { active: MapFilter; onChange: (f: MapFilter) => void }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 12,
        display: "flex",
        gap: 6,
        zIndex: 1000,
      }}
    >
      {CHIPS.map(({ id, label, Icon }) => {
        const on = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 10px",
              borderRadius: 6,
              background: on ? C.MID : C.BG,
              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Icon size={12} color={on ? C.GREEN : C.NEW_DARK} strokeWidth={2} />
            <span
              style={{
                fontFamily: "MessinaSansWeb:SemiBold, sans-serif",
                fontSize: 11,
                whiteSpace: "nowrap",
                color: on ? C.GREEN : C.NEW_DARK,
                letterSpacing: -0.1,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Location card (matches LocationItem.js) ──────────────────────────────────

function LocationCard({ loc, selected, onSelect }: { loc: BiggLocation; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        backgroundImage: `url(https://picsum.photos/seed/${loc.photoSeed}/600/400)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: C.BG,
        boxShadow: selected
          ? `0 0 0 2.5px ${C.GREEN}, 0 6px 20px rgba(0,0,0,0.15)`
          : "0 4px 12px rgba(0,0,0,0.10)",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {/* Country badge — #D6FF8C like biggapp */}
      <div style={{ position: "absolute", top: 14, left: 14, background: C.NEW_GREEN, borderRadius: 999, padding: "5px 10px" }}>
        <span style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", fontSize: 11, letterSpacing: 0.2, textTransform: "uppercase", color: C.NEW_DARK }}>
          {loc.country}
        </span>
      </div>

      {/* Frosted bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.92)", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: "10px 14px 12px" }}>
        <p style={{ fontFamily: "Druk_Wide:Medium, sans-serif", fontSize: 16, letterSpacing: -0.4, lineHeight: 1.15, color: C.NEW_DARK, margin: 0 }}>{loc.name}</p>
        <p style={{ fontFamily: "MessinaSansWeb:Regular, sans-serif", fontSize: 12, marginTop: 2, color: C.NEW_DARK }}>{loc.address}</p>
        <p style={{ fontFamily: "MessinaSansWeb:Regular, sans-serif", fontSize: 10, marginTop: 1, color: C.MID }}>{loc.city}</p>
      </div>
    </button>
  );
}

// ─── Sedes panel ──────────────────────────────────────────────────────────────

function SedesPanel({ locations, selectedId, onSelect }: { locations: BiggLocation[]; selectedId: string | null; onSelect: (id: string) => void }) {
  const [country, setCountry] = useState("Todos");

  const countries = useMemo(() => {
    const seen = new Set<string>();
    locations.forEach((l) => seen.add(l.country));
    return ["Todos", ...Array.from(seen).sort()];
  }, [locations]);

  const filtered = country === "Todos" ? locations : locations.filter((l) => l.country === country);

  return (
    <>
      {/* Country chips — sticky, non-scrollable */}
      <div style={{ display: "flex", gap: 8, padding: "6px 16px 10px", overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" } as React.CSSProperties}>
        {countries.map((c) => {
          const on = country === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCountry(c)}
              style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 999, background: on ? C.NEW_GREEN : C.WHITE, border: `1px solid ${C.MID}`, cursor: "pointer" }}
            >
              <span style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", fontSize: 11, textTransform: "uppercase", color: C.NEW_DARK, letterSpacing: -0.1, whiteSpace: "nowrap" }}>{c}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable cards */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((loc) => (
          <LocationCard key={loc.id} loc={loc} selected={selectedId === loc.id} onSelect={() => onSelect(selectedId === loc.id ? "" : loc.id)} />
        ))}
      </div>
    </>
  );
}

// ─── Beneficios panel ─────────────────────────────────────────────────────────

function ProgressHeader() {
  const tier = getActiveTier();
  const next = TIERS.find((t) => t.min > CLASSES_THIS_MONTH);
  const pct = Math.min((CLASSES_THIS_MONTH / 12) * 100, 100);

  return (
    <div style={{ padding: "4px 16px 12px", borderBottom: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <p style={{ fontFamily: "Druk_Wide:Medium, sans-serif", fontSize: 16, letterSpacing: -0.4, color: C.NEW_DARK, margin: 0 }}>Club de Beneficios</p>
          <p style={{ fontFamily: "MessinaSansWeb:Regular, sans-serif", fontSize: 11, marginTop: 2, color: C.MID }}>{CLASSES_THIS_MONTH} clases este mes</p>
        </div>
        {tier && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 999, background: C.NEW_GREEN }}>
            <Star size={9} fill={C.NEW_DARK} strokeWidth={0} />
            <span style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", fontSize: 10, color: C.NEW_DARK }}>{tier.label} · {tier.discount}% off</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ width: "100%", height: 5, borderRadius: 9999, background: "rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 9999, background: `linear-gradient(90deg, ${C.GREEN}, #7acc00)` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {TIERS.map((t) => {
              const on = CLASSES_THIS_MONTH >= t.min;
              return (
                <div key={t.min} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: 9999, background: on ? C.GREEN : "#d4d4d4" }} />
                  <span style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", fontSize: 9, color: on ? C.NEW_DARK : C.MID }}>{t.discount}% · {t.min} cl.</span>
                </div>
              );
            })}
          </div>
          {next && <span style={{ fontFamily: "MessinaSansWeb:Regular, sans-serif", fontSize: 9, color: C.MID }}>{next.min - CLASSES_THIS_MONTH} más → {next.discount}%</span>}
        </div>
      </div>
    </div>
  );
}

function VenueCard({ venue, tierDiscount, selected, elRef }: { venue: Venue; tierDiscount: number | null; selected: boolean; elRef?: (el: HTMLDivElement | null) => void }) {
  const unlocked = tierDiscount !== null && tierDiscount >= venue.baseDiscount;
  return (
    <div
      ref={elRef}
      style={{
        flexShrink: 0,
        width: 220,
        borderRadius: 16,
        overflow: "hidden",
        background: C.WHITE,
        border: selected ? `2px solid ${C.GREEN}` : "1px solid rgba(0,0,0,0.08)",
        boxShadow: selected ? `0 0 0 3px rgba(173,255,25,0.2), 0 4px 16px rgba(0,0,0,0.08)` : "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Photo */}
      <div
        style={{
          height: 90,
          flexShrink: 0,
          position: "relative",
          backgroundImage: `url(https://picsum.photos/seed/${venue.photoSeed}/400/220)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: C.BG,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.1)" }} />
        <div style={{ position: "absolute", top: 10, right: 10, padding: "4px 8px", borderRadius: 999, background: unlocked ? C.NEW_GREEN : "rgba(255,255,255,0.82)" }}>
          {unlocked ? (
            <span style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", fontSize: 11, color: C.NEW_DARK }}>{venue.baseDiscount}% off</span>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Lock size={8} strokeWidth={2.5} style={{ color: C.MID }} />
              <span style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", fontSize: 10, color: C.MID }}>{venue.baseDiscount}% off</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "10px 12px 3px" }}>
        <p style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", fontSize: 13, letterSpacing: -0.26, lineHeight: 1.2, color: C.NEW_DARK, margin: 0 }}>{venue.name}</p>
        <p style={{ fontFamily: "MessinaSansWeb:Regular, sans-serif", fontSize: 10, marginTop: 1, color: C.MID }}>{venue.category} · {venue.neighborhood}</p>
      </div>

      {venue.hasSponsoredWorkout && (
        <div style={{ margin: "6px 12px", padding: "7px 10px", borderRadius: 8, background: C.BG, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", fontSize: 9, color: C.NEW_DARK, margin: 0 }}>Workout patrocinado</p>
            <p style={{ fontFamily: "MessinaSansWeb:Regular, sans-serif", fontSize: 9, marginTop: 1, color: C.MID }}>{venue.sponsoredWorkoutName} · +5%</p>
          </div>
          <ChevronRight size={10} strokeWidth={1.5} style={{ color: C.MID }} />
        </div>
      )}

      <div style={{ padding: "6px 12px 12px", marginTop: "auto" }}>
        {unlocked ? (
          <button type="button" style={{ width: "100%", background: "#111", border: "none", borderRadius: 10, padding: "8px 0", cursor: "pointer" }}>
            <span style={{ fontFamily: "MessinaSansWeb:SemiBold, sans-serif", color: "#fff", fontSize: 11 }}>Usar beneficio</span>
          </button>
        ) : (
          <p style={{ fontFamily: "MessinaSansWeb:Regular, sans-serif", fontSize: 9, color: C.MID }}>
            {venue.baseDiscount === 20 ? "Nivel 3 · 12 clases" : venue.baseDiscount === 15 ? "Nivel 2 · 8 clases" : "Nivel 1 · 4 clases"} para desbloquear
          </p>
        )}
      </div>
    </div>
  );
}

function BeneficiosPanel({ selectedId }: { selectedId: string | null }) {
  const tier = getActiveTier();
  const tierDiscount = tier?.discount ?? null;
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedId && refs.current[selectedId]) {
      refs.current[selectedId]!.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedId]);

  const sorted = [...VENUES].sort((a, b) => {
    if (a.id === selectedId) return -1;
    if (b.id === selectedId) return 1;
    const au = tierDiscount !== null && tierDiscount >= a.baseDiscount;
    const bu = tierDiscount !== null && tierDiscount >= b.baseDiscount;
    return Number(bu) - Number(au);
  });

  return (
    <>
      <ProgressHeader />
      {/* Horizontal scroll — this div must have flex-1 height and overflow-x: auto */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          gap: 10,
          padding: "12px 16px",
          alignItems: "flex-start",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}
      >
        {sorted.map((v) => (
          <VenueCard
            key={v.id}
            venue={v}
            tierDiscount={tierDiscount}
            selected={selectedId === v.id}
            elRef={(el) => { refs.current[v.id] = el; }}
          />
        ))}
        <div style={{ flexShrink: 0, width: 1 }} />
      </div>
    </>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

const BA_CENTER: [number, number] = [-34.583, -58.425];
const SHEET_OPEN_H = "50%";
const SHEET_CLOSED_H = "0px"; // fully hidden — map click re-opens

export default function BiggWorldScreen() {
  const [active, setActive] = useState<MapFilter>("sedes");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [biggLocations, setBiggLocations] = useState<BiggLocation[]>(BIGG_LOCATIONS_INITIAL);

  // Ref to avoid stale closures in Leaflet event handlers
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  // Fetch real BIGG sedes from API on mount
  useEffect(() => {
    fetch("https://api.bigg.fit/available_locations", {
      headers: {
        Authorization: `Bearer ${BIGG_API_TOKEN}`,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((data: Array<{
        id: number;
        name: string;
        active: boolean;
        country_name: string;
        slug?: string;
        address?: {
          latitude?: string | null;
          longitude?: string | null;
          address_line_1?: string | null;
          city?: string | null;
          state?: string | null;
        } | null;
      }>) => {
        const mapped: BiggLocation[] = data
          .filter((l) => l.active && l.address?.latitude && l.address?.longitude)
          .map((l) => ({
            id: String(l.id),
            name: l.name,
            country: l.country_name,
            city: [l.address!.city, l.address!.state].find((v) => v && v !== "-") ?? l.country_name,
            address: (l.address!.address_line_1 ?? "").trim(),
            lat: parseFloat(l.address!.latitude!),
            lng: parseFloat(l.address!.longitude!),
            photoSeed: l.slug ?? l.name.toLowerCase().replace(/\s+/g, "-"),
          }));
        setBiggLocations(mapped);
      })
      .catch(() => {/* keep empty — map still works */});
  }, []);

  const isBeneficios = active === "beneficios";
  const showVenues = active === "beneficios" || active === "all";
  const tierDiscount = getActiveTier()?.discount ?? null;

  function switchFilter(f: MapFilter) {
    setActive(f);
    setSelectedId(null);
    setSheetOpen(true);
  }

  function handleMapClick() {
    setSelectedId(null);
    setSheetOpen(false);
  }

  function handlePinClick(id: string) {
    setSelectedId(selectedIdRef.current === id ? null : id);
    setSheetOpen(true);
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>

      {/* ── Map: fills entire container ── */}
      <MapContainer
        center={BA_CENTER}
        zoom={13}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={TILE_URL} />
        <MapClickHandler onMapClick={handleMapClick} />

        {biggLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={makeBiggIcon(selectedId === loc.id)}
            eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); handlePinClick(loc.id); } }}
          />
        ))}

        {showVenues && VENUES.map((v) => (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={makeVenueIcon(v, selectedId === v.id, tierDiscount)}
            eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); handlePinClick(v.id); } }}
          />
        ))}
      </MapContainer>

      {/* ── Filter chips — fixed over map ── */}
      <MapFilterChips active={active} onChange={switchFilter} />

      {/* ── Bottom sheet — overlays the map, collapsible ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: sheetOpen ? SHEET_OPEN_H : SHEET_CLOSED_H,
          transition: "height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          background: C.BG,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.18)",
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Sheet header: drag handle + X close button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 16px 4px", flexShrink: 0, position: "relative" }}>
          <div style={{ width: 36, height: 4, borderRadius: 9999, background: C.MID }} />
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.08)", border: "none", borderRadius: 999, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={13} strokeWidth={2.5} style={{ color: C.NEW_DARK }} />
          </button>
        </div>

        {/* Panel content — takes remaining height and manages its own scroll */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {isBeneficios ? (
            <BeneficiosPanel selectedId={selectedId} />
          ) : (
            <SedesPanel locations={biggLocations} selectedId={selectedId} onSelect={(id) => setSelectedId(id || null)} />
          )}
        </div>
      </div>
    </div>
  );
}
