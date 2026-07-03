import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 포스트 아이템의 타입 정의
export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
};

// posts 폴더 경로
const postsDirectory = path.join(process.cwd(), "src/content/posts");

// 날짜 포맷팅 헬퍼 함수
function formatDate(dateVal: any): string {
  if (!dateVal) {
    return new Date().toISOString().split("T")[0]; // 기본값: 오늘 날짜
  }
  
  if (dateVal instanceof Date) {
    const yyyy = dateVal.getFullYear();
    const mm = String(dateVal.getMonth() + 1).padStart(2, '0');
    const dd = String(dateVal.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  // 이미 문자열 타입인 경우 처리
  if (typeof dateVal === "string") {
    // YYYY-MM-DD 형식만 추출
    const match = dateVal.match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : dateVal;
  }
  
  return String(dateVal);
}

// 모든 포스트 데이터 가져오기 (날짜 내림차순 정렬)
export function getSortedPostsData(): Post[] {
  // 예외처리: 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md")) // 마크다운 파일만 필터
    .map((fileName) => {
      // 파일 이름을 slug로 사용 (.md 제외)
      const slug = fileName.replace(/\.md$/, "");

      // 마크다운 파일을 문자열로 읽기
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matter로 frontmatter 파싱
      const matterResult = matter(fileContents);
      const data = matterResult.data;

      // tags 데이터 정제
      const tags = Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === "string"
        ? data.tags.split(",").map((t: string) => t.trim())
        : [];

      return {
        slug,
        title: data.title || "제목 없음",
        date: formatDate(data.date),
        summary: data.summary || "",
        category: data.category || "일반",
        tags,
        content: matterResult.content,
      };
    });

  // 날짜 기준 내림차순(최신순) 정렬
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 개별 포스트 데이터 가져오기
export function getPostData(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const data = matterResult.data;

    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === "string"
      ? data.tags.split(",").map((t: string) => t.trim())
      : [];

    return {
      slug,
      title: data.title || "제목 없음",
      date: formatDate(data.date),
      summary: data.summary || "",
      category: data.category || "일반",
      tags,
      content: matterResult.content,
    };
  } catch (error) {
    console.error(`Error reading post data for ${slug}:`, error);
    return null;
  }
}
