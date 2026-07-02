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
  title: "성남시 생활 정보 | 우리 동네 행사·지원금 안내",
  description:
    "성남시의 이달 행사, 축제, 지원금, 혜택 정보를 한눈에 확인하세요. 공공데이터포털 기반의 신뢰할 수 있는 생활 정보를 매일 업데이트합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 한국어 웹사이트임을 브라우저에 알려줍니다
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}

