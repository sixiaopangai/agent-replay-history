// 简单的 cookie-based session 管理
// 生产环境应使用 iron-session 或类似方案

import { cookies } from 'next/headers';

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  avatar: string;
  expiresAt: number;
}

const SESSION_COOKIE = 'hr_session';

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const session = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
    return session as SessionData;
  } catch {
    return null;
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
