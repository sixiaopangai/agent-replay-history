// Agent 对话 API - 流式返回 Agent 的历史人物决策
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { chatStream } from '@/lib/secondme';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { message, systemPrompt, sessionId } = await request.json();

  try {
    const response = await chatStream(session.accessToken, message, {
      sessionId,
      systemPrompt,
      enableWebSearch: false,
    });

    // 透传 SSE 流
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
