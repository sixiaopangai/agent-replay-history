// 首页 - 登录入口
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect('/character-select');

  return (
    <main className="min-h-screen bg-ink-wash flex flex-col items-center justify-center relative overflow-hidden">
      {/* 装饰性水墨圆 */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(139,26,26,0.08)_0%,transparent_60%)]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(90,159,212,0.05)_0%,transparent_60%)]" />
      <div className="absolute top-[30%] left-[-50px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.04)_0%,transparent_60%)]" />

      {/* 顶部飘浮装饰文字 */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pt-6 opacity-[0.04] text-[120px] tracking-[40px] text-[var(--color-gold)] select-none overflow-hidden whitespace-nowrap"
        style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
        魏蜀吴魏蜀吴魏蜀吴
      </div>

      <div className="relative z-10 text-center px-6 max-w-xl">
        {/* 黑客松标签 */}
        <div className="animate-fade-in-up mb-10">
          <span className="inline-block text-[var(--color-text-dim)] text-xs tracking-[6px] px-5 py-2 rounded-full border border-rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.03)]">
            知乎 × Second Me · A2A Hackathon
          </span>
        </div>

        {/* 主标题 */}
        <h1
          className="animate-ink-reveal text-6xl md:text-8xl font-black mb-6 tracking-[8px] leading-tight"
          style={{
            fontFamily: "'Ma Shan Zheng', cursive",
            background: 'linear-gradient(180deg, #f0d890 0%, #d4a853 40%, #b8862b 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'drop-shadow(0 2px 20px rgba(212,168,83,0.25))',
          }}
        >
          重演历史
        </h1>

        {/* 副标题 */}
        <p className="animate-fade-in-up text-lg md:text-xl text-[var(--color-text)] tracking-[4px] mb-1"
          style={{ animationDelay: '0.4s', opacity: 0 }}>
          当AI分身穿越三国
        </p>
        <p className="animate-fade-in-up text-sm text-[var(--color-text-dim)] tracking-[3px] mb-14"
          style={{ animationDelay: '0.6s', opacity: 0 }}>
          在历史碰撞中，找到同频的人
        </p>

        {/* 三个特性 */}
        <div className="animate-fade-in-up grid grid-cols-3 gap-3 mb-14"
          style={{ animationDelay: '0.8s', opacity: 0 }}>
          {[
            { icon: '🎭', title: '化身英雄', desc: 'AI分身成为曹操、诸葛亮' },
            { icon: '⚔️', title: '自主决策', desc: 'Agent独立思考改写历史' },
            { icon: '🤝', title: '真人相遇', desc: '深度交互连接真实的你' },
          ].map((item, i) => (
            <div key={i} className="card-scroll p-4 text-center group">
              <div className="text-2xl mb-2 group-hover:animate-float-slow">{item.icon}</div>
              <div className="text-[var(--color-gold)] text-sm font-semibold mb-1 tracking-wider">{item.title}</div>
              <div className="text-[var(--color-text-dim)] text-[11px] leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA 按钮 */}
        <div className="animate-fade-in-up" style={{ animationDelay: '1s', opacity: 0 }}>
          <Link href="/api/auth/login" className="btn-brush inline-block animate-breath rounded-lg">
            以 Second Me 身份进入三国
          </Link>
          <p className="mt-5 text-[11px] text-[var(--color-text-dim)] tracking-wider">
            使用 Second Me 账号登录，让你的AI分身穿越历史
          </p>
        </div>

        {/* 底部标签 */}
        <div className="animate-fade-in-up mt-20 flex items-center justify-center gap-3"
          style={{ animationDelay: '1.2s', opacity: 0 }}>
          <span className="tag-ancient border-[rgba(212,168,83,0.2)] text-[var(--color-text-dim)]">无人区赛道</span>
          <span className="text-[var(--color-text-dim)] text-[10px]">·</span>
          <span className="tag-ancient border-[rgba(212,168,83,0.2)] text-[var(--color-gold)]">#A2AforReconnect</span>
        </div>
      </div>

      {/* 底部渐隐装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-dark)] to-transparent" />
    </main>
  );
}
