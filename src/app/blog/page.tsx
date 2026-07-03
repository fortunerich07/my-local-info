import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";

export const metadata = {
  title: "알짜 생활 블로그 | 성남시 생활 정보",
  description: "성남시의 유익한 혜택 정보, 생활 꿀팁, 축제 후기 등을 블로그 포스트로 자세히 전해드립니다.",
};

export default function BlogListPage() {
  const posts = getSortedPostsData();

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
            <Link href="/blog/" className="text-xs font-bold text-orange-500 transition-colors">
              블로그
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== 타이틀 섹션 ===== */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          ✍️ 알짜배기 생활 가이드
        </div>
        <h1 className="text-3xl font-black text-zinc-900 leading-tight mb-3">
          우리 동네 소식통 <span className="text-orange-500">블로그</span>
        </h1>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          축제 현장 스케치부터 상세한 혜택 신청 방법까지,<br />
          놓치기 아까운 로컬 이야기들을 만나보세요.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="border-t border-zinc-200"></div>
      </div>

      {/* ===== 목록 세션 ===== */}
      <main className="max-w-3xl mx-auto px-4 py-8 flex-1">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
            <span className="text-4xl block mb-3">📝</span>
            <h3 className="text-zinc-700 font-extrabold text-sm">아직 등록된 블로그 글이 없습니다</h3>
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
              조만간 성남시의 다양한 행사 정보와 알짜 생활 혜택에 관한<br />
              소식들이 업로드될 예정입니다. 조금만 기다려 주세요!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="group block bg-white rounded-2xl border border-zinc-200 p-5 hover:border-orange-400 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-medium">{post.date}</span>
                  </div>
                  
                  <h2 className="font-extrabold text-zinc-900 text-base leading-snug group-hover:text-orange-500 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-zinc-400 bg-zinc-50 border border-zinc-150 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
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
