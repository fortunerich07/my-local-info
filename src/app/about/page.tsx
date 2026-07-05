import Link from "next/link";

export const metadata = {
  title: "서비스 소개 | 성남시 생활 정보",
  description: "성남시 생활 정보 서비스의 기획 취지와 데이터 출처, 서비스 자동화 운영 방식을 소개합니다.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-[family-name:var(--font-noto-sans-kr)] flex flex-col">
      {/* ===== 상단 네비게이션 바 ===== */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-xl">🏘️</span>
            <span className="font-black text-zinc-900 text-sm tracking-tight">성남시 생활 정보</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors">
              홈
            </Link>
            <Link href="/blog/" className="text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors">
              블로그
            </Link>
            <Link href="/about/" className="text-xs font-bold text-orange-500 transition-colors">
              소개
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== 본문 섹션 ===== */}
      <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-10 shadow-sm space-y-8">
          
          {/* 타이틀 */}
          <div className="border-b border-zinc-100 pb-6">
            <span className="text-3xl block mb-3">🏘️</span>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight">
              서비스 소개
            </h1>
            <p className="text-zinc-500 text-xs mt-2 font-medium">
              성남시 생활 정보 서비스의 기획 취지와 운영 방식을 안내합니다.
            </p>
          </div>

          {/* 1. 운영 목적 */}
          <section className="space-y-3">
            <h2 className="text-base font-extrabold text-zinc-800 flex items-center gap-2">
              📌 서비스 운영 목적
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              성남시 생활 정보 서비스는 **성남시민과 지역 거주 주민 여러분을 위한 맞춤형 정보 창구**입니다. 
              시즌마다 열리는 신나는 로컬 행사와 지역 축제, 그리고 정부 및 지방자치단체에서 지원해주는 놓치기 아쉬운 
              현금성·비현금성 복지 혜택 및 지원금 정보를 주민 눈높이에서 가장 직관적이고 알기 쉽게 안내해 드립니다.
            </p>
          </section>

          {/* 2. 데이터 출처 */}
          <section className="space-y-3">
            <h2 className="text-base font-extrabold text-zinc-800 flex items-center gap-2">
              📡 신뢰성 있는 공공데이터 활용
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              본 서비스는 행정안전부 및 유관 공공기관이 오픈 API 형태로 제공하는 **대한민국 공공데이터포털(data.go.kr)의 공신력 있는 데이터베이스**를 출처로 하고 있습니다.
              행정 기관이 공식적으로 발급하고 보증하는 사업 스펙을 기본으로 수집하여 정확한 원천 데이터만을 취급하고 있습니다.
            </p>
          </section>

          {/* 3. 콘텐츠 생성 방식 */}
          <section className="space-y-3">
            <h2 className="text-base font-extrabold text-zinc-800 flex items-center gap-2">
              🤖 AI와 자동화 기반의 스마트한 운영
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              제공되는 모든 블로그 가이드라인 및 설명문은 **구글의 고성능 생성형 AI 엔진(Gemini 2.5 Flash)**과 자동화 로봇 스크립트를 통해 생성됩니다. 
              수동 데이터 등록 방식의 단점인 정보 누락을 해소하고 최신 변경사항을 신속하게 반영하기 위하여, 매일 아침 자동으로 신규 정보를 감지 및 분석하여 생활 친화적인 문투로 변환해 업데이트하고 있습니다.
            </p>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
              * 단, AI의 데이터 변환 과정에서 일부 텍스트 오역 또는 실제 신청 조건의 세부 사항 누락이 존재할 수 있으므로 최종적인 수혜 여부와 접수처 정보는 본문 내 제공되는 원문 공식 사이트 링크를 통해 반드시 확인해 주시기 바랍니다.
            </p>
          </section>
          
        </div>
      </main>

      {/* ===== 푸터 ===== */}
      <footer className="border-t border-zinc-200 bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} 성남시 생활 정보. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
