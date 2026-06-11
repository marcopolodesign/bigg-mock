import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Activity, Globe, Users, User, Moon, Plus, Flame, Check } from "lucide-react";
import { Drawer } from "vaul";
import svgPaths from "../../imports/BiggDay/svg-03sgvqmew7";
import imgBgHome1 from "../../imports/BiggDay/ec32944a87885236431eaada4b00483f53237695.png";
import imgRectangle1025 from "../../imports/BiggDay/0259b1772a32f67cb3e03adf89722fe12d0271b1.png";
import imgPerformanceImage from "../../imports/BiggDay/f40c659e63fd5fa932f8372e95797919cca4e6f9.png";
import imgPerformanceImage1 from "../../imports/BiggDay/8cade1b4c1d3008a22f39d72876291dacbe66283.png";
import imgSocialImage from "../../imports/BiggDay/f79f73d2524d1d303262de6cd1d007f6c50f3deb.png";
import imgSocialImage1 from "../../imports/BiggDay/cfc6e06d68482c445e086ebb850b06b6214eec9c.png";
import imgSocialImage2 from "../../imports/BiggDay/36e0f024b8108d431fd8102b4139cb5942baace6.png";
import imgSocialImage3 from "../../imports/BiggDay/b292cbcf40664006c8d7417ba5e7133a81f10f12.png";
import imgSocialImage4 from "../../imports/BiggDay/c7e91abf0983739fe423cb74e6d1c3b8d494aa30.png";
import imgEllipse167 from "../../imports/BiggDay/0bdccca1063fe17c8030deb1278cb4c21c493290.png";
import DailyWorkoutCard, { type ReservedClass, type ActivityEntry } from "../components/DailyWorkoutCard";
import SourceChip from "../components/SourceChip";
import WhyLine from "../components/WhyLine";
import BottomSheet from "../components/BottomSheet";
import ReservarSheet from "../components/ReservarSheet";
import FloatingActionButton from "../components/FloatingActionButton";
import ProgrammingScreen from "../components/ProgrammingScreen";
import ClassDetailScreen from "../components/ClassDetailScreen";

// ─── Today's scheduled activities ────────────────────────────────────────────

const TODAY_ACTIVITIES: ActivityEntry[] = [
  {
    time: "18:00hs",
    timeRange: "18:00hs — 19:00hs",
    title: "Running pasadas",
    gradient: "linear-gradient(115deg, rgba(255,255,255,0.9) 40%, rgba(173,255,25,0.25) 120%)",
    why: "Sumás fondo aeróbico sin chocar con tu clase de fuerza de la mañana",
  },
];

// ─── Past-day data ────────────────────────────────────────────────────────────

interface PastDayData {
  reservedClass?: ReservedClass;
  activities?: ActivityEntry[];
}

const PAST_DAYS: Record<string, PastDayData> = {
  "2026-06-01": {
    reservedClass: {
      time: "8:30AM",
      location: "BIGG Tortuguitas",
      classType: "BIGG Class",
      blocks: ["1. UPPER BODY", "2. STRENGTH", "3. FBA", "4. MIDLINE"],
      attendeeCount: 20,
    },
    activities: [
      {
        time: "12:00hs",
        timeRange: "12:00hs — 13:00hs",
        title: "Padel Game",
        gradient: "linear-gradient(122.85deg, rgba(255,255,255,0.9) 37%, rgba(248,179,46,0.9) 114%)",
      },
      {
        time: "16:30hs",
        timeRange: "16:30hs — 17:15hs",
        title: "Running",
        source: "strava",
        addable: true,
      },
    ],
  },
  "2026-06-02": {
    reservedClass: {
      time: "7:00AM",
      location: "BIGG Palermo",
      classType: "BIGG Class",
      blocks: ["1. CORE", "2. PUSH", "3. CARDIO"],
      attendeeCount: 15,
    },
  },
  "2026-06-03": {
    reservedClass: {
      time: "8:00AM",
      location: "BIGG Palermo",
      classType: "BIGG Class",
      blocks: ["1. LEGS", "2. PULL", "3. ENDURANCE"],
      attendeeCount: 18,
    },
  },
  "2026-06-04": {
    reservedClass: {
      time: "7:30AM",
      location: "BIGG Tortuguitas",
      classType: "BIGG Class",
      blocks: ["1. FULL BODY", "2. STRENGTH", "3. CONDITIONING"],
      attendeeCount: 12,
    },
  },
};

// ─── Padel bloque ─────────────────────────────────────────────────────────────

// ─── Shared Agregar button ────────────────────────────────────────────────────

function AgregarButton() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] relative shrink-0 w-full z-[1]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[10px] items-center justify-center pb-[15px] pt-[45px] px-[10px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[24px]">
            <div className="absolute inset-[8.33%_8.33%_0.78%_8.73%]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9067 21.8139">
                <path d={svgPaths.p3d8e2800} fill="#F8B32E" />
              </svg>
            </div>
          </div>
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['MessinaSansWeb:SemiBold',sans-serif] leading-[1.13] not-italic relative shrink-0 text-[#f8b32e] text-[15px] tracking-[-0.15px] whitespace-nowrap">
            Agregar a mi entrenamiento
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Workout recommendation card (Padel + Lower Body) ─────────────────────────

interface WorkoutCardProps {
  gradient: string;
  title: string;
  badge: string;
  exercises: string[];
  drawerBadge: React.ReactNode;
  drawerBody: React.ReactNode;
}

function WorkoutCard({ gradient, title, badge, exercises, drawerBadge, drawerBody }: WorkoutCardProps) {
  return (
    <Drawer.Root>
      <div className="relative rounded-[20px] shrink-0 w-full">
        <div className="content-stretch flex flex-col isolate items-center overflow-clip relative rounded-[inherit] size-full">
          {/* Main gradient card */}
          <div
            className="content-stretch flex flex-col items-end mb-[-34px] overflow-clip relative rounded-bl-[20px] rounded-br-[20px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full z-[2]"
            style={{ backgroundImage: gradient }}
          >
            <div className="h-[214px] relative shrink-0 w-full">
              <div className="flex flex-col justify-center size-full">
                <div className="content-stretch flex flex-col items-start justify-center pb-[20px] pl-[20px] pt-[10px] relative size-full">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                    {/* Left: title, badge, exercises */}
                    <div className="content-stretch flex flex-col gap-[10px] items-start flex-1 min-w-0">
                      <div className="flex items-center gap-[8px]">
                        <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[22px] tracking-[-1px] whitespace-nowrap">
                          {title}
                        </p>
                        <Drawer.Trigger asChild>
                          <button
                            className="flex items-center justify-center size-[20px] opacity-50 hover:opacity-80 active:opacity-100 transition-opacity shrink-0"
                            aria-label="¿Por qué te recomendamos esto?"
                          >
                            <svg viewBox="0 0 256 256" fill="currentColor" className="size-full text-[#565656]">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
                            </svg>
                          </button>
                        </Drawer.Trigger>
                      </div>
                      <div className="backdrop-blur-[100px] bg-white flex items-center h-[18px] px-[6px] py-[3px] relative rounded-[3px] self-start">
                        <p className="font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[8px] tracking-[-0.08px] uppercase whitespace-nowrap">
                          {badge}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[6px] w-full">
                        {exercises.map((ex, i) => (
                          <p key={i} className="font-['MessinaSansWeb:Regular',sans-serif] leading-[133.75%] not-italic relative shrink-0 text-[#565656] text-[13px]">
                            {ex}
                          </p>
                        ))}
                      </div>
                    </div>
                    {/* Right: clock SVG */}
                    <div className="content-stretch flex flex-col items-end relative shrink-0 w-[50px]">
                      <div className="h-[67px] relative shrink-0 w-[38px]">
                        <div className="absolute inset-[0_-10.53%_-11.94%_-10.53%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 75">
                            <path d={svgPaths.p3b47a200} fill="white" shapeRendering="crispEdges" />
                            <path d={svgPaths.pc724800} fill="black" />
                            <path d={svgPaths.p74cea80} fill="black" />
                            <path d={svgPaths.p1591d500} fill="black" />
                            <path d={svgPaths.p25011980} fill="black" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AgregarButton />
        </div>
      </div>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col rounded-t-[24px] bg-white outline-none">
          <div className="flex justify-center pt-[14px] pb-[6px]">
            <div className="w-[40px] h-[4px] rounded-full bg-[#d4d4d4]" />
          </div>
          <div className="flex flex-col gap-[20px] px-[24px] pt-[12px] pb-[48px]">
            <Drawer.Title className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[20px] tracking-[-0.5px] leading-[1.2]">
              ¿Por qué te recomendamos esto?
            </Drawer.Title>
            {drawerBadge}
            <div className="font-['MessinaSansWeb:Regular',sans-serif] text-[#565656] text-[15px] leading-[1.55] tracking-[-0.3px]">
              {drawerBody}
            </div>
            <Drawer.Close asChild>
              <button className="w-full bg-[#3d3d3d] text-white font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] tracking-[-0.3px] py-[15px] rounded-[14px]">
                Entendido
              </button>
            </Drawer.Close>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// ─── Recommendation cards ─────────────────────────────────────────────────────

function SleepCard() {
  const sleepData = [7.5, 6.5, 8, 7, 8, 7, 6];
  const sleepDays = ["L", "M", "M", "J", "V", "S", "D"];
  const sleepMax = 9;
  const maxBarH = 62;

  return (
    <div className="relative rounded-[20px] shrink-0 w-full">
      <div
        className="overflow-clip relative rounded-[20px] w-full"
        style={{ background: "linear-gradient(70deg, #1a2040 2%, #2e1e6e 74%)" }}
      >
        <div className="flex flex-col h-[260px] p-[15px]">
          {/* Top row: labels + big number */}
          <div className="flex items-start justify-between shrink-0">
            <div className="flex flex-col gap-[4px]">
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[rgba(255,255,255,0.5)] text-[8px] tracking-[-0.08px] uppercase whitespace-nowrap">
                SUEÑO ANOCHE
              </p>
              <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[rgba(255,255,255,0.5)] text-[8px] tracking-[-0.08px] uppercase whitespace-nowrap">
                OBJETIVO: 8 HORAS
              </p>
            </div>
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-white text-[40px] leading-[1] tracking-[-2px] shrink-0">
              6h
            </p>
          </div>
          {/* Full-width bar chart */}
          <div className="flex items-end flex-1 pb-[6px] pt-[8px]">
            <div className="flex items-end w-full" style={{ gap: '4px' }}>
              {sleepData.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-[4px] flex-1">
                  <div
                    className="w-full rounded-[4px]"
                    style={{
                      height: `${(v / sleepMax) * maxBarH}px`,
                      background: i === sleepData.length - 1 ? '#7b9de8' : 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[rgba(255,255,255,0.3)] text-[7px]">
                    {sleepDays[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Recommendation */}
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[rgba(255,255,255,0.55)] text-[11px] leading-[1.4] tracking-[-0.22px] shrink-0">
            Dormite temprano hoy para alcanzar tu objetivo mañana
          </p>
          <div className="shrink-0 mt-[8px]">
            <SourceChip source="apple-health" prefix="Datos de" onDark />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepsCard() {
  const current = 3200;
  const goal = 10000;
  const pct = Math.min((current / goal) * 100, 100);

  return (
    <div className="relative rounded-[20px] shrink-0 w-full">
      <div
        className="overflow-clip relative rounded-[20px] w-full"
        style={{ backgroundImage: "linear-gradient(70.32deg, rgb(237, 237, 237) 1.58%, rgb(222, 255, 163) 73.75%)" }}
      >
        <div className="flex flex-col h-[260px] p-[15px] gap-[10px]">
          {/* Label */}
          <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#585858] text-[8px] tracking-[-0.08px] uppercase whitespace-nowrap shrink-0">
            PASOS DE HOY
          </p>

          {/* Big count */}
          <div className="flex items-baseline gap-[6px] flex-1">
            <p className="font-['Druk_Wide:Medium',sans-serif] text-[#3d3d3d] text-[48px] leading-[1] tracking-[-2px]">
              3.200
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[18px] leading-[1] tracking-[-0.5px]">
              / 10.000
            </p>
          </div>

          {/* Progress bar */}
          <div className="shrink-0 flex flex-col gap-[6px]">
            <div className="w-full h-[8px] rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: '#3d6b00' }}
              />
            </div>
            <div className="flex justify-between">
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[9px]">0</p>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[9px]">10.000</p>
            </div>
          </div>

          {/* Recommendation */}
          <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[11px] leading-[1.4] tracking-[-0.22px] shrink-0">
            Caminá 6.800 pasos más para alcanzar tu objetivo diario
          </p>
          <SourceChip source="garmin" prefix="Datos de" />
        </div>
      </div>
    </div>
  );
}

// ─── Recommendations carousel ─────────────────────────────────────────────────

const RECOMMENDATION_ITEMS = [
  {
    subtitle: "Llegá mejor preparado a la cancha",
    card: (
      <WorkoutCard
        gradient="linear-gradient(165.134deg, rgb(255, 255, 255) 20.391%, rgb(248, 179, 46) 105.1%)"
        title="Padel"
        badge="COMPLETE IN 15' : UPPER BODY"
        exercises={["20'' Pivot + Backhand", "20'' Banded Heidens", "20'' Skipping In & Out of a Bumper"]}
        drawerBadge={
          <div className="flex items-center gap-[10px]">
            <div className="bg-[rgba(248,179,46,0.15)] px-[12px] py-[6px] rounded-full flex items-center gap-[6px]">
              <div className="size-[7px] rounded-full bg-[#f8b32e]" />
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#b07c00] text-[13px] tracking-[-0.3px]">Padel</p>
            </div>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#a3a3a3] text-[13px] tracking-[-0.26px]">actividad cargada recientemente</p>
          </div>
        }
        drawerBody={<>Cargaste una actividad de{" "}<span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#3d3d3d]">Padel</span>, así que armamos este bloque de movilidad y técnica específico para que llegués mejor preparado a la cancha y reduzcas el riesgo de lesiones.</>}
      />
    ),
  },
  { subtitle: "Dormiste menos de lo ideal", card: <SleepCard /> },
  { subtitle: "Movete más durante el día", card: <StepsCard /> },
  {
    subtitle: "Balanceá tu entrenamiento",
    card: (
      <WorkoutCard
        gradient="linear-gradient(165.134deg, rgb(255, 255, 255) 20.391%, rgb(194, 194, 194) 105.1%)"
        title="Lower Body"
        badge="COMPLETE IN 15' : LOWER BODY"
        exercises={["20'' Sentadillas con Pausa", "20'' Romanian Deadlift", "20'' Hip Thrust"]}
        drawerBadge={
          <div className="flex items-center gap-[10px]">
            <div className="bg-[rgba(163,163,163,0.15)] px-[12px] py-[6px] rounded-full flex items-center gap-[6px]">
              <div className="size-[7px] rounded-full bg-[#a3a3a3]" />
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#666666] text-[13px] tracking-[-0.3px]">Upper Body × 3</p>
            </div>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#a3a3a3] text-[13px] tracking-[-0.26px]">entrenamientos esta semana</p>
          </div>
        }
        drawerBody={<>Realizaste 3 sesiones de{" "}<span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#3d3d3d]">Upper Body</span>{" "}esta semana — equilibrá con Lower Body para evitar desbalances musculares y fortalecer el tren inferior.</>}
      />
    ),
  },
];

function RecommendationsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const containerLeft = el.getBoundingClientRect().left;
    const containerRight = containerLeft + el.clientWidth;
    const children = Array.from(el.children).slice(0, RECOMMENDATION_ITEMS.length) as HTMLElement[];
    let best = 0, bestVis = -1;
    children.forEach((child, i) => {
      const rect = child.getBoundingClientRect();
      const vis = Math.min(rect.right, containerRight) - Math.max(rect.left, containerLeft);
      if (vis > bestVis) { bestVis = vis; best = i; }
    });
    setActiveIndex(best);
  }, []);

  return (
    <div className="flex flex-col gap-[14px] w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-[12px] overflow-x-auto"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {RECOMMENDATION_ITEMS.map(({ subtitle, card }, i) => (
          <div
            key={i}
            className="flex flex-col gap-[8px] shrink-0 flex-[0_0_76%]"
            style={{ scrollSnapAlign: "start" }}
          >
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#565656] text-[13px] tracking-[-0.3px] leading-[1.3]">
              {subtitle}
            </p>
            {card}
          </div>
        ))}
        {/* trailing spacer so last card can snap correctly */}
        <div className="shrink-0 w-[1px]" aria-hidden />
      </div>

      {/* Dot indicator */}
      <div className="flex items-center justify-center gap-[6px]">
        {RECOMMENDATION_ITEMS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === activeIndex ? 16 : 6,
              height: 6,
              background: i === activeIndex ? "#3d3d3d" : "#d4d4d4",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── BIGG MOVE ────────────────────────────────────────────────────────────────

function Group17() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[12.936px]"
      style={{ containerType: "inline-size", aspectRatio: "390 / 160" }}
    >
      <img
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src={imgRectangle1025}
      />
      <div className="absolute inset-0 flex flex-col justify-end gap-[6px] px-[5.4%] pb-[12px]">
        <p
          className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Fixture_Ultra:SemiBold',sans-serif] leading-[1.005] not-italic text-white whitespace-nowrap"
          style={{ fontSize: "clamp(28px, 14.5cqw, 56px)" }}
        >
          BIGG MOVE
        </p>
        <p
          className="[word-break:break-word] font-['MessinaSansWeb:SemiBold',sans-serif] leading-[1.005] not-italic text-white whitespace-nowrap"
          style={{ fontSize: "clamp(11px, 3.44cqw, 14px)" }}
        >
          Movilidad, Prehab y más
        </p>
      </div>
    </div>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

function Group1() {
  return (
    <div className="h-[10px] relative w-[22px]" data-name="Group">
      <div className="absolute inset-[-7.5%_-3.41%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.5 11.5">
          <g id="Group">
            <path d={svgPaths.p8798a00} id="Vector" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3a5e3200} id="Vector_2" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-white h-[56.063px] relative rounded-[20px] shrink-0 w-full">
      <div aria-hidden className="absolute border border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[17px] relative size-full">
          <div className="flex items-center justify-center relative shrink-0 size-[22.627px]">
            <div className="-scale-y-100 flex-none rotate-135">
              <Group1 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-[56.063px]">
      <Frame26 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[#585858] text-[13px] text-center w-full">
        New training
      </p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="bg-white h-[56.063px] relative rounded-[20px] shrink-0 w-full">
      <div aria-hidden className="absolute border border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[17px] relative size-full">
          <div className="relative shrink-0 size-[22px]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22.0002">
              <path d={svgPaths.pa5e26c0} fill="#565656" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-[56.063px]">
      <Frame27 />
      <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#585858] text-[13px] text-center w-full">
        <p className="leading-[1.25] mb-0">Cargar</p>
        <p className="leading-[1.25]">actividad</p>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-white h-[56.063px] relative rounded-[20px] shrink-0 w-full">
      <div aria-hidden className="absolute border border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[17px] relative size-full">
          <div className="h-[22.018px] relative shrink-0 w-[20.5px]" data-name="Vector">
            <div className="absolute inset-[-3.41%_-3.66%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9996 23.5177">
                <path d={svgPaths.p12ef8380} id="Vector" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-[56.063px]">
      <Frame28 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[#585858] text-[13px] text-center w-full">
        Rutina de recover
      </p>
    </div>
  );
}

function Group16() {
  return (
    <div className="h-[4.658px] relative shrink-0 w-[20px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 4.65753">
        <g id="Group 1706">
          <circle cx="2.32877" cy="2.32877" fill="black" id="Ellipse 243" r="2.32877" />
          <circle cx="10" cy="2.32877" fill="black" id="Ellipse 244" r="2.32877" />
          <circle cx="17.6712" cy="2.32877" fill="black" id="Ellipse 245" r="2.32877" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-white h-[56.063px] relative rounded-[20px] shrink-0 w-full">
      <div aria-hidden className="absolute border border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[18px] py-[17px] relative size-full">
          <Group16 />
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-[56.063px]">
      <Frame33 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[#585858] text-[13px] text-center w-full">
        Más opciones
      </p>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[41px] items-center relative shrink-0">
      <Frame32 />
      <Frame30 />
      <Frame31 />
      <Frame29 />
    </div>
  );
}

function Frame41() {
  // TODO: re-enable quick-action grid when ready
  return (
    <div className="hidden backdrop-blur-[2px] bg-white relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[20px] relative size-full">
          <Frame47 />
        </div>
      </div>
    </div>
  );
}

// ─── Activity streak ──────────────────────────────────────────────────────────

// Days the user selected during onboarding (0 = Sunday, 1 = Monday, …, 6 = Saturday)
const ONBOARDING_TRAINING_DAYS: number[] = [1, 2, 3, 4, 5, 6]; // Mon – Sat

const STREAK_RECORD = 9;

type DayKind = "done" | "today-training" | "today-rest" | "scheduled" | "past-rest" | "future-rest";

interface StreakDay {
  letter: string;
  kind: DayKind;
  isTrainingDay: boolean;
}

function localDateStr(d: Date): string {
  // "YYYY-MM-DD" in local timezone — matches PAST_DAYS keys
  return d.toLocaleDateString("sv");
}

function buildWeekStrip(): { days: StreakDay[]; streakCount: number } {
  const now = new Date();
  const todayStr = localDateStr(now);

  // Monday of the current week
  const dow = now.getDay(); // 0 = Sun
  const offsetToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(now);
  monday.setDate(now.getDate() + offsetToMonday);
  monday.setHours(0, 0, 0, 0);

  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  const letters = ["L", "M", "M", "J", "V", "S", "D"];
  const days: StreakDay[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = localDateStr(d);
    const isToday = dateStr === todayStr;
    const isPast = d.getTime() < todayMidnight.getTime();
    const dowJs = d.getDay();
    const isTrainingDay = ONBOARDING_TRAINING_DAYS.includes(dowJs);
    const trained = !!PAST_DAYS[dateStr];

    let kind: DayKind;
    if (isToday) {
      kind = isTrainingDay ? "today-training" : "today-rest";
    } else if (isPast) {
      kind = trained ? "done" : "past-rest";
    } else {
      kind = isTrainingDay ? "scheduled" : "future-rest";
    }

    days.push({ letter: letters[i], kind, isTrainingDay });
  }

  // Streak: consecutive trained days going backwards from yesterday;
  // rest days (not a training day) don't break the streak.
  let streakCount = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const { kind, isTrainingDay: itd } = days[i];
    if (kind === "today-training" || kind === "today-rest" || kind === "scheduled" || kind === "future-rest") continue;
    if (kind === "done") { streakCount++; continue; }
    if (kind === "past-rest" && !itd) continue; // genuine rest day — streak intact
    break; // missed a scheduled training day
  }

  return { days, streakCount };
}

function StreakDot({ kind }: { kind: DayKind }) {
  switch (kind) {
    case "done":
      return (
        <div className="flex items-center justify-center size-[28px] rounded-full bg-[#adff19]">
          <Check size={15} strokeWidth={2.5} className="text-[#3d3d3d]" />
        </div>
      );
    case "today-training":
      return <div className="size-[28px] rounded-full border-[2px] border-dashed border-[#3d3d3d]" />;
    case "today-rest":
      return <div className="size-[28px] rounded-full border border-solid border-[#c4c4c4]" />;
    case "scheduled":
      // Onboarding-selected future training day — dashed lime ring
      return <div className="size-[28px] rounded-full" style={{ border: "1.5px dashed rgba(173,255,25,0.75)" }} />;
    case "past-rest":
      return <div className="size-[28px] rounded-full border border-solid border-[#d4d4d4]" />;
    case "future-rest":
    default:
      return <div className="size-[28px] rounded-full border border-solid border-[#ebebeb]" />;
  }
}

function labelColor(kind: DayKind): string {
  if (kind === "done" || kind === "today-training") return "text-[#565656]";
  if (kind === "scheduled") return "text-[#7ab800]";
  return "text-[#a3a3a3]";
}

function connectorColor(left: DayKind, right: DayKind): string {
  if (left === "done" && right === "done") return "#adff19";
  return "#e0e0e0";
}

function ActivityContainer() {
  const { days, streakCount } = buildWeekStrip();
  const todayIsTraining = days.some((d) => d.kind === "today-training");

  const motivational = streakCount > 0
    ? todayIsTraining
      ? `Llevás ${streakCount} días seguidos. Entrená hoy para no cortar la racha.`
      : `Llevás ${streakCount} días seguidos. Hoy es día de descanso — seguís mañana.`
    : "¡Empezá hoy tu racha de actividad!";

  return (
    <div className="bg-[rgba(255,255,255,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Activity Container">
      <div className="flex flex-col gap-[16px] items-start p-[20px] w-full">

        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[16px] tracking-[-0.48px] whitespace-nowrap">
            Racha de actividad
          </p>
          <p className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[13px] tracking-[-0.39px] whitespace-nowrap">
            + Agregar nueva
          </p>
        </div>

        {/* Big streak count + record */}
        <div className="flex items-end justify-between w-full">
          <div className="flex items-end gap-[10px]">
            <Flame size={30} strokeWidth={2} className="text-[#adff19] fill-[#adff19] shrink-0 mb-[2px]" />
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Druk_Wide:Medium',sans-serif] text-[40px] text-[#3d3d3d] leading-[0.9] tracking-[-2px]">
              {streakCount}
            </p>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#585858] text-[15px] tracking-[-0.3px] pb-[5px]">
              días seguidos
            </p>
          </div>
          <div className="bg-[#ededed] px-[10px] py-[4px] rounded-full shrink-0">
            <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#858585] text-[11px] tracking-[-0.22px] whitespace-nowrap">
              Récord: {STREAK_RECORD} días
            </p>
          </div>
        </div>

        {/* Week strip */}
        <div className="flex items-start w-full">
          {days.map((d, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <div
                  className="flex-1 h-[2px] mt-[13px] rounded-full"
                  style={{ background: connectorColor(days[i - 1].kind, d.kind) }}
                />
              )}
              <div className="flex flex-col items-center gap-[6px] shrink-0 w-[28px]">
                <StreakDot kind={d.kind} />
                <span className={`font-['MessinaSansWeb:Regular',sans-serif] text-[11px] tracking-[-0.22px] ${labelColor(d.kind)}`}>
                  {d.letter}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Motivational why */}
        <WhyLine>{motivational}</WhyLine>

      </div>
    </div>
  );
}

// ─── Membership ───────────────────────────────────────────────────────────────

function MembershipIcon() {
  return (
    <div className="relative shrink-0 size-[31.166px]" data-name="Membership Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.166 31.166">
        <g id="Membership Icon">
          <circle cx="15.583" cy="15.583" fill="#DEFFA3" id="Ellipse 313" r="15.583" />
          <g id="Membership Icon_2">
            <path d={svgPaths.p3eeff480} fill="#3D3D3D" id="Vector" />
            <path d={svgPaths.p3ffd8ec0} fill="#3D3D3D" id="Vector_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function MembershipText() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[3px] items-start leading-[normal] not-italic relative shrink-0 text-[#3d3d3d] w-full" data-name="Membership Text">
      <p className="font-['MessinaSansWeb:Bold',sans-serif] relative shrink-0 text-[16px] tracking-[-0.48px] w-full">Probá nuestra membresía premium</p>
      <p className="font-['MessinaSansWeb:Regular',sans-serif] relative shrink-0 text-[13px] tracking-[-0.39px] w-full">{`La mejor forma de entrenar en BIGG, acompañado diariamente con tu coach. `}</p>
    </div>
  );
}

function MembershipButton() {
  return (
    <div className="bg-[#adff19] content-stretch flex items-center justify-center px-[10px] py-[7.5px] relative rounded-[100px] shrink-0" data-name="Membership Button">
      <p className="[word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3d3d3d] text-[13px] tracking-[-0.39px] whitespace-nowrap">Descubrir BIGG Custom</p>
    </div>
  );
}

function MembershipContent() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[285.771px]" data-name="Membership Content">
      <MembershipText />
      <MembershipButton />
    </div>
  );
}

function MembershipContainer() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Membership Container">
      <div className="content-stretch flex gap-[11px] items-start p-[20px] relative size-full">
        <MembershipIcon />
        <MembershipContent />
      </div>
    </div>
  );
}

// ─── Performance ──────────────────────────────────────────────────────────────

function PerformanceButton() {
  return (
    <div className="content-stretch flex gap-[32.341px] items-center relative shrink-0 w-full" data-name="Performance Button">
      <p className="[word-break:break-word] flex-[1_0_0] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] min-w-px not-italic relative text-[20.582px] text-white tracking-[-0.5146px]">Ver bloques de recover</p>
      <div className="h-[15.049px] relative shrink-0 w-[7.525px]">
        <div className="absolute inset-[-5.7%_-22.79%_-5.7%_-11.4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0974 16.7642">
            <path d={svgPaths.p1f86a5c0} id="Vector 244" stroke="white" strokeWidth="2.42558" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PerformanceImage() {
  return (
    <div className="content-stretch flex flex-col h-[320.177px] items-start justify-between overflow-clip p-[24.256px] relative rounded-[12.936px] shrink-0 w-[292.687px]" data-name="Performance Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12.936px] size-full" src={imgRectangle1025} />
      <div className="h-[41.45px] relative shrink-0 w-[38.592px]" data-name="Vector">
        <div className="absolute inset-[-4.19%_-4.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42.0637 44.9218">
            <path d={svgPaths.p1346d420} id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.47159" />
          </svg>
        </div>
      </div>
      <PerformanceButton />
    </div>
  );
}

function Group2() {
  return (
    <div className="h-[40.736px] relative shrink-0 w-[38.592px]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Group" opacity="0">
          <path d={svgPaths.p50567c0} id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.47667" />
          <path d={svgPaths.pdf48700} id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.47667" />
        </g>
      </svg>
    </div>
  );
}

function PerformanceButton1() {
  return (
    <div className="content-stretch flex gap-[32.341px] items-center opacity-0 relative shrink-0 w-full" data-name="Performance Button">
      <p className="[word-break:break-word] flex-[1_0_0] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] min-w-px not-italic relative text-[20.582px] text-white tracking-[-0.5146px]">Cargá pesos por movimiento</p>
      <div className="h-[15.049px] relative shrink-0 w-[7.525px]">
        <div className="absolute inset-[-5.7%_-22.79%_-5.7%_-11.4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0974 16.7642">
            <path d={svgPaths.p1f86a5c0} id="Vector 244" stroke="white" strokeWidth="2.42558" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PerformanceImage1() {
  return (
    <div className="content-stretch flex flex-col h-[320.177px] items-start justify-between overflow-clip p-[24.256px] relative rounded-[12.936px] shrink-0 w-[292.687px]" data-name="Performance Image">
      <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[12.936px]">
        <div className="absolute bg-white inset-0 rounded-[12.936px]" />
        <img alt="" className="absolute max-w-none object-cover opacity-50 rounded-[12.936px] size-full" src={imgPerformanceImage} />
      </div>
      <Group2 />
      <PerformanceButton1 />
    </div>
  );
}

function O7EeP8Tif() {
  return (
    <div className="h-[30.735px] relative shrink-0 w-[38.592px]" data-name="o7eeP8.tif">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.5921 30.7348">
        <g id="o7eeP8.tif">
          <path d={svgPaths.p1f224d40} fill="#FAFAFA" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function PerformanceButton2() {
  return (
    <div className="content-stretch flex gap-[32.341px] items-center relative shrink-0 w-full" data-name="Performance Button">
      <p className="[word-break:break-word] flex-[1_0_0] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] min-w-px not-italic relative text-[20.582px] text-white tracking-[-0.5146px]">Registrá una actividad</p>
      <div className="h-[15.049px] relative shrink-0 w-[7.525px]">
        <div className="absolute inset-[-5.7%_-22.79%_-5.7%_-11.4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0974 16.7642">
            <path d={svgPaths.p1f86a5c0} id="Vector 244" stroke="white" strokeWidth="2.42558" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PerformanceImage2() {
  return (
    <div className="content-stretch flex flex-col h-[320.177px] items-start justify-between overflow-clip p-[24.256px] relative rounded-[12px] shrink-0 w-[292.687px]" data-name="Performance Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgPerformanceImage1} />
      <O7EeP8Tif />
      <PerformanceButton2 />
    </div>
  );
}

function PerformanceContent() {
  return (
    <div className="content-stretch flex gap-[21.022px] h-[320.177px] items-start relative shrink-0 w-[667.843px]" data-name="Performance Content">
      <PerformanceImage />
      <PerformanceImage1 />
      <PerformanceImage2 />
    </div>
  );
}

function PerformanceContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[393px]" data-name="Performance Container">
      <p className="[word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] h-[19px] leading-[normal] min-w-full not-italic relative shrink-0 text-[#3d3d3d] text-[16px] tracking-[-0.4px] w-[min-content]">Mejorá tu performance</p>
      <PerformanceContent />
    </div>
  );
}

// ─── Referral ─────────────────────────────────────────────────────────────────

function ReferralIcon() {
  return (
    <div className="relative shrink-0 size-[31.166px]" data-name="Referral Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.166 31.166">
        <g id="Referral Icon">
          <circle cx="15.583" cy="15.583" fill="#DEFFA3" id="Ellipse 313" r="15.583" />
          <path d={svgPaths.p352b3e00} fill="#3D3D3D" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ReferralText() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[3px] items-start leading-[normal] not-italic relative shrink-0 text-[#3d3d3d] w-full" data-name="Referral Text">
      <p className="font-['MessinaSansWeb:Bold',sans-serif] relative shrink-0 text-[16px] tracking-[-0.48px] w-full">Programa de referidos</p>
      <p className="font-['MessinaSansWeb:Regular',sans-serif] relative shrink-0 text-[13px] tracking-[-0.39px] w-full">Invitá a un amigo/a a entrenar con vos y ganá premios</p>
    </div>
  );
}

function ReferralButton() {
  return (
    <div className="bg-[#adff19] content-stretch flex items-center justify-center px-[10px] py-[7.5px] relative rounded-[100px] shrink-0" data-name="Referral Button">
      <p className="[word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3d3d3d] text-[13px] tracking-[-0.39px] whitespace-nowrap">Cambiale la vida a un amigo/a</p>
    </div>
  );
}

function ReferralContent() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[285.771px]" data-name="Referral Content">
      <ReferralText />
      <ReferralButton />
    </div>
  );
}

function ReferralContainer() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Referral Container">
      <div className="content-stretch flex gap-[11px] items-start p-[20px] relative size-full">
        <ReferralIcon />
        <ReferralContent />
      </div>
    </div>
  );
}

// ─── Social ───────────────────────────────────────────────────────────────────

function SocialContent2() {
  return (
    <div className="absolute h-[266.153px] left-[-17.08px] top-[-43.1px] w-[344.653px]" data-name="Social Content">
      <div className="absolute inset-[-30.06%_-23.21%_-30.06%_-8.7%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 454.653 426.153">
          <g id="Social Content">
            <g filter="url(#filter0_f_1_458)" id="Ellipse 292" opacity="0.35">
              <circle cx="92.7102" cy="149.667" fill="#ADFF19" r="62.7102" />
            </g>
            <g filter="url(#filter1_f_1_458)" id="Ellipse 287">
              <circle cx="241.576" cy="213.076" fill="#DEFFA3" r="133.076" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="185.42" id="filter0_f_1_458" width="185.42" x="0" y="56.9565">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_458" stdDeviation="15" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="426.153" id="filter1_f_1_458" width="426.153" x="28.5" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_458" stdDeviation="40" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function SocialImages() {
  return (
    <div className="absolute contents left-px top-[-0.12px]" data-name="Social Images">
      <div className="absolute h-[48.566px] left-[98.5px] rounded-[2px] top-[35.94px] w-[86.906px]" data-name="Social Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[2px] size-full" src={imgSocialImage} />
      </div>
      <div className="absolute flex h-[78.039px] items-center justify-center left-[204.59px] top-[-0.12px] w-[86.906px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[78.039px] relative rounded-[2px] w-[86.906px]" data-name="Social Image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[2px] size-full" src={imgSocialImage1} />
          </div>
        </div>
      </div>
      <div className="absolute h-[53.375px] left-px rounded-[2px] top-[-0.12px] w-[89.266px]" data-name="Social Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[2px] size-full" src={imgSocialImage2} />
      </div>
      <div className="absolute flex h-[53.375px] items-center justify-center left-[299.73px] top-[-0.12px] w-[89.266px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[53.375px] relative rounded-[2px] w-[89.266px]" data-name="Social Image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[2px] size-full" src={imgSocialImage2} />
          </div>
        </div>
      </div>
      <div className="absolute h-[82.727px] left-px rounded-[2px] top-[63.7px] w-[89.266px]" data-name="Social Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[2px] size-full" src={imgSocialImage3} />
      </div>
      <div className="absolute flex h-[118.211px] items-center justify-center left-[299.73px] top-[63.7px] w-[89.266px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[118.211px] relative rounded-[2px] w-[89.266px]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2px]">
              <img alt="" className="absolute h-[129.35%] left-[-81.87%] max-w-none top-[-29.35%] w-[263.74%]" src={imgSocialImage4} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[30.172px] left-[98.5px] rounded-[2px] top-[-0.12px] w-[86.906px]" data-name="Social Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[2px] size-full" src={imgSocialImage4} />
      </div>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute inset-[40.25%_42.56%_38.51%_43.08%] opacity-90" data-name="Mask Group 60">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55.8602 55.4257">
        <g id="Mask Group 60">
          <path d={svgPaths.p2e93ecf0} fill="black" id="Instagram_IconOnly_White" />
        </g>
      </svg>
    </div>
  );
}

function SocialDetails() {
  return (
    <div className="absolute contents inset-[40.25%_9.41%_7.43%_9.93%]" data-name="Social Details">
      <p className="[word-break:break-word] absolute font-['MessinaSansWeb:Regular',sans-serif] inset-[79.33%_9.41%_15.69%_9.93%] leading-[1.055] not-italic opacity-90 text-[12px] text-black text-center">Compartí el hashtag y sumate a nuestra comunidad</p>
      <p className="[word-break:break-word] absolute font-['MessinaSansWeb:SemiBold',sans-serif] inset-[87.59%_31.62%_7.43%_32.13%] leading-[1.055] not-italic opacity-90 text-[12px] text-black">#BIGG #BIGGLifeChange</p>
      <MaskGroup />
      <p className="[word-break:break-word] absolute font-['Druk_Wide:Medium',sans-serif] inset-[66%_25.06%_27.1%_25.58%] leading-[normal] not-italic opacity-90 text-[18px] text-black text-center uppercase">@BIGG.fit</p>
    </div>
  );
}

function SocialContent1() {
  return (
    <div className="absolute contents left-[-17.08px] top-[-43.1px]" data-name="Social Content">
      <div className="absolute bg-[rgba(255,255,255,0.5)] h-[260.938px] left-[2px] rounded-[8px] top-[-0.12px] w-[387px]" data-name="Social Background" />
      <SocialContent2 />
      <SocialImages />
      <SocialDetails />
    </div>
  );
}

function SocialContainer() {
  return (
    <div className="h-[261px] overflow-clip relative rounded-[8px] shrink-0 w-[389px]" data-name="Social Container">
      <div className="absolute contents left-[-17.08px] top-[-43.1px]">
        <SocialContent1 />
      </div>
    </div>
  );
}

// ─── Main scroll content ───────────────────────────────────────────────────────

function MainContent({ onReservar, onOpenFab, onOpenDetail, onOpenProgramming, isToday, isFutureDay, selectedDate, todayReservedClass, cardVariant = 3 }: { onReservar: () => void; onOpenFab: () => void; onOpenDetail: (rc: ReservedClass) => void; onOpenProgramming: () => void; isToday: boolean; isFutureDay: boolean; selectedDate: Date; todayReservedClass: ReservedClass | null; cardVariant?: 1 | 2 | 3 | 4 }) {
  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
  const pastData = isToday ? undefined : PAST_DAYS[dateKey];

  return (
    // pt clears the fixed StickyHeader (greeting + week calendar, no status bar)
    <div className="flex flex-col gap-[16px] items-center w-full px-[20px] pt-[153px]">

      {/* ── Timeline ── */}
      <div className="w-full max-w-[388px] mb-[24px]">
        {isToday ? (
          <DailyWorkoutCard
            onReservar={onReservar}
            onOpenFab={onOpenFab}
            onOpenDetail={todayReservedClass ? () => onOpenDetail(todayReservedClass) : undefined}
            onOpenProgramming={todayReservedClass ? undefined : onOpenProgramming}
            reservedClass={todayReservedClass ?? undefined}
            activities={TODAY_ACTIVITIES}
            cardVariant={cardVariant}
          />
        ) : pastData?.reservedClass ? (
          <DailyWorkoutCard
            reservedClass={pastData.reservedClass}
            activities={pastData.activities}
            onOpenFab={onOpenFab}
            onOpenDetail={() => onOpenDetail(pastData.reservedClass!)}
          />
        ) : isFutureDay ? (
          selectedDate.getDay() === 4
            ? <DailyWorkoutCard onOpenFab={onOpenFab} showMorning={false} showAfternoon={true} />
            : <DailyWorkoutCard onReservar={onReservar} onOpenFab={onOpenFab} onOpenProgramming={onOpenProgramming} showMorning={true} showAfternoon={false} />
        ) : (
          <div className="flex flex-col gap-[12px]">
            <div className="bg-[rgba(255,255,255,0.5)] rounded-[8px] p-[20px] flex items-center justify-center min-h-[120px]">
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#a3a3a3] text-[15px] tracking-[-0.3px] text-center">
                Sin actividad registrada
              </p>
            </div>
            <button
              onClick={onOpenFab}
              className="w-full rounded-[16px] border border-dashed border-[#858585] py-[16px] flex items-center justify-center gap-[8px] bg-[#ededed] active:opacity-60 transition-opacity"
            >
              <Plus size={16} strokeWidth={2} className="text-[#858585]" />
              <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#858585] text-[14px] tracking-[-0.28px]">
                Agregar
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Thursday rest-day pill — future days only */}
      {isFutureDay && selectedDate.getDay() === 4 && (
        <div className="w-full max-w-[388px] flex items-center gap-[10px] backdrop-blur-sm bg-[#6ab5ff]/15 border border-[#6ab5ff]/30 rounded-full px-[16px] py-[10px]">
          <Moon size={15} className="text-[#4a90d9] shrink-0" />
          <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#4a6fa5] text-[13px] tracking-[-0.26px]">
            Día de descanso recomendado
          </p>
        </div>
      )}

      {/* ── Today-only: Recommendations carousel ── */}
      {isToday && (
        <>
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic text-[#3d3d3d] text-[18px] tracking-[-0.45px] w-full max-w-[388px]">
            Recomendaciones basadas en tus hábitos
          </p>
          <div className="w-full max-w-[388px]">
            <RecommendationsCarousel />
          </div>
        </>
      )}

      {/* ── Common sections — all days ── */}
      <div className="w-full max-w-[388px]">
        <ActivityContainer />
      </div>
      <div className="w-full max-w-[388px]">
        <Group17 />
      </div>
      <div className="w-full max-w-[388px]">
        <Frame41 />
      </div>
      <div className="w-full max-w-[388px]">
        <MembershipContainer />
      </div>
      {/* TODO: re-enable Mejorá tu performance block */}
      <div className="hidden w-full max-w-[388px]">
        <PerformanceContainer />
      </div>
      <div className="w-full max-w-[388px]">
        <ReferralContainer />
      </div>
    </div>
  );
}

// ─── Fixed header ─────────────────────────────────────────────────────────────

function Frame43() {
  return (
    <div className="relative shrink-0 size-[38px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" height="38" src={imgEllipse167} width="38" />
    </div>
  );
}

function Group4() {
  return (
    <div className="h-[21px] relative w-[33px]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 21">
        <g id="Group">
          <path d={svgPaths.p143b30d0} fill="#565656" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <div className="col-1 flex h-[21px] items-center justify-center ml-0 mt-0 relative row-1 w-[33px]">
        <div className="-scale-y-100 flex-none">
          <Group4 />
        </div>
      </div>
    </div>
  );
}

function Group15() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group3 />
    </div>
  );
}

function Group10() {
  return (
    <div className="h-[24.797px] relative shrink-0 w-[21px]">
      <div className="absolute inset-[-3.02%_-3.61%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5153 26.2967">
          <g id="Group 1225">
            <path d={svgPaths.p17240ac0} id="Vector" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2f2ce080} id="Vector_2" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[23px] items-center relative shrink-0">
      <Group15 />
      <div className="h-[23px] relative shrink-0 w-[26px]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 23">
          <path d={svgPaths.p223df900} fill="#565656" id="Vector" />
        </svg>
      </div>
      <Group10 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="flex items-center justify-between relative shrink-0 w-full">
      <div className="flex items-center gap-[12px]">
        <Frame43 />
        <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">Hola Mateo!</p>
      </div>
      <Frame5 />
    </div>
  );
}

// ─── Calendar week helpers ────────────────────────────────────────────────────

const DAY_ABBRS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function getWeekDays(referenceDay: Date): Date[] {
  if (!referenceDay) return [];
  const dow = referenceDay.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(referenceDay);
  monday.setDate(referenceDay.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function WeekCalendar({
  today,
  selectedDate,
  onSelectDate,
}: {
  today: Date;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
}) {
  const weekDays = getWeekDays(today);
  if (!weekDays.length) return null;

  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      {weekDays.map((day) => {
        const isToday = isSameDay(day, today);
        const isFuture = !isToday && day > today;
        const isSelected = isSameDay(day, selectedDate);

        return (
          <button
            key={day.getTime()}
            onClick={() => onSelectDate(day)}
            className={[
              "content-stretch flex flex-col gap-[5px] items-center justify-center relative shrink-0 transition-opacity cursor-pointer active:opacity-70",
              isFuture && !isSelected ? "opacity-50" : "",
              isSelected
                ? "bg-[#d6ff8c] px-[10px] py-[8px] rounded-[8px] border border-solid border-[#a3a3a3]"
                : "w-[25px]",
            ].join(" ")}
          >
            {/* Activity dots */}
            {isSelected ? (
              <div className="h-[3.232px] w-[1px]" />
            ) : isToday ? (
              <div className="h-[3.232px] relative shrink-0 w-[9.464px]">
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 9.46387 3.23193">
                  <circle cx="1.61597" cy="1.61597" fill="#1EA05A" r="1.61597" />
                  <circle cx="7.8479" cy="1.61597" fill="#F8B32E" r="1.61597" />
                </svg>
              </div>
            ) : (
              <div className="relative shrink-0 size-[3.232px]">
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 3.23193 3.23193">
                  <circle cx="1.61597" cy="1.61597" fill={isFuture ? "#a3a3a3" : "#ADFF19"} r="1.61597" />
                </svg>
              </div>
            )}
            {/* Day abbreviation */}
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[13px] tracking-[-0.325px] whitespace-nowrap">
              {DAY_ABBRS_ES[day.getDay()]}
            </p>
            {/* Day number */}
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">
              {day.getDate()}
            </p>
          </button>
        );
      })}
    </div>
  );
}


function StickyHeader({ today, selectedDate, onSelectDate, scrollY }: { today: Date; selectedDate: Date; onSelectDate: (d: Date) => void; scrollY: number }) {
  const titleRowRef = useRef<HTMLDivElement>(null);
  const [maxCollapse, setMaxCollapse] = useState(62);

  useEffect(() => {
    if (titleRowRef.current) {
      // Collapse greeting row just past the top edge when scrolling.
      const frameHeight = titleRowRef.current.offsetHeight;
      setMaxCollapse(frameHeight + 4);
    }
  }, []);

  const translateY = Math.min(scrollY, maxCollapse);

  return (
    <div
      className="fixed backdrop-blur-[2px] bg-[rgba(255,255,255,0.8)] flex justify-center left-0 pb-[20px] pt-[16px] px-[20px] rounded-bl-[20px] rounded-br-[20px] top-0 w-screen z-40"
      style={{ transform: `translateY(-${translateY}px)` }}
    >
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-bl-[20px] rounded-br-[20px]" />
      <div className="w-full max-w-[388px]">
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          <div ref={titleRowRef} className="w-full">
            <Frame14 />
          </div>
          <WeekCalendar today={today} selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </div>
      </div>
    </div>
  );
}

// ─── Status bar ───────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="fixed top-0 left-0 w-screen h-[40px] z-50 flex items-center justify-between px-[26.88px] bg-white">
      <p className="[word-break:break-word] font-['SF_UI_Text:Bold',sans-serif] leading-[18px] not-italic text-[16px] text-black tracking-[-0.96px]">08:34</p>
      <div className="flex items-center gap-[10px]">
        <p className="[word-break:break-word] font-['SF_Compact_Display:Semibold',sans-serif] leading-[normal] not-italic text-[14.238px] text-black w-[19px]">4G</p>
        <div className="flex gap-[1px]">
          <div className="bg-black rounded-[4px] h-[12px] w-[3.06px]" />
          <div className="bg-black rounded-[4px] h-[14px] w-[3.06px]" />
          <div className="bg-black rounded-[4px] h-[16px] w-[3.06px]" />
          <div className="bg-black opacity-30 rounded-[4px] h-[18px] w-[3.06px]" />
        </div>
        <div className="flex items-center gap-[2px]">
          <div className="border-[0.949px] border-black border-solid rounded-[2.848px] h-[13px] w-[24.16px] relative">
            <div className="bg-black rounded-[2px] absolute left-[1px] top-1/2 -translate-y-1/2 h-[8px] w-[11.597px]" />
          </div>
          <div className="bg-black rounded-[3.797px] h-[6px] w-[1.933px]" />
        </div>
      </div>
    </div>
  );
}

// ─── Community tab content ────────────────────────────────────────────────────

function CommunityTabContent() {
  return (
    <div className="flex flex-col gap-[16px] items-center w-full px-[20px] pt-[100px] pb-[93px]">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic text-[#3d3d3d] text-[18px] tracking-[-0.45px] whitespace-nowrap w-full max-w-[388px]">
        Comunidad BIGG
      </p>
      <div className="w-full max-w-[388px]">
        <SocialContainer />
      </div>
    </div>
  );
}

// ─── Placeholder tab content ──────────────────────────────────────────────────

function PlaceholderTabContent({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full pt-[100px] pb-[93px]">
      <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#a3a3a3] text-[15px] tracking-[-0.3px]">{label}</p>
    </div>
  );
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

type BottomTabId = "activity" | "world" | "community" | "perfil";

const BOTTOM_TABS: { id: BottomTabId; label: string; Icon: React.ElementType }[] = [
  { id: "world",     label: "Opción 3", Icon: Globe },
  { id: "perfil",    label: "Opción 4", Icon: User },
  { id: "activity",  label: "Opción 2", Icon: Activity },
  { id: "community", label: "Comunidad", Icon: Users },
];

function BottomNav({ activeTab, onTabChange }: { activeTab: BottomTabId; onTabChange: (id: BottomTabId) => void }) {
  return (
    <div className="fixed bg-[#ededed] border-[#a3a3a3] border-solid border-t border-b h-[70px] left-0 bottom-0 w-screen z-50 flex justify-center items-start pt-[10px]">
      <div className="flex items-start justify-around w-full max-w-[428px] px-[8px]">
        {BOTTOM_TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-[4px] cursor-pointer flex-1"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2 : 1.5}
                className={isActive ? "text-[#3d3d3d]" : "text-[#a3a3a3]"}
              />
              <p
                className={`font-['MessinaSansWeb:Book',sans-serif] text-[10px] whitespace-nowrap leading-normal ${
                  isActive ? "text-[#3d3d3d] font-['MessinaSansWeb:SemiBold',sans-serif]" : "text-[#a3a3a3]"
                }`}
              >
                {label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Screen root ──────────────────────────────────────────────────────────────

function getInitialTab(): BottomTabId {
  const param = new URLSearchParams(window.location.search).get("tab");
  if (param === "op4") return "perfil";
  if (param === "op2") return "activity";
  if (param === "community") return "community";
  return "world"; // default: op3
}

export default function BiggDayScreen() {
  const [activeTab, setActiveTab] = useState<BottomTabId>(getInitialTab);
  const [reservarOpen, setReservarOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [programmingOpen, setProgrammingOpen] = useState(false);
  const [classDetailOpen, setClassDetailOpen] = useState(false);
  const [detailClass, setDetailClass] = useState<ReservedClass | null>(null);
  const [todayReservedClass, setTodayReservedClass] = useState<ReservedClass | null>(null);
  const [headerScrollY, setHeaderScrollY] = useState(0);
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(today);
  const isToday = isSameDay(selectedDate, today);
  const isFutureDay = !isToday && selectedDate > today;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when switching away from train tab
  useEffect(() => {
    if (activeTab !== "world") setHeaderScrollY(0);
  }, [activeTab]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (activeTab === "community") return;
    setHeaderScrollY(e.currentTarget.scrollTop);
  }, [activeTab]);

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="bg-[#ededed] relative w-screen h-full overflow-x-hidden overflow-y-auto" data-name="BIGG Day">
      {/* Background image */}
      <div className="absolute h-[780.001px] left-0 top-0 w-full" data-name="bg-home 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover opacity-50 pointer-events-none size-full" src={imgBgHome1} />
      </div>

      {/* Decorative blur circles */}
      <div className="absolute flex items-center justify-center left-[-142.03px] size-[266.832px] top-[-28.13px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="relative size-[266.832px]">
            <div className="absolute inset-[-44.97%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 506.832 506.832">
                <g filter="url(#filter0_f_1_512)" id="Ellipse 290" opacity="0.5">
                  <circle cx="253.416" cy="253.416" fill="white" r="133.416" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="506.832" id="filter0_f_1_512" width="506.832" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_1_512" stdDeviation="60" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[241.62px] size-[344.529px] top-[405.37px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="relative size-[344.529px]">
            <div className="absolute inset-[-34.83%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 584.529 584.529">
                <g filter="url(#filter0_f_1_566)" id="Ellipse 291" opacity="0.5">
                  <circle cx="292.265" cy="292.265" fill="white" r="172.265" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="584.529" id="filter0_f_1_566" width="584.529" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_1_566" stdDeviation="60" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tab content */}
      {(activeTab === "activity" || activeTab === "world" || activeTab === "perfil") && (
        <div className="pb-[93px]">
          <MainContent
            onReservar={() => setReservarOpen(true)}
            onOpenFab={() => setFabOpen(true)}
            onOpenDetail={(rc) => { setDetailClass(rc); setClassDetailOpen(true); }}
            onOpenProgramming={() => setProgrammingOpen(true)}
            isToday={isToday}
            isFutureDay={isFutureDay}
            selectedDate={selectedDate}
            todayReservedClass={todayReservedClass}
            cardVariant={activeTab === "activity" ? 2 : activeTab === "world" ? 3 : 4}
          />
        </div>
      )}
      {activeTab === "community" && <CommunityTabContent />}

      {/* Fixed overlays */}
      {(activeTab === "activity" || activeTab === "world" || activeTab === "perfil") && <StickyHeader today={today} selectedDate={selectedDate} onSelectDate={setSelectedDate} scrollY={headerScrollY} />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <FloatingActionButton open={fabOpen} onOpenChange={setFabOpen} onVerProgramacion={() => setProgrammingOpen(true)} />

      {/* Reservar sheet — triggered by BIGG Class Reservar button */}
      <BottomSheet
        open={reservarOpen}
        onClose={() => setReservarOpen(false)}
        title="Reservar clase"
      >
        <ReservarSheet
          onConfirm={() => {
            setTodayReservedClass({
              time: "10:00AM",
              location: "BIGG Recoleta",
              classType: "BIGG Class",
              blocks: ["1. UPPER BODY", "2. STRENGTH", "3. FBA", "4. MIDLINE"],
              attendeeCount: 26,
            });
            setReservarOpen(false);
          }}
        />
      </BottomSheet>

      {/* Programación screen — triggered by FAB "Ver programación" or unreserved workout card */}
      <AnimatePresence>
        {programmingOpen && (
          <ProgrammingScreen
            onBack={() => setProgrammingOpen(false)}
            onReservar={() => { setProgrammingOpen(false); setReservarOpen(true); }}
          />
        )}
      </AnimatePresence>

      {/* Class detail screen — triggered by tapping a ReservedClassCard */}
      <AnimatePresence>
        {classDetailOpen && detailClass && (
          <ClassDetailScreen
            reservedClass={detailClass}
            onBack={() => setClassDetailOpen(false)}
            onOpenProgramming={() => { setClassDetailOpen(false); setProgrammingOpen(true); }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
