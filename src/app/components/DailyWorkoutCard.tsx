import { useState } from "react";
import svgPaths from "../../imports/BiggDay/svg-03sgvqmew7";

type TabId = "bigg-class" | "home-gym" | "outdoors";

interface TabData {
  id: TabId;
  label: string;
  title: string;
  chips: string[];
}

const TABS: TabData[] = [
  { id: "bigg-class", label: "BIGG Class", title: "BIGG Class", chips: ["10:00AM", "BIGG Recoleta"] },
  { id: "home-gym", label: "Home/Gym", title: "Home / Gym", chips: ["Flexible", "En casa"] },
  { id: "outdoors", label: "Outdoors", title: "Outdoors", chips: ["07:30AM", "Palermo"] },
];

function BiggClassIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p23dee300} stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HomeGymIcon() {
  return (
    <div className="h-[24.889px] relative shrink-0 w-[24px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 24 24.8889">
        <path d={svgPaths.p1fab3c00} stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function OutdoorsIcon() {
  return (
    <div className="h-[24px] relative shrink-0 w-[23.996px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 23.996 24">
        <path d={svgPaths.pbbc2500} fill="#565656" />
      </svg>
    </div>
  );
}

function TabIcon({ id }: { id: TabId }) {
  if (id === "bigg-class") return <BiggClassIcon />;
  if (id === "home-gym") return <HomeGymIcon />;
  return <OutdoorsIcon />;
}

interface DailyWorkoutCardProps {
  onReservar?: () => void;
}

export default function DailyWorkoutCard({ onReservar }: DailyWorkoutCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("bigg-class");
  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
      {/* Section header */}
      <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] not-italic relative shrink-0 text-[#3d3d3d] w-full whitespace-nowrap">
        <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['MessinaSansWeb:Bold',sans-serif] relative shrink-0 text-[18px] tracking-[-0.45px]">
          Tu BIGG day recomendado
        </p>
        <button
          onClick={onReservar}
          className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['MessinaSansWeb:SemiBold',sans-serif] relative shrink-0 text-[13px] tracking-[-0.325px] underline active:opacity-50 transition-opacity"
        >
          +Reservar Clase
        </button>
      </div>

      {/* Card */}
      <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[20px] shrink-0 w-full">
        {/* Tab selector */}
        <div
          className="backdrop-blur-[50px] content-stretch flex items-center justify-between mb-[-34px] pb-[45px] pt-[15px] px-[20px] relative rounded-[20px] shrink-0 w-full"
          style={{ backgroundImage: "linear-gradient(120.302deg, rgba(255, 255, 255, 0.9) 23.836%, rgba(173, 255, 25, 0.9) 66.816%)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`content-stretch cursor-pointer flex gap-[10px] items-center relative shrink-0 transition-opacity duration-200 ${activeTab === tab.id ? "opacity-100" : "opacity-30"}`}
            >
              <TabIcon id={tab.id} />
              <p
                className={`[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid leading-[1.13] not-italic relative shrink-0 text-[#565656] text-[13px] text-left tracking-[-0.13px] whitespace-nowrap ${
                  activeTab === tab.id
                    ? "font-['MessinaSansWeb:SemiBold',sans-serif] underline"
                    : "font-['MessinaSansWeb:Regular',sans-serif]"
                }`}
              >
                {tab.label}
              </p>
            </button>
          ))}
        </div>

        {/* Content area */}
        <div
          className="backdrop-blur-[50px] content-stretch flex gap-[20px] items-center p-[20px] relative rounded-bl-[20px] rounded-br-[20px] rounded-tl-[8px] rounded-tr-[20px] shrink-0 w-full"
          style={{ backgroundImage: "linear-gradient(115.214deg, rgba(255, 255, 255, 0.9) 51.472%, rgba(163, 163, 163, 0.9) 114.32%)" }}
        >
          {/* Left: title + chips */}
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative">
            <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0">
              <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Druk_Wide:Medium',sans-serif] leading-[27px] not-italic relative shrink-0 text-[26px] text-[#565656] tracking-[-1.3px]">
                {active.title}
              </p>
              <div className="content-stretch flex gap-[15px] items-start relative shrink-0">
                {active.chips.map((chip) => (
                  <div key={chip} className="bg-[#ededed] content-stretch flex items-center justify-center p-[7.5px] relative rounded-[8px] shrink-0">
                    <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[13px] text-black tracking-[-0.325px] whitespace-nowrap">
                      {chip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Reservar button */}
          <div className="flex flex-row items-center self-stretch">
            <button
              onClick={onReservar}
              className="bg-[#deffa3] content-stretch flex flex-col gap-[10px] h-full items-center justify-center px-[18px] py-[17px] relative rounded-[8px] shrink-0 w-[72px] active:opacity-70 transition-opacity"
            >
              <div className="h-[20.833px] relative shrink-0 w-[18.75px]">
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 18.75 20.8333">
                  <path d={svgPaths.p2b363c00} fill="#565656" />
                </svg>
              </div>
              <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[#585858] text-[13px] text-center w-[56.063px]">
                Reservar
              </p>
            </button>
          </div>

          {/* Decorative diamond */}
          <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-[calc(50%-107.58px)] size-[25.165px] top-[calc(50%-55.22px)]">
            <div className="-rotate-45 flex-none">
              <div className="bg-white relative rounded-[2px] size-[17.794px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
