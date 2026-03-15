// Second Me API 工具库

const API_BASE = process.env.SECONDME_API_BASE || 'https://api.mindverse.com/gate/lab';

// OAuth2 配置
export const oauth = {
  clientId: process.env.SECONDME_CLIENT_ID!,
  clientSecret: process.env.SECONDME_CLIENT_SECRET!,
  redirectUri: process.env.SECONDME_REDIRECT_URI!,
  authorizeUrl: 'https://go.second.me/oauth/',
  tokenUrl: `${API_BASE}/api/oauth/token/code`,
  refreshUrl: `${API_BASE}/api/oauth/token/refresh`,
};

// 生成授权 URL
export function getAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: oauth.clientId,
    redirect_uri: oauth.redirectUri,
    response_type: 'code',
    state,
    scope: 'user.info user.info.shades user.info.softmemory chat voice',
  });
  return `${oauth.authorizeUrl}?${params.toString()}`;
}

// 用授权码换取 token
export async function exchangeCodeForToken(code: string) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
    redirect_uri: oauth.redirectUri,
  });

  const res = await fetch(oauth.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Token exchange failed: ${JSON.stringify(err)}`);
  }
  return res.json();
}

// 刷新 token
export async function refreshToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
  });

  const res = await fetch(oauth.refreshUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) throw new Error('Token refresh failed');
  return res.json();
}

// 获取用户信息
export async function getUserInfo(accessToken: string) {
  const res = await fetch(`${API_BASE}/api/secondme/user/info`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to get user info');
  return res.json();
}

// 获取用户兴趣标签
export async function getUserShades(accessToken: string) {
  const res = await fetch(`${API_BASE}/api/secondme/user/shades`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to get user shades');
  return res.json();
}

// 流式对话 - 让 Agent 以历史人物身份做决策
export async function chatStream(
  accessToken: string,
  message: string,
  options?: {
    sessionId?: string;
    systemPrompt?: string;
    enableWebSearch?: boolean;
  }
) {
  const res = await fetch(`${API_BASE}/api/secondme/chat/stream`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sessionId: options?.sessionId,
      systemPrompt: options?.systemPrompt,
      enableWebSearch: options?.enableWebSearch ?? false,
      model: 'anthropic/claude-sonnet-4-5',
    }),
  });

  if (!res.ok) throw new Error('Chat stream failed');
  return res; // 返回 SSE 流
}

// 结构化行为判断 - 用于 Agent 决策
export async function actStream(
  accessToken: string,
  message: string,
  actionControl: string,
  sessionId?: string
) {
  const res = await fetch(`${API_BASE}/api/secondme/act/stream`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      actionControl,
      sessionId,
    }),
  });

  if (!res.ok) throw new Error('Act stream failed');
  return res;
}

// 写入 Agent 记忆
export async function ingestAgentMemory(
  accessToken: string,
  data: {
    channel: { type: string; name: string };
    action: { type: string; description: string };
    referenceItems?: Array<{
      type: string;
      title: string;
      snapshot: string;
    }>;
    importance?: number;
    idempotencyKey: string;
  }
) {
  const res = await fetch(`${API_BASE}/api/secondme/agent_memory/ingest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Memory ingest failed');
  return res.json();
}

// TTS 语音合成
export async function generateTTS(
  accessToken: string,
  text: string,
  emotion: string = 'calm'
) {
  const res = await fetch(`${API_BASE}/api/secondme/tts/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, emotion }),
  });

  if (!res.ok) throw new Error('TTS generation failed');
  return res.json();
}

// 解析 SSE 流
export async function* parseSSEStream(response: Response): AsyncGenerator<{
  type: string;
  data: string;
}> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        const type = line.slice(7).trim();
        continue;
      }
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        yield { type: 'data', data };
      }
    }
  }
}
