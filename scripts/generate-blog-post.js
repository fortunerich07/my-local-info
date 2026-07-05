const fs = require('fs');
const path = require('path');

async function run() {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error("Error: Missing required environment variable GEMINI_API_KEY.");
    process.exit(1);
  }

  // 1. 최신 데이터 확인
  const jsonPath = path.join(process.cwd(), 'public/data/local-info.json');
  if (!fs.existsSync(jsonPath)) {
    console.error("Error: local-info.json not found.");
    process.exit(1);
  }

  let localData = { events: [], benefits: [], lastUpdated: "", source: "" };
  try {
    localData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (err) {
    console.error("Error parsing local-info.json:", err);
    process.exit(1);
  }

  const allItems = [...localData.events, ...localData.benefits];
  if (allItems.length === 0) {
    console.log("새로운 데이터가 없습니다 (등록된 아이템이 없음)");
    process.exit(0);
  }

  // id 숫자 크기 기준으로 가장 최신 항목 1개 선정
  const latestItem = allItems.reduce((latest, current) => {
    const getNum = (id) => parseInt(String(id).replace(/[^0-9]/g, ''), 10) || 0;
    return getNum(current.id) > getNum(latest.id) ? current : latest;
  }, allItems[0]);

  console.log(`Latest item found: ${latestItem.name} (${latestItem.id})`);

  // 이미 해당 name으로 작성된 글이 있는지 기존 포스트 폴더 스캔
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  let alreadyExists = false;

  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const fileContent = fs.readFileSync(path.join(postsDir, file), 'utf8');
        // 본문이나 제목에 최신 아이템의 name이 들어가 있는지 검사
        if (fileContent.includes(latestItem.name)) {
          alreadyExists = true;
          break;
        }
      }
    }
  }

  if (alreadyExists) {
    console.log("이미 작성된 글입니다");
    process.exit(0);
  }

  // 2. Gemini AI로 블로그 글 생성
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
  const todayStr = new Date().toISOString().split('T')[0];

  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보:
${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${todayStr}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

  console.log("Generating blog post using Gemini...");
  let geminiOutput = "";

  try {
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!geminiRes.ok) {
      throw new Error(`Failed to fetch Gemini API: HTTP ${geminiRes.status}`);
    }

    const resJson = await geminiRes.json();
    geminiOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    console.error("Error communicating with Gemini:", err);
    process.exit(1);
  }

  if (!geminiOutput) {
    console.error("Error: Gemini returned empty content.");
    process.exit(1);
  }

  // 3. 파일 분리 및 저장
  try {
    // FILENAME 파트 찾기
    const filenameMatch = geminiOutput.match(/FILENAME:\s*([^\n\r]+)/i);
    let filename = "";
    
    if (filenameMatch) {
      filename = filenameMatch[1].trim();
      // 만약 확장자가 포함되어 있지 않다면 추가
      if (!filename.endsWith('.md')) {
        filename += '.md';
      }
    } else {
      // 기본 파일명
      filename = `${todayStr}-new-service.md`;
    }

    // 본문에서 FILENAME 라인 제거
    let postContent = geminiOutput.replace(/FILENAME:\s*[^\n\r]+/i, "").trim();
    // 혹시 모를 마크다운 코드블록 감쌈 기호(```) 제거
    postContent = postContent.replace(/```markdown|```/g, "").trim();

    // 저장 폴더 생성 보장
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const outputPath = path.join(postsDir, filename);
    fs.writeFileSync(outputPath, postContent, 'utf8');
    console.log(`Successfully generated and saved blog post: ${filename}`);
  } catch (err) {
    console.error("Error saving blog post file:", err);
    process.exit(1);
  }
}

run();
