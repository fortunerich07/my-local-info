import { getPostData, getSortedPostsData } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. 빌드 타임에 정적으로 생성할 경로 목록 제공 (output: "export" 필수 대응)
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  if (posts.length === 0) {
    // 글이 전혀 없을 때 Next.js 정적 빌드 에러를 방지하기 위한 임시 slug 제공
    return [{ slug: "welcome-post" }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 2. 동적 메타데이터 생성 (SEO)
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostData(slug);
  
  if (!post) {
    return {
      title: "글을 찾을 수 없습니다",
    };
  }

  return {
    title: `${post.title} | 알짜 생활 블로그`,
    description: post.summary,
  };
}

// 3. 상세 페이지 컴포넌트
export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

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
          </nav>
        </div>
      </header>

      {/* ===== 본문 영역 ===== */}
      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        {/* 목록으로 돌아가기 */}
        <Link
          href="/blog/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-orange-500 transition-colors mb-6 font-semibold"
        >
          ← 블로그 목록으로 돌아가기
        </Link>

        {/* ===== 블로그 상세 카드 ===== */}
        <article className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm p-6 md:p-8">
          {/* 헤더 정보 */}
          <div className="border-b border-zinc-100 pb-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                {post.category}
              </span>
              <span className="text-xs text-zinc-400 font-medium">{post.date}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight">
              {post.title}
            </h1>
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-150 px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 마크다운 본문 영역 (Tailwind prose 스타일 적용) */}
          <div className="prose prose-sm md:prose-base max-w-none text-zinc-800 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      <footer className="border-t border-zinc-200 bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} 성남시 생활 정보. All rights reserved.</p>
          <span className="text-sm">🏘️</span>
        </div>
      </footer>
    </div>
  );
}
