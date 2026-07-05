export const dynamic = "force-static";

import { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://my-local-info-4u5.pages.dev';

  // 1. 기본 페이지 경로
  const routes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // 2. 블로그 글 동적 경로 수집
  const posts = getSortedPostsData();
  const postRoutes = posts.map((post) => {
    // 날짜 형식이 올바른지 검사 후 날짜 객체 생성
    const dateParsed = isNaN(Date.parse(post.date)) ? new Date() : new Date(post.date);
    return {
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: dateParsed,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  return [...routes, ...postRoutes];
}
