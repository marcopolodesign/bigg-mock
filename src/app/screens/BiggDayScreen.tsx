import React, { useState } from "react";
import { Dumbbell, Activity, Globe, Users, User } from "lucide-react";
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
import DailyWorkoutCard from "../components/DailyWorkoutCard";
import BottomSheet from "../components/BottomSheet";
import ReservarSheet from "../components/ReservarSheet";

// ─── Padel bloque ─────────────────────────────────────────────────────────────

function Frame6() {
  return (
    <div className="backdrop-blur-[100px] bg-white content-stretch flex h-[20.203px] items-center justify-center px-[2px] py-[4px] relative rounded-[2.377px] shrink-0 w-[164px]">
      <p className="[word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[9.507px] tracking-[-0.0951px] uppercase whitespace-nowrap">
        COMPLETE IN 15' : UPPER BODY
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0">
      <p className="[word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[133.75%] not-italic relative shrink-0 text-[#565656] text-[16px] whitespace-nowrap">
        20'' Pivot + Backhand
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0">
      <p className="[word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[133.75%] not-italic relative shrink-0 text-[#565656] text-[16px] whitespace-nowrap">
        20'' Banded Heidens
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0">
      <p className="[word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[133.75%] not-italic relative shrink-0 text-[#565656] text-[16px] whitespace-nowrap">{`20'' Skipping In & Out of a Bumper`}</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[7.5px] items-start relative shrink-0 w-[223px]">
      <Frame1 />
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[12px] items-start ml-0 mt-0 relative row-1 w-[254px]">
      <div className="flex items-center gap-[8px]">
        <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Druk_Wide:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[28px] tracking-[-1.4px] whitespace-nowrap">
          Padel
        </p>
        <Drawer.Trigger asChild>
          <button
            className="flex items-center justify-center size-[22px] opacity-50 hover:opacity-80 active:opacity-100 transition-opacity"
            aria-label="¿Por qué te recomendamos esto?"
          >
            <svg viewBox="0 0 256 256" fill="currentColor" className="size-full text-[#565656]">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
            </svg>
          </button>
        </Drawer.Trigger>
      </div>
      <Frame6 />
      <Frame4 />
    </div>
  );
}

function Group20() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame7 />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[67px] relative shrink-0 w-[38px]">
      <div className="absolute inset-[0_-10.53%_-11.94%_-10.53%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 75">
          <g filter="url(#filter0_d_1_526)" id="Frame 1773">
            <path d={svgPaths.p3b47a200} fill="white" shapeRendering="crispEdges" />
            <g id="Group">
              <path d={svgPaths.pc724800} fill="black" id="Vector" />
              <path d={svgPaths.p74cea80} fill="black" id="Vector_2" />
            </g>
            <g id="6â">
              <path d={svgPaths.p1591d500} fill="black" />
              <path d={svgPaths.p25011980} fill="black" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="75" id="filter0_d_1_526" width="46" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_526" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_526" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0">
      <Frame />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-[88.718px]">
      <Frame9 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Group20 />
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="h-[214px] relative shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pb-[20px] pl-[20px] pt-[10px] relative size-full">
          <Frame11 />
        </div>
      </div>
    </div>
  );
}

function NewBloque() {
  return (
    <div
      className="content-stretch flex flex-col items-end mb-[-34px] overflow-clip relative rounded-bl-[20px] rounded-br-[20px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full z-[2]"
      style={{ backgroundImage: "linear-gradient(165.134deg, rgb(255, 255, 255) 20.391%, rgb(248, 179, 46) 105.1%)" }}
      data-name="New Bloque"
    >
      <Frame12 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.33%_8.33%_0.78%_8.73%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9067 21.8139">
        <g id="Group">
          <g id="Vector" />
          <path d={svgPaths.p3d8e2800} fill="#F8B32E" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function MingcuteAiLine3() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="mingcute:ai-line">
      <Group />
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] relative shrink-0 w-full z-[1]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[10px] items-center justify-center pb-[15px] pt-[45px] px-[10px] relative size-full">
          <MingcuteAiLine3 />
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:SemiBold',sans-serif] leading-[1.13] not-italic relative shrink-0 text-[#f8b32e] text-[15px] tracking-[-0.15px] whitespace-nowrap">
            Agregar a mi entrenamiento
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <Drawer.Root>
      <div className="relative rounded-[20px] shrink-0 w-full">
        <div className="content-stretch flex flex-col isolate items-center overflow-clip relative rounded-[inherit] size-full">
          <NewBloque />
          <Frame35 />
        </div>
        <div aria-hidden className="absolute border border-[#a3a3a3] border-dashed inset-0 pointer-events-none rounded-[20px]" />
      </div>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col rounded-t-[24px] bg-white outline-none">
          {/* Handle */}
          <div className="flex justify-center pt-[14px] pb-[6px]">
            <div className="w-[40px] h-[4px] rounded-full bg-[#d4d4d4]" />
          </div>
          {/* Body */}
          <div className="flex flex-col gap-[20px] px-[24px] pt-[12px] pb-[48px]">
            <Drawer.Title className="font-['MessinaSansWeb:Bold',sans-serif] text-[#3d3d3d] text-[20px] tracking-[-0.5px] leading-[1.2]">
              ¿Por qué te recomendamos esto?
            </Drawer.Title>
            {/* Activity badge */}
            <div className="flex items-center gap-[10px]">
              <div className="bg-[rgba(248,179,46,0.15)] px-[12px] py-[6px] rounded-full flex items-center gap-[6px]">
                <div className="size-[7px] rounded-full bg-[#f8b32e]" />
                <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#b07c00] text-[13px] tracking-[-0.3px]">
                  Padel
                </p>
              </div>
              <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#a3a3a3] text-[13px] tracking-[-0.26px]">
                actividad cargada recientemente
              </p>
            </div>
            <p className="font-['MessinaSansWeb:Regular',sans-serif] text-[#565656] text-[15px] leading-[1.55] tracking-[-0.3px]">
              Cargaste una actividad de{" "}
              <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[#3d3d3d]">Padel</span>,
              así que armamos este bloque de movilidad y técnica específico para que llegués mejor preparado a la cancha y reduzcas el riesgo de lesiones.
            </p>
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

// ─── BIGG MOVE ────────────────────────────────────────────────────────────────

function Group17() {
  return (
    <div className="relative w-full overflow-hidden rounded-[12.936px]" style={{ containerType: "inline-size" }}>
      <img alt="" className="block w-full h-auto object-cover pointer-events-none rounded-[12.936px]" src={imgRectangle1025} />
      <p
        className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] absolute font-['Fixture_Ultra:SemiBold',sans-serif] leading-[1.005] not-italic text-white whitespace-nowrap"
        style={{ left: "5.4%", top: "47%", fontSize: "clamp(32px, 30.1cqw, 120px)" }}
      >
        BIGG MOVE
      </p>
      <p
        className="[word-break:break-word] absolute font-['MessinaSansWeb:SemiBold',sans-serif] leading-[1.005] not-italic text-white whitespace-nowrap"
        style={{ left: "6.6%", top: "83.4%", fontSize: "clamp(8px, 3.44cqw, 14px)" }}
      >
        Movilidad, Prehab y más
      </p>
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
  return (
    <div className="backdrop-blur-[2px] bg-white relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[20px] relative size-full">
          <Frame47 />
        </div>
      </div>
    </div>
  );
}

// ─── Activity ─────────────────────────────────────────────────────────────────

function ActivityHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['MessinaSansWeb:Bold',sans-serif] items-center justify-between leading-[normal] not-italic relative shrink-0 text-[#3d3d3d] w-full whitespace-nowrap" data-name="Activity Header">
      <p className="relative shrink-0 text-[16px] tracking-[-0.48px]">Strike de actividad</p>
      <p className="relative shrink-0 text-[13px] tracking-[-0.39px]">+ Agregar nueva</p>
    </div>
  );
}

function Ellipse() {
  return (
    <div className="col-1 h-[29.771px] ml-0 mt-0 relative row-1 w-[30.399px]">
      <div className="absolute inset-[-1.8%_-1.76%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.4722 30.8436">
          <g id="Ellipse 87">
            <path d={svgPaths.p8517600} id="Vector" stroke="#858585" strokeWidth="1.07282" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ActivityIcon() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-[0.6px] place-items-start relative row-1" data-name="Activity Icon">
      <Ellipse />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] col-1 font-['Messina_Sans_Trial:Regular',sans-serif] leading-[normal] ml-[12.2px] mt-[11.89px] not-italic relative row-1 text-[#858585] text-[8.583px] whitespace-nowrap">L</p>
    </div>
  );
}

function Ellipse1() {
  return (
    <div className="col-1 h-[30.962px] ml-0 mt-0 relative row-1 w-[31.615px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.6154 30.9616">
        <g id="Ellipse 87">
          <path d={svgPaths.p30144d00} id="Vector" stroke="#858585" strokeWidth="1.07282" />
        </g>
      </svg>
    </div>
  );
}

function ActivityIcon1() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[51.78px] mt-0 place-items-start relative row-1" data-name="Activity Icon">
      <Ellipse1 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] col-1 font-['Messina_Sans_Trial:Regular',sans-serif] leading-[normal] ml-[11.81px] mt-[12.48px] not-italic relative row-1 text-[#858585] text-[8.583px] whitespace-nowrap">M</p>
    </div>
  );
}

function Ellipse2() {
  return (
    <div className="col-1 h-[29.771px] ml-0 mt-0 relative row-1 w-[30.399px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.3994 29.7707">
        <g id="Ellipse 87">
          <path d={svgPaths.p3b6698b0} fill="#ADFF19" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ActivityIcon2() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[157.15px] mt-[0.6px] place-items-start relative row-1" data-name="Activity Icon">
      <Ellipse2 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] col-1 font-['Messina_Sans_Trial:Bold',sans-serif] leading-[normal] ml-[12.7px] mt-[11.89px] not-italic relative row-1 text-[#565656] text-[8.583px] whitespace-nowrap">J</p>
    </div>
  );
}

function Ellipse3() {
  return (
    <div className="col-1 h-[29.771px] ml-0 mt-0 relative row-1 w-[30.399px]">
      <div className="absolute inset-[-1.8%_-1.76%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.4722 30.8436">
          <g id="Ellipse 87">
            <path d={svgPaths.p3b54ae70} id="Vector" stroke="#858585" strokeWidth="1.07282" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ActivityIcon3() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[314.31px] mt-[0.6px] place-items-start relative row-1" data-name="Activity Icon">
      <Ellipse3 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] col-1 font-['Messina_Sans_Trial:Regular',sans-serif] leading-[normal] ml-[11.7px] mt-[11.89px] not-italic relative row-1 text-[#858585] text-[8.583px] whitespace-nowrap">D</p>
    </div>
  );
}

function Ellipse6() {
  return (
    <div className="col-1 h-[29.771px] ml-0 mt-0 relative row-1 w-[30.399px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.3994 29.7707">
        <g id="Ellipse 124">
          <path d={svgPaths.p3b6698b0} fill="#ADFF19" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ActivityIcon4() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[261.92px] mt-[0.6px] place-items-start relative row-1" data-name="Activity Icon">
      <Ellipse6 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] col-1 font-['Messina_Sans_Trial:Bold',sans-serif] leading-[normal] ml-[12.2px] mt-[11.89px] not-italic relative row-1 text-[#565656] text-[8.583px] whitespace-nowrap">S</p>
    </div>
  );
}

function Ellipse5() {
  return (
    <div className="col-1 h-[29.771px] ml-0 mt-0 relative row-1 w-[30.399px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.3994 29.7707">
        <g id="Ellipse 123">
          <path d={svgPaths.p3b6698b0} fill="#ADFF19" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ActivityIcon5() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[209.54px] mt-[0.6px] place-items-start relative row-1" data-name="Activity Icon">
      <Ellipse5 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] col-1 font-['Messina_Sans_Trial:Bold',sans-serif] leading-[normal] ml-[12.2px] mt-[11.89px] not-italic relative row-1 text-[#565656] text-[8.583px] whitespace-nowrap">V</p>
    </div>
  );
}

function RepeatGrid() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Repeat Grid 14">
      <ActivityIcon />
      <ActivityIcon1 />
      <ActivityIcon2 />
      <ActivityIcon3 />
      <ActivityIcon4 />
      <ActivityIcon5 />
    </div>
  );
}

function ActivityGrid() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Activity Grid">
      <RepeatGrid />
    </div>
  );
}

function Ellipse4() {
  return (
    <div className="col-1 h-[29.771px] ml-[104.77px] mt-[0.6px] relative row-1 w-[30.399px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.3994 29.7707">
        <g id="Ellipse 122">
          <path d={svgPaths.p37f55f80} fill="#ADFF19" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ActivityContent() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Activity Content">
      <ActivityGrid />
      <Ellipse4 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] col-1 font-['Messina_Sans_Trial:Regular',sans-serif] leading-[normal] ml-[115.97px] mt-[12.48px] not-italic relative row-1 text-[#565656] text-[8.583px] whitespace-nowrap">M</p>
      <div className="col-1 h-0 ml-[239.33px] mt-[15.48px] relative row-1 w-[22.59px]" data-name="Path 1467">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5902 1">
            <path d="M0 0.5H22.5902" id="Path 1467" stroke="#ADFF19" />
          </svg>
        </div>
      </div>
      <div className="col-1 h-0 ml-[187.33px] mt-[15.48px] relative row-1 w-[22.59px]" data-name="Path 1468">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5902 1">
            <path d="M0 0.5H22.5902" id="Path 1467" stroke="#ADFF19" />
          </svg>
        </div>
      </div>
      <div className="col-1 h-0 ml-[134.33px] mt-[15.48px] relative row-1 w-[22.59px]" data-name="Path 1469">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5902 1">
            <path d="M0 0.5H22.5902" id="Path 1467" stroke="#ADFF19" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ActivityContainer() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Activity Container">
      <div className="content-stretch flex flex-col gap-[20px] items-start p-[20px] relative size-full">
        <ActivityHeader />
        <ActivityContent />
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

function MainContent({ onReservar }: { onReservar: () => void }) {
  return (
    <div className="flex flex-col gap-[16px] items-center w-full px-[20px] pt-[197px]">
      {/* Interactive Daily Workout Card */}
      <div className="w-full max-w-[388px]">
        <DailyWorkoutCard onReservar={onReservar} />
      </div>

      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic text-[#3d3d3d] text-[18px] tracking-[-0.45px] whitespace-nowrap w-full max-w-[388px]">
        Llegá mejor preparado a la cancha
      </p>
      <div className="w-full max-w-[388px]">
        <Frame42 />
      </div>
      <div className="w-full max-w-[388px]">
        <Group17 />
      </div>
      <div className="w-full max-w-[388px]">
        <Frame41 />
      </div>
      <div className="w-full max-w-[388px]">
        <ActivityContainer />
      </div>
      <div className="w-full max-w-[388px]">
        <MembershipContainer />
      </div>
      <div className="w-full max-w-[388px]">
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
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[185.804px]">
      <div className="relative shrink-0 size-[38px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="38" src={imgEllipse167} width="38" />
      </div>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">Hola Mateo!</p>
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
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame43 />
      <Frame5 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="h-[3.232px] relative shrink-0 w-[9.464px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.46387 3.23193">
        <g id="Frame 1171276483">
          <circle cx="1.61597" cy="1.61597" fill="#1EA05A" id="Ellipse 307" r="1.61597" />
          <circle cx="7.8479" cy="1.61597" fill="#F8B32E" id="Ellipse 308" r="1.61597" />
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center justify-center relative shrink-0 w-[25px]">
      <Frame45 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[13px] tracking-[-0.325px] whitespace-nowrap">Lun</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">1</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center justify-center relative shrink-0 w-[25px]">
      <div className="relative shrink-0 size-[3.232px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.23193 3.23193">
          <circle cx="1.61597" cy="1.61597" fill="#A3A3A3" id="Ellipse 307" r="1.61597" />
        </svg>
      </div>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[13px] tracking-[-0.325px] whitespace-nowrap">Mar</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">2</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[#d6ff8c] content-stretch flex flex-col gap-[5px] items-center p-[10px] relative rounded-[8px] shrink-0">
      <div aria-hidden className="absolute border border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[13px] tracking-[-0.325px] whitespace-nowrap">Miércoles</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">3</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[54.443px]">
      <Frame24 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center justify-center relative shrink-0 w-[25px]">
      <div className="relative shrink-0 size-[3.232px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.23193 3.23193">
          <circle cx="1.61597" cy="1.61597" fill="#565656" id="Ellipse 307" r="1.61597" />
        </svg>
      </div>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[13px] tracking-[-0.325px] whitespace-nowrap">Jue</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">4</p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="h-[3.232px] relative shrink-0 w-[15.696px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.6958 3.23193">
        <g id="Frame 1171276483">
          <circle cx="1.61597" cy="1.61597" fill="#1EA05A" id="Ellipse 307" r="1.61597" />
          <circle cx="7.8479" cy="1.61597" fill="#F8B32E" id="Ellipse 308" r="1.61597" />
          <circle cx="14.0798" cy="1.61597" fill="#2AB3CC" id="Ellipse 309" r="1.61597" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center justify-center relative shrink-0 w-[25px]">
      <Frame46 />
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[13px] tracking-[-0.325px] whitespace-nowrap">Vie</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">5</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center justify-center relative shrink-0 w-[25px]">
      <div className="relative shrink-0 size-[3.232px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.23193 3.23193">
          <circle cx="1.61597" cy="1.61597" fill="#565656" id="Ellipse 307" r="1.61597" />
        </svg>
      </div>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[13px] tracking-[-0.325px] whitespace-nowrap">Sab</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">6</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center justify-center relative shrink-0 w-[25px]">
      <div className="relative shrink-0 size-[3.232px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.23193 3.23193">
          <circle cx="1.61597" cy="1.61597" fill="#565656" id="Ellipse 307" r="1.61597" />
        </svg>
      </div>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[13px] tracking-[-0.325px] whitespace-nowrap">Dom</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['MessinaSansWeb:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#565656] text-[16px] tracking-[-0.4px] whitespace-nowrap">7</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex h-[41px] items-center justify-between relative shrink-0 w-full">
      <Frame17 />
      <Frame18 />
      <Frame19 />
      <Frame20 />
      <Frame21 />
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame14 />
      <Frame13 />
    </div>
  );
}

function StickyHeader() {
  return (
    <div className="fixed backdrop-blur-[2px] bg-[rgba(255,255,255,0.8)] flex justify-center left-0 pb-[20px] pt-[60px] px-[20px] rounded-bl-[20px] rounded-br-[20px] top-0 w-screen z-40">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-bl-[20px] rounded-br-[20px]" />
      <div className="w-full max-w-[388px]">
        <Frame36 />
      </div>
    </div>
  );
}

// ─── Status bar ───────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="fixed top-0 left-0 w-screen h-[40px] z-50 flex items-center justify-between px-[26.88px]">
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

type BottomTabId = "train" | "activity" | "world" | "community" | "perfil";

const BOTTOM_TABS: { id: BottomTabId; label: string; Icon: React.ElementType }[] = [
  { id: "train", label: "Train", Icon: Dumbbell },
  { id: "activity", label: "Actividad", Icon: Activity },
  { id: "world", label: "BIGG World", Icon: Globe },
  { id: "community", label: "Comunidad", Icon: Users },
  { id: "perfil", label: "Perfil", Icon: User },
];

function BottomNav({ activeTab, onTabChange }: { activeTab: BottomTabId; onTabChange: (id: BottomTabId) => void }) {
  return (
    <div className="fixed bg-[#ededed] border-[#a3a3a3] border-solid border-t h-[93px] left-0 bottom-0 w-screen z-50 flex justify-center items-start pt-[10px]">
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

export default function BiggDayScreen() {
  const [activeTab, setActiveTab] = useState<BottomTabId>("train");
  const [reservarOpen, setReservarOpen] = useState(false);

  return (
    <div className="bg-[#ededed] relative w-screen h-full overflow-x-hidden overflow-y-auto" data-name="BIGG Day">
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
      {activeTab === "train" && (
        <div className="pb-[93px]">
          <MainContent onReservar={() => setReservarOpen(true)} />
        </div>
      )}
      {activeTab === "activity" && <PlaceholderTabContent label="Actividad — próximamente" />}
      {activeTab === "world" && <PlaceholderTabContent label="BIGG World Map — próximamente" />}
      {activeTab === "community" && <CommunityTabContent />}
      {activeTab === "perfil" && <PlaceholderTabContent label="Perfil — próximamente" />}

      {/* Fixed overlays */}
      {activeTab === "train" && <StickyHeader />}
      <StatusBar />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Reservar sheet — triggered by any Reservar button */}
      <BottomSheet
        open={reservarOpen}
        onClose={() => setReservarOpen(false)}
        title="Reservar clase"
      >
        <ReservarSheet />
      </BottomSheet>
    </div>
  );
}
