// Agent 结构化决策 API
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { actStream } from '@/lib/secondme';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { message, actionControl, sessionId } = await request.json();

  try {
    const response = await actStream(
      session.accessToken,
      message,
      actionControl,
      sessionId
    );

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Act error:', error);
    return NextResponse.json({ error: 'Act failed' }, { status: 500 });
  }
}
