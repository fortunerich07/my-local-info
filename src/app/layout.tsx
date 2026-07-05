import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 한글이 예쁘게 보이도록 Noto Sans KR 폰트를 사용합니다
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

// 검색엔진(구글 등)에 표시될 웹사이트 이름과 설명 (SEO)
export const metadata: Metadata = {
  title: "성남시 생활 정보 | 행사·혜택·지원금 안내",
  description: "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "성남시 생활 정보 | 행사·혜택·지원금 안내",
    description: "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: "https://my-local-info-4u5.pages.dev",
    siteName: "성남시 생활 정보",
    locale: "ko_KR",
    type: "website",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "성남시 생활 정보",
  "url": "https://my-local-info-4u5.pages.dev",
  "description": "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "홈",
      "item": "https://my-local-info-4u5.pages.dev",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "블로그",
      "item": "https://my-local-info-4u5.pages.dev/blog/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const showAdsense = adsenseId && adsenseId !== "나중에_입력" && adsenseId.trim() !== "";

  return (
    // 한국어 웹사이트임을 브라우저에 알려줍니다
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <head>
        {showAdsense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}

