// OAuth2 回调处理 - 用授权码换取 token
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getUserInfo } from '@/lib/secondme';
import { setSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // 验证 state
  const savedState = request.cookies.get('oauth_state')?.value;
  if (!state || state !== savedState) {
    return NextResponse.redirect(`${appUrl}?error=invalid_state`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}?error=no_code`);
  }

  try {
    // 换取 token
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.data?.accessToken || tokenData.accessToken;
    const refreshToken = tokenData.data?.refreshToken || tokenData.refreshToken;

    if (!accessToken) {
      console.error('Token response:', tokenData);
      return NextResponse.redirect(`${appUrl}?error=token_failed`);
    }

    // 获取用户信息
    const userInfo = await getUserInfo(accessToken);
    const user = userInfo.data || userInfo;

    // 保存 session
    await setSession({
      accessToken,
      refreshToken,
      userId: user.userId || user.id || '',
      userName: user.name || user.userName || '历史旅人',
      avatar: user.avatar || '',
      expiresAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
    });

    // 清除 state cookie 并重定向到角色选择页
    const response = NextResponse.redirect(`${appUrl}/character-select`);
    response.cookies.delete('oauth_state');
    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${appUrl}?error=auth_failed`);
  }
}
