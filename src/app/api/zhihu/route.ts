// 知乎热榜 API 集成
import { NextResponse } from 'next/server';

// 知乎热榜 API（黑客松期间开放）
const ZHIHU_HOT_API = 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total';

export async function GET() {
  try {
    // 尝试获取知乎热榜
    const res = await fetch(ZHIHU_HOT_API, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AgentReplayHistory/1.0)',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // 5分钟缓存
    });

    if (!res.ok) {
      // 如果 API 不可用，返回模拟数据用于演示
      return NextResponse.json({
        data: getMockHotTopics(),
        source: 'mock',
      });
    }

    const data = await res.json();
    const topics = (data.data || []).slice(0, 10).map((item: any) => ({
      title: item.target?.title || item.title || '',
      excerpt: item.target?.excerpt || '',
      url: item.target?.url || '',
      hotScore: item.detail_text || '',
    }));

    return NextResponse.json({ data: topics, source: 'zhihu' });
  } catch {
    return NextResponse.json({
      data: getMockHotTopics(),
      source: 'mock',
    });
  }
}

function getMockHotTopics() {
  return [
    { title: '如果你穿越到三国，你会选择辅佐谁？', excerpt: '知乎热门讨论', hotScore: '2.3亿热度' },
    { title: '诸葛亮北伐真的没有胜算吗？', excerpt: '历史分析', hotScore: '1.8亿热度' },
    { title: '曹操和刘备谁更适合当领导？', excerpt: '管理学视角', hotScore: '1.5亿热度' },
    { title: '赤壁之战如果曹操赢了，历史会怎样？', excerpt: '架空历史', hotScore: '1.2亿热度' },
    { title: '三国时期最被低估的人物是谁？', excerpt: '人物评价', hotScore: '9800万热度' },
  ];
}
