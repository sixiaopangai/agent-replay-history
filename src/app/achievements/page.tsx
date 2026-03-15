'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/data/characters';
import { GoldTitle, StatCard } from '@/components';

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

  const title = reputation >= 80 ? '一代枭雄' :
    reputation >= 60 ? '乱世英豪' :
    reputation >= 40 ? '割据诸侯' : '草莽英雄';

  return (
    <main className="min-h-screen bg-ink-wash relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.06)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* 成就主卡 */}
        <div className="card-scroll p-10 text-center mb-10 relative overflow-hidden">
          {/* 装饰角标 */}
          <div className="absolute top-3 left-3 text-[var(--color-gold)] opacity-10 text-4xl" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>功</div>
          <div className="absolute top-3 right-3 text-[var(--color-gold)] opacity-10 text-4xl" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>勋</div>

          <div className="text-6xl mb-5 animate-float-slow">{character.portrait}</div>

          <GoldTitle className="text-3xl tracking-[4px] mb-2">
            {character.name}的三国传
          </GoldTitle>
          <p className="text-[11px] text-[var(--color-text-dim)] tracking-[3px] mb-8">
            {character.title} · {character.faction}
          </p>

          {/* 称号 */}
          <div className="mb-8">
            <span className="inline-block px-6 py-2 rounded-full text-sm tracking-[4px] animate-breath"
              style={{
                background: 'linear-gradient(135deg, rgba(139,26,26,0.3), rgba(20,20,34,0.8))',
                border: '1px solid rgba(212,168,83,0.3)',
                color: 'var(--color-gold)',
              }}>
              {title}
            </span>
          </div>

          {/* 数据面板 */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { value: eventsCompleted, label: '历史事件', color: 'var(--color-gold)' },
              { value: reputation, label: '声望值', color: 'var(--color-shu)' },
              { value: military, label: '军力值', color: 'var(--color-wei)' },
              { value: wins, label: '关键胜利', color: 'var(--color-wu)' },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl bg-[rgba(6,6,16,0.5)] border border-[rgba(212,168,83,0.06)]">
                <StatCard value={stat.value} label={stat.label} color={stat.color} size="lg" />
              </div>
            ))}
          </div>

          <div className="divider-ink mb-6" />

          {/* 名言 */}
          <p className="text-sm text-[var(--color-text)] italic tracking-wider mb-2">
            <span className="text-[var(--color-gold)] opacity-30">「</span>
            {character.signature}
            <span className="text-[var(--color-gold)] opacity-30">」</span>
          </p>
          <p className="text-[10px] text-[var(--color-text-dim)] tracking-[3px]">
            Agent重演历史 · A2A for Reconnect
          </p>
        </div>

        {/* 决策回顾 */}
        {decisions.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-[var(--color-gold)] mb-5 tracking-[3px]"
              style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
              历史决策回顾
            </h2>
            <div className="space-y-3 mb-10">
              {decisions.map((d, i) => (
                <div key={i} className="card-scroll p-5 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--color-gold)] opacity-40 text-xs"
                      style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
                      第{['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五'][i]}回
                    </span>
                    <span className="text-sm font-bold text-[var(--color-gold)] tracking-wider">{d.eventName}</span>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-dim)] tracking-wider mb-1">决策：{d.choiceText}</div>
                  <div className="text-[11px] text-[var(--color-text)] leading-relaxed">{d.aiResponse}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-center pb-8">
          <button onClick={() => router.push('/game')} className="btn-brush rounded-lg px-8 py-3 text-sm tracking-wider">
            继续征战
          </button>
          <button onClick={() => router.push('/connections')} className="btn-brush rounded-lg px-8 py-3 text-sm tracking-wider">
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
            className="btn-brush rounded-lg px-8 py-3 text-sm tracking-wider"
          >
            分享成就
          </button>
        </div>
      </div>
    </main>
  );
}
