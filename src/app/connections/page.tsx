'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/data/characters';

interface ConnectionData {
  otherCharacter: string;
  interactionCount: number;
  type: string;
  reason: string;
  portrait: string;
}

export default function ConnectionsPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [connections, setConnections] = useState<ConnectionData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCharacter');
    if (!saved) { router.push('/character-select'); return; }
    const char = JSON.parse(saved);
    setCharacter(char);

    const mockConnections: ConnectionData[] = [
      {
        otherCharacter: char.faction === '魏' ? '刘备' : '曹操',
        portrait: char.faction === '魏' ? '🐉' : '👑',
        interactionCount: 7,
        type: 'conflict',
        reason: `你们的Agent在多个历史事件中反复交锋，从官渡到赤壁，命运交织。也许你们应该见个面，聊聊这段虚拟历史？`,
      },
      {
        otherCharacter: '诸葛亮',
        portrait: '🪶',
        interactionCount: 5,
        type: 'diplomacy',
        reason: `你们的Agent在外交博弈中多次过招，智谋碰撞产生了精彩的火花。`,
      },
      {
        otherCharacter: '周瑜',
        portrait: '🎵',
        interactionCount: 3,
        type: 'alliance',
        reason: `赤壁之战中你们的Agent并肩作战，建立了深厚的战友情谊。`,
      },
    ];
    setConnections(mockConnections);
  }, [router]);

  if (!character) return null;

  const typeInfo: Record<string, { icon: string; label: string; color: string }> = {
    conflict: { icon: '⚔️', label: '宿敌', color: 'var(--color-shu)' },
    alliance: { icon: '🤝', label: '盟友', color: 'var(--color-wu)' },
    diplomacy: { icon: '🎭', label: '棋逢对手', color: 'var(--color-wei)' },
  };

  return (
    <main className="min-h-screen bg-ink-wash relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(90,212,90,0.04)_0%,transparent_60%)]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.04)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="animate-ink-reveal text-4xl font-bold tracking-[6px] mb-3"
            style={{
              fontFamily: "'Ma Shan Zheng', cursive",
              background: 'linear-gradient(180deg, #f0d890, #d4a853)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
            历史缘分
          </h1>
          <p className="text-[var(--color-text-dim)] text-sm tracking-[3px]">
            在历史碰撞中，你与这些人产生了深度交互
          </p>
        </div>

        {/* 连接说明 */}
        <div className="card-scroll p-5 mb-8 text-center">
          <p className="text-[11px] text-[var(--color-text-dim)] leading-relaxed tracking-wider">
            当两个Agent在历史事件中产生深度交互时，系统会推荐背后的真人见面
            <br />
            <span className="text-[var(--color-gold)]">这就是 A2A 驱动的 Reconnect</span>
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {connections.map((conn, i) => {
            const info = typeInfo[conn.type] || typeInfo.diplomacy;
            return (
              <div key={i} className="animate-fade-in-up card-scroll p-6"
                style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* 双头像 */}
                    <div className="flex items-center">
                      <span className="text-3xl">{character.portrait}</span>
                      <span className="text-lg mx-1 text-[var(--color-gold)] opacity-40">{info.icon}</span>
                      <span className="text-3xl">{conn.portrait}</span>
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-text)] text-sm tracking-wider">
                        {character.name} × {conn.otherCharacter}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="tag-ancient" style={{ color: info.color, borderColor: info.color }}>
                          {info.label}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-dim)]">
                          {conn.interactionCount} 次历史交互
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 交互强度 */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--color-gold)]">{conn.interactionCount}</div>
                    <div className="text-[9px] text-[var(--color-text-dim)]">缘分值</div>
                  </div>
                </div>

                <div className="divider-ink mb-4" />

                <p className="text-[12px] text-[var(--color-text)] leading-relaxed tracking-wider mb-5">{conn.reason}</p>

                <button className="btn-brush rounded-lg text-sm px-6 py-2.5 w-full tracking-[2px]">
                  邀请对方见面，聊聊这段历史
                </button>
              </div>
            );
          })}
        </div>

        {connections.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-5 animate-float-slow">🏯</div>
            <p className="text-[var(--color-text-dim)] tracking-wider mb-5">继续推进历史，与更多Agent产生交互</p>
            <button onClick={() => router.push('/game')} className="btn-brush rounded-lg text-sm px-8 py-3 tracking-wider">
              回到历史沙盒
            </button>
          </div>
        )}

        <div className="text-center mt-6 pb-8">
          <button onClick={() => router.push('/game')}
            className="text-[11px] text-[var(--color-gold)] tracking-wider hover:opacity-70 transition-opacity">
            ← 回到历史沙盒
          </button>
        </div>
      </div>
    </main>
  );
}
