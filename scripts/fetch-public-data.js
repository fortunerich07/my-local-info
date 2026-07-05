const fs = require('fs');
const path = require('path');

async function run() {
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!publicDataApiKey || !geminiApiKey) {
    console.error("Error: Missing required environment variables (PUBLIC_DATA_API_KEY or GEMINI_API_KEY).");
    process.exit(1);
  }

  // 1. 기존 데이터 읽기
  const jsonPath = path.join(process.cwd(), 'public/data/local-info.json');
  let localData = { events: [], benefits: [], lastUpdated: "", source: "" };
  
  try {
    if (fs.existsSync(jsonPath)) {
      localData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading local-info.json:", err);
  }

  const existingNames = new Set([
    ...localData.events.map(item => item.name),
    ...localData.benefits.map(item => item.name)
  ]);

  // 2. 공공데이터 API 호출
  const publicUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON`;
  console.log("Fetching public data...");
  
  let services = [];
  try {
    const res = await fetch(publicUrl, {
      headers: {
        'Authorization': `Infuser ${publicDataApiKey}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch public data: HTTP ${res.status}`);
    }
    
    const jsonRes = await res.json();
    services = jsonRes.data || [];
  } catch (err) {
    console.error("Error fetching public data:", err);
    process.exit(1);
  }

  if (services.length === 0) {
    console.log("새로운 데이터가 없습니다");
    process.exit(0);
  }

  // 3. 필터링 로직 (성남 -> 경기 -> 전체)
  let filtered = services.filter(item => {
    const targetFields = [
      item['서비스명'],
      item['서비스목적요약'],
      item['지원대상'],
      item['소관기관명']
    ].map(val => String(val || ''));
    return targetFields.some(field => field.includes("성남"));
  });

  if (filtered.length === 0) {
    filtered = services.filter(item => {
      const targetFields = [
        item['서비스명'],
        item['서비스목적요약'],
        item['지원대상'],
        item['소관기관명']
      ].map(val => String(val || ''));
      return targetFields.some(field => field.includes("경기"));
    });
  }

  if (filtered.length === 0) {
    filtered = services;
  }

  // 기존 데이터 중복 검사
  const newItems = filtered.filter(item => {
    const name = item['서비스명'] || '';
    return name && !existingNames.has(name);
  });

  if (newItems.length === 0) {
    console.log("새로운 데이터가 없습니다");
    process.exit(0);
  }

  // 새 항목 1개 선정
  const targetItem = newItems[0];
  console.log(`Target item to process: ${targetItem['서비스명']}`);

  // 4. Gemini AI 호출
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
  const todayStr = new Date().toISOString().split('T')[0];
  
  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

오늘 날짜: ${todayStr}

공공데이터:
${JSON.stringify(targetItem, null, 2)}`;

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

  // 5. JSON 정제 및 저장
  try {
    let cleanJson = geminiOutput.replace(/```json|```/g, "").trim();
    const processedItem = JSON.parse(cleanJson);
    
    // id 발급 (기존 최고 숫자 id + 1)
    const allItems = [...localData.events, ...localData.benefits];
    let maxId = 0;
    allItems.forEach(i => {
      const numId = parseInt(String(i.id).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numId) && numId > maxId) {
        maxId = numId;
      }
    });
    
    const newIdNum = maxId + 1;
    const prefix = processedItem.category === '행사' ? 'evt' : 'ben';
    processedItem.id = `${prefix}-${String(newIdNum).padStart(3, '0')}`;

    if (processedItem.category === '행사') {
      localData.events.push(processedItem);
    } else {
      processedItem.category = '혜택';
      localData.benefits.push(processedItem);
    }

    localData.lastUpdated = todayStr;
    fs.writeFileSync(jsonPath, JSON.stringify(localData, null, 2), 'utf8');
    console.log(`Successfully added new service: ${processedItem.name} (${processedItem.id})`);
  } catch (err) {
    console.error("Failed to parse Gemini output or update JSON:", err);
    console.error("Gemini Output was:", geminiOutput);
    process.exit(1);
  }
}

run();
