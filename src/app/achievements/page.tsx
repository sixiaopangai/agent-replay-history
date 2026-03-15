'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/data/characters';

interface GameState {
  character: Character;
  decisions: Array<{
    eventId: string;
    eventName: string;
    choiceText: string;
    aiResponse: string;
  }>;
  reputation: number;
  military: number;
  eventsCompleted: number;
}

export default function AchievementsPage() {
  const router = useRouter();
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gameState');
    if (!saved) { router.push('/game'); return; }
    setState(JSON.parse(saved));
  }, [router]);

  if (!state) return null;

  const { character, decisions, reputation, military, eventsCompleted } = state;
  const wins = decisions.filter(d => d.aiResponse.includes('胜') || d.aiResponse.includes('成功')).length;

  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* 成就卡片 */}
        <div className="card-ancient rounded-xl p-8 text-center mb-8"
          style={{ background: 'linear-gradient(135deg, #1a1a28 0%, #12121a 50%, #1a1a28 100%)' }}>

          <div className="text-5xl mb-4">{character.portrait}</div>
          <h1 className="text-3xl font-bold text-[var(--color-gold)] mb-1"
            style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            {character.name}的三国传
          </h1>
          <p className="text-sm text-[var(--color-text-dim)] mb-6">{character.title} · {character.faction}</p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-[var(--color-dark-surface)]">
              <div className="text-2xl font-bold text-[var(--color-gold)]">{eventsCompleted}</div>
              <div className="text-xs text-[var(--color-text-dim)]">历史事件</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-dark-surface)]">
              <div className="text-2xl font-bold text-[var(--color-shu)]">{reputation}</div>
              <div className="text-xs text-[var(--color-text-dim)]">声望值</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-dark-surface)]">
              <div className="text-2xl font-bold text-[var(--color-wei)]">{military}</div>
              <div className="text-xs text-[var(--color-text-dim)]">军力值</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-dark-surface)]">
              <div className="text-2xl font-bold text-[var(--color-wu)]">{wins}</div>
              <div className="text-xs text-[var(--color-text-dim)]">关键胜利</div>
            </div>
          </div>

          {/* 称号 */}
          <div className="mb-6">
            <span className="px-4 py-1.5 rounded-full text-sm border border-[var(--color-gold)] text-[var(--color-gold)]">
              {reputation >= 80 ? '一代枭雄' :
               reputation >= 60 ? '乱世英豪' :
               reputation >= 40 ? '割据诸侯' : '草莽英雄'}
            </span>
          </div>

          {/* 标语 */}
          <p className="text-sm text-[var(--color-text)] italic mb-2">
            「{character.signature}」
          </p>
          <p className="text-xs text-[var(--color-text-dim)]">
            Agent重演历史 · A2A for Reconnect
          </p>
        </div>

        {/* 决策回顾 */}
        <h2 className="text-lg font-bold text-[var(--color-gold)] mb-4"
          style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
          📜 历史决策回顾
        </h2>
        <div className="space-y-3 mb-8">
          {decisions.map((d, i) => (
            <div key={i} className="card-ancient rounded-lg p-4">
              <div className="text-sm font-bold text-[var(--color-gold)] mb-1">{d.eventName}</div>
              <div className="text-xs text-[var(--color-text-dim)]">决策：{d.choiceText}</div>
              <div className="text-xs text-[var(--color-text)] mt-1">{d.aiResponse}</div>
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-center">
          <button onClick={() => router.push('/game')} className="btn-ancient rounded-lg px-6 py-3 text-sm">
            继续征战
          </button>
          <button onClick={() => router.push('/connections')} className="btn-ancient rounded-lg px-6 py-3 text-sm">
            查看历史缘分
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${character.name}的三国传 - Agent重演历史`,
                  text: `我的AI分身化身${character.name}，声望${reputation}，经历了${eventsCompleted}个历史事件！`,
                  url: window.location.origin,
                });
              }
            }}
            className="btn-ancient rounded-lg px-6 py-3 text-sm"
          >
            分享成就
          </button>
        </div>
      </div>
    </main>
  );
}
