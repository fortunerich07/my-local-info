import localInfoData from "../../public/data/local-info.json";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

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

// --- 날짜 포맷 함수 ---
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

// 행사별 이모지 아이콘 (카드 좌측에 표시)
const EVENT_ICONS: Record<string, string> = {
  "evt-001": "🌸",
  "evt-002": "💼",
  "evt-003": "🎠",
};
const BENEFIT_ICONS: Record<string, string> = {
  "ben-001": "🏠",
  "ben-002": "👶",
};

// 행사 카테고리별 배지 색상
const EVENT_BADGE_COLORS = [
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-pink-100 text-pink-600",
];

// --- 행사/축제 카드 컴포넌트 ---
function EventCard({ item, index }: { item: InfoItem; index: number }) {
  const icon = EVENT_ICONS[item.id] ?? "🎉";
  const badgeColor = EVENT_BADGE_COLORS[index % EVENT_BADGE_COLORS.length];

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": item.name,
    "startDate": item.startDate,
    "endDate": item.endDate,
    "location": {
      "@type": "Place",
      "name": item.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "성남시",
        "addressCountry": "KR",
      },
    },
    "description": item.summary,
  };

  return (
    <a
      href="/blog/"
      className="group flex flex-col bg-white rounded-2xl border border-zinc-200 p-4 hover:border-orange-400 hover:shadow-lg transition-all duration-200"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {/* 카드 헤더: 아이콘 + 이름 + 카테고리 + 날짜 */}
      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <div className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>

        {/* 제목 & 카테고리 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 text-sm leading-snug truncate group-hover:text-orange-500 transition-colors">
            {item.name}
          </h3>
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${badgeColor}`}>
            🎪 {item.category}
          </span>
        </div>

        {/* 날짜 배지 */}
        <span className="text-[11px] text-zinc-400 font-medium shrink-0 mt-0.5">
          {formatDateRange(item.startDate, item.endDate)}
        </span>
      </div>

      {/* 카드 본문: 요약 설명 */}
      <p className="mt-3 text-zinc-500 text-xs leading-relaxed line-clamp-2">
        {item.summary}
      </p>

      {/* 카드 푸터: 장소 & 대상 뱃지 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-[11px] px-2.5 py-1 rounded-full">
          📍 {item.location}
        </span>
        <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-[11px] px-2.5 py-1 rounded-full">
          👥 {item.target}
        </span>
      </div>
    </a>
  );
}

// --- 지원금/혜택 카드 컴포넌트 ---
function BenefitCard({ item, index }: { item: InfoItem; index: number }) {
  const icon = BENEFIT_ICONS[item.id] ?? "💰";
  const accentColors = [
    { badge: "bg-emerald-100 text-emerald-600", hover: "group-hover:text-emerald-500" },
    { badge: "bg-rose-100 text-rose-600",       hover: "group-hover:text-rose-500"    },
  ];
  const accent = accentColors[index % accentColors.length];

  const benefitSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": item.name,
    "description": item.summary,
    "provider": {
      "@type": "GovernmentOrganization",
      "name": item.location || "공공데이터포털",
    },
  };

  return (
    <a
      href="/blog/"
      className="group flex flex-col bg-white rounded-2xl border border-zinc-200 p-4 hover:border-orange-400 hover:shadow-lg transition-all duration-200"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(benefitSchema) }}
      />
      {/* 카드 헤더 */}
      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <div className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>

        {/* 제목 & 카테고리 */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-zinc-900 text-sm leading-snug ${accent.hover} transition-colors`}>
            {item.name}
          </h3>
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${accent.badge}`}>
            💰 {item.category}
          </span>
        </div>

        {/* 신청 가능 뱃지 */}
        <span className="shrink-0 mt-0.5 text-[11px] font-semibold text-green-500 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
          신청 가능
        </span>
      </div>

      {/* 카드 본문 */}
      <p className="mt-3 text-zinc-500 text-xs leading-relaxed line-clamp-2">
        {item.summary}
      </p>

      {/* 카드 푸터 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-[11px] px-2.5 py-1 rounded-full">
          📍 {item.location}
        </span>
        <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-[11px] px-2.5 py-1 rounded-full">
          👥 {item.target}
        </span>
      </div>
    </a>
  );
}

// --- 섹션 헤더: 제목 왼쪽, "전체 보기" 오른쪽 ---
function SectionHeader({ emoji, title, href = "#" }: { emoji: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
          <span>{emoji}</span> {title}
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">공공데이터포털 기반 · 매일 자동 업데이트</p>
      </div>
      <a
        href={href}
        className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-0.5"
      >
        전체 보기 <span className="text-sm">→</span>
      </a>
    </div>
  );
}

// --- 메인 페이지 ---
export default function Home() {
  const { events, benefits, lastUpdated, source } = localInfoData;
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="min-h-screen bg-zinc-50 font-[family-name:var(--font-noto-sans-kr)]">

      {/* ===== 상단 네비게이션 바 ===== */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-xl">🏘️</span>
            <span className="font-black text-zinc-900 text-sm tracking-tight">성남시 생활 정보</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-xs font-bold text-orange-500">
              홈
            </Link>
            <Link href="/blog/" className="text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors">
              블로그
            </Link>
            <Link href="/about/" className="text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors">
              소개
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== 히어로 타이틀 섹션 ===== */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-6 text-center">
        {/* 상위 태그 */}
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          📡 성남시 &middot; 경기도 공공데이터 기반
        </div>

        {/* 메인 타이틀 */}
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight mb-3">
          우리 동네 알짜 정보
          <br />
          <span className="text-orange-500">한 곳에서 확인하세요</span>
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-lg mx-auto">
          성남시 행사·축제부터 청년 지원금·출산 혜택까지,
          <br />
          놓치기 쉬운 생활 정보를 매일 자동으로 정리해 드립니다.
        </p>

        {/* 통계 뱃지 */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-2.5 text-center shadow-sm">
            <p className="text-xl font-black text-zinc-900">{events.length}</p>
            <p className="text-[11px] text-zinc-400">이번 달 행사</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-2.5 text-center shadow-sm">
            <p className="text-xl font-black text-zinc-900">{benefits.length}</p>
            <p className="text-[11px] text-zinc-400">신청 가능 혜택</p>
          </div>
          <div className="bg-orange-500 rounded-2xl px-5 py-2.5 text-center shadow-sm shadow-orange-200">
            <p className="text-xl font-black text-white">매일</p>
            <p className="text-[11px] text-orange-100">자동 업데이트</p>
          </div>
        </div>
      </div>

      {/* ===== 구분선 ===== */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="border-t border-zinc-200" />
      </div>

      {/* ===== 본문 ===== */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        {/* 행사 & 축제 섹션 */}
        <section>
          <SectionHeader emoji="🎪" title={`${currentMonth}월 행사 & 축제`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(events as InfoItem[]).map((event, i) => (
              <EventCard key={event.id} item={event} index={i} />
            ))}
          </div>
        </section>

        {/* 광고 배치 */}
        <AdBanner />

        {/* 안내 배너 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 flex items-start gap-3">
          <span className="text-lg shrink-0">💡</span>
          <div>
            <p className="text-amber-800 font-semibold text-xs">지원금 신청 전 꼭 확인하세요!</p>
            <p className="text-amber-600 text-xs mt-0.5 leading-relaxed">
              예산 소진 시 조기 마감될 수 있습니다. 각 기관의 공식 홈페이지에서 최신 내용을 확인 후 신청하세요.
            </p>
          </div>
        </div>

        {/* 지원금 & 혜택 섹션 */}
        <section>
          <SectionHeader emoji="💚" title="지원금 & 혜택" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(benefits as InfoItem[]).map((benefit, i) => (
              <BenefitCard key={benefit.id} item={benefit} index={i} />
            ))}
          </div>
        </section>
      </main>

      {/* ===== 푸터 ===== */}
      <footer className="border-t border-zinc-200 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1 text-xs text-zinc-400">
            <p>📡 데이터 출처: <span className="font-medium text-zinc-600">{source}</span></p>
            <p>🕐 마지막 업데이트: <span className="font-medium text-zinc-600">{lastUpdated}</span></p>
            <p className="text-[11px] text-zinc-300 pt-1">
              본 정보는 공공데이터 기반으로 제공되며, 정확한 내용은 각 기관 공식 홈페이지를 확인하세요.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>🏘️</span>
            <span>성남시 생활 정보</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
