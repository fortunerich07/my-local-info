import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 HTML로 내보내기 설정 (Cloudflare Pages 배포용)
  output: "export",

  // 이미지 최적화 비활성화 (정적 내보내기에서는 Next.js 이미지 최적화 서버가 필요해 비활성화)
  images: {
    unoptimized: true,
  },

  // URL 끝에 슬래시(/) 자동 추가 (예: /about → /about/)
  // Cloudflare Pages에서 페이지를 더 안정적으로 찾도록 도와줍니다
  trailingSlash: true,
};

export default nextConfig;
