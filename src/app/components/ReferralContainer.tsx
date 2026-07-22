import svgPaths from "../../imports/BiggDay/svg-03sgvqmew7";

// Referral program promo card — icon in a lime circle, bold title, body copy, lime pill CTA.
// Extracted from BiggDayScreen (where it used to render at the bottom of the daily timeline)
// so it can be reused as the centerpiece of ThankYouClassScreen's post-class flow.

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

export default function ReferralContainer() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Referral Container">
      <div className="content-stretch flex gap-[11px] items-start p-[20px] relative size-full">
        <ReferralIcon />
        <ReferralContent />
      </div>
    </div>
  );
}
