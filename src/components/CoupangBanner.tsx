"use client";

export default function CoupangBanner() {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const showBanner = partnerId && partnerId !== "나중에_입력" && partnerId.trim() !== "";

  if (!showBanner) return null;

  return (
    <div className="w-full my-6 flex flex-col items-center justify-center overflow-hidden bg-zinc-50 border border-zinc-150 rounded-2xl p-4">
      {/* 쿠팡 파트너스 배너 iframe */}
      <iframe
        src={`https://ads-partners.coupang.com/widgets.html?id=${partnerId}&trackingCode=default&subId=my-local-info`}
        width="100%"
        height="100"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        className="max-w-xl mx-auto"
      />
      <p className="text-[10px] text-zinc-400 mt-2 text-center leading-relaxed">
        "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
      </p>
    </div>
  );
}
