// Next.js App Router의 동적 경로 페이지입니다.
// URL: /detail/evt-001, /detail/ben-001 등

import localInfoData from "../../../../public/data/local-info.json";
import { notFound } from "next/navigation";

// --- 타입 정의 ---
type InfoItem = {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
};

// --- 정적 빌드 시 미리 만들 페이지 목록 (output: "export" 필수 설정) ---
// 이 함수 덕분에 Cloudflare Pages에 배포할 때 각 행사/혜택 상세 페이지가
// 자동으로 HTML 파일로 미리 만들어집니다.
export function generateStaticParams() {
  const allItems = [
    ...localInfoData.events,
    ...localInfoData.benefits,
  ];
  return allItems.map((item) => ({ id: item.id }));
}

// --- SEO용 페이지 제목 자동 생성 ---
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allItems = [...localInfoData.events, ...localInfoData.benefits] as InfoItem[];
  const item = allItems.find((i) => i.id === id);
  if (!item) return { title: "정보를 찾을 수 없습니다" };
  return {
    title: `${item.name} | 성남시 생활 정보`,
    description: item.summary,
  };
}

// --- 날짜 포맷 함수 ---
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}
function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

// 카테고리별 아이콘 & 색상
const ITEM_ICONS: Record<string, string> = {
  "evt-001": "🌸",
  "evt-002": "💼",
  "evt-003": "🎠",
  "ben-001": "🏠",
  "ben-002": "👶",
};

// --- 상세 페이지 컴포넌트 ---
export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // JSON에서 해당 id의 항목 찾기
  const allItems = [...localInfoData.events, ...localInfoData.benefits] as InfoItem[];
  const item = allItems.find((i) => i.id === id);

  // 항목이 없으면 404 페이지로 이동
  if (!item) notFound();

  const icon = ITEM_ICONS[item.id] ?? (item.category === "행사" ? "🎉" : "💰");
  const isEvent = item.category === "행사";

  // 행사는 보라 계열, 혜택은 초록 계열 강조색
  const accentClass = isEvent
    ? { badge: "bg-violet-100 text-violet-600", btn: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200" }
    : { badge: "bg-emerald-100 text-emerald-600", btn: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200" };

  return (
    <div className="min-h-screen bg-zinc-50 font-[family-name:var(--font-noto-sans-kr)]">

      {/* ===== 네비게이션 바 ===== */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-xl">🏘️</span>
            <span className="font-black text-zinc-900 text-sm tracking-tight">성남시 생활 정보</span>
          </a>
          <span className="text-zinc-300 mx-1">›</span>
          <span className="text-zinc-500 text-sm truncate">{item.name}</span>
        </div>
      </header>

      {/* ===== 본문 ===== */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* 목록으로 돌아가기 버튼 (상단) */}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-orange-500 transition-colors mb-6"
        >
          ← 목록으로 돌아가기
        </a>

        {/* ===== 상세 카드 ===== */}
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">

          {/* 카드 상단 헤더 */}
          <div className="p-6 border-b border-zinc-100">
            <div className="flex items-start gap-4">
              {/* 큰 아이콘 */}
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-4xl shrink-0">
                {icon}
              </div>
              <div className="flex-1">
                {/* 카테고리 배지 */}
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${accentClass.badge} mb-2`}>
                  {isEvent ? "🎪" : "💰"} {item.category}
                </span>
                {/* 제목 */}
                <h1 className="text-xl md:text-2xl font-black text-zinc-900 leading-tight">
                  {item.name}
                </h1>
              </div>
            </div>
          </div>

          {/* 핵심 정보 요약 (기간/장소/대상) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 bg-zinc-50/50">
            <div className="px-6 py-4">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">📅 기간</p>
              <p className="text-sm font-bold text-zinc-800">{formatDateRange(item.startDate, item.endDate)}</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">📍 장소</p>
              <p className="text-sm font-bold text-zinc-800">{item.location}</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">👥 대상</p>
              <p className="text-sm font-bold text-zinc-800">{item.target}</p>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="p-6 border-t border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-widest">
              📋 상세 내용
            </h2>
            <p className="text-zinc-700 text-sm leading-7 whitespace-pre-line">
              {item.summary}
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            {/* 원본 사이트 이동 버튼 */}
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg ${accentClass.btn}`}
            >
              자세히 보기 →
            </a>

            {/* 목록으로 돌아가기 버튼 */}
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all duration-200"
            >
              ← 목록으로 돌아가기
            </a>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="text-center text-xs text-zinc-400 mt-6 leading-relaxed">
          본 정보는 공공데이터포털 기반으로 제공됩니다.
          <br />
          정확한 내용은 원본 사이트에서 반드시 확인하세요.
        </p>
      </main>
    </div>
  );
}
