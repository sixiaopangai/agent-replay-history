// OAuth2 登录入口 - 重定向到 Second Me 授权页
import { NextResponse } from 'next/server';
import { getAuthorizeUrl } from '@/lib/secondme';
import crypto from 'crypto';

export async function GET() {
  const state = crypto.randomBytes(16).toString('hex');
  const url = getAuthorizeUrl(state);

  const response = NextResponse.redirect(url);
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300, // 5 minutes
    path: '/',
  });

  return response;
}
