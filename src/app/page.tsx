// 首页 - 登录入口
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect('/character-select');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(139,26,26,0.15)_0%,transparent_70%)]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(212,168,83,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <div className="animate-fade-in-up mb-8">
          <span className="text-[var(--color-text-dim)] text-sm tracking-widest">
            知乎 × Second Me · A2A for Reconnect
          </span>
        </div>

        <h1
          className="animate-ink text-5xl md:text-7xl font-black mb-4 tracking-wider"
          style={{
            fontFamily: "'Ma Shan Zheng', cursive",
            color: 'var(--color-gold)',
            textShadow: '0 0 40px rgba(212,168,83,0.3)',
          }}
        >
          Agent重演历史
        </h1>

        <p className="animate-fade-in-up text-xl md:text-2xl mb-2 text-[var(--color-text)]"
          style={{ animationDelay: '0.3s', opacity: 0 }}>
          当AI分身穿越三国
        </p>
        <p className="animate-fade-in-up text-base text-[var(--color-text-dim)] mb-12"
          style={{ animationDelay: '0.5s', opacity: 0 }}>
          在历史碰撞中，找到同频的人
        </p>

        <div className="animate-fade-in-up grid grid-cols-3 gap-4 mb-12 text-sm"
          style={{ animationDelay: '0.7s', opacity: 0 }}>
          <div className="card-ancient rounded-lg p-4">
            <div className="text-2xl mb-2">🎭</div>
            <div className="text-[var(--color-gold)] font-semibold mb-1">化身英雄</div>
            <div className="text-[var(--color-text-dim)] text-xs">你的AI分身将成为曹操、诸葛亮...</div>
          </div>
          <div className="card-ancient rounded-lg p-4">
            <div className="text-2xl mb-2">⚔️</div>
            <div className="text-[var(--color-gold)] font-semibold mb-1">自主决策</div>
            <div className="text-[var(--color-text-dim)] text-xs">Agent独立思考，改写历史走向</div>
          </div>
          <div className="card-ancient rounded-lg p-4">
            <div className="text-2xl mb-2">🤝</div>
            <div className="text-[var(--color-gold)] font-semibold mb-1">真人相遇</div>
            <div className="text-[var(--color-text-dim)] text-xs">历史中的深度交互，连接真实的你</div>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.9s', opacity: 0 }}>
          <Link
            href="/api/auth/login"
            className="btn-ancient inline-block rounded-lg text-lg px-10 py-4 animate-pulse-glow"
          >
            以 Second Me 身份进入三国
          </Link>
          <p className="mt-4 text-xs text-[var(--color-text-dim)]">
            使用 Second Me 账号登录，让你的AI分身穿越历史
          </p>
        </div>

        <div className="animate-fade-in-up mt-16 flex items-center justify-center gap-4 text-xs text-[var(--color-text-dim)]"
          style={{ animationDelay: '1.1s', opacity: 0 }}>
          <span className="px-3 py-1 border border-[rgba(212,168,83,0.3)] rounded-full">🚀 无人区赛道</span>
          <span className="px-3 py-1 border border-[rgba(212,168,83,0.3)] rounded-full">#A2AforReconnect</span>
        </div>
      </div>
    </main>
  );
}
