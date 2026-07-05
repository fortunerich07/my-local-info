"use client";

import { useEffect } from "react";

export default function AdBanner() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const showAd = adsenseId && adsenseId !== "나중에_입력" && adsenseId.trim() !== "";

  useEffect(() => {
    if (showAd) {
      try {
        // window.adsbygoogle 초기화 호출
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [showAd]);

  if (!showAd) return null;

  return (
    <div className="w-full my-6 flex justify-center overflow-hidden bg-zinc-50 border border-zinc-150 rounded-2xl p-2 min-h-[100px] items-center">
      {/* Google AdSense Display Ad */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client={adsenseId}
        data-ad-slot="default"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
