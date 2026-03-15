'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/data/characters';

interface ConnectionData {
  otherCharacter: string;
  interactionCount: number;
  type: string;
  reason: string;
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

    // 模拟连接数据（实际应从服务端获取其他用户的 Agent 交互记录）
    const mockConnections: ConnectionData[] = [
      {
        otherCharacter: char.faction === '魏' ? '刘备' : '曹操',
        interactionCount: 7,
        type: 'conflict',
        reason: `你们的Agent在多个历史事件中反复交锋，从官渡到赤壁，命运交织。也许你们应该见个面，聊聊这段虚拟历史？`,
      },
      {
        otherCharacter: '诸葛亮',
        interactionCount: 5,
        type: 'diplomacy',
        reason: `你们的Agent在外交博弈中多次过招，智谋碰撞产生了精彩的火花。`,
      },
    ];
    setConnections(mockConnections);
  }, [router]);

  if (!character) return null;

  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[var(--color-gold)] text-center mb-2"
          style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
          历史缘分
        </h1>
        <p className="text-center text-sm text-[var(--color-text-dim)] mb-8">
          在历史碰撞中，你与这些人产生了深度交互
        </p>

        <div className="space-y-4 mb-8">
          {connections.map((conn, i) => (
            <div key={i} className="animate-fade-in-up card-ancient rounded-lg p-6"
              style={{ animationDelay: `${i * 0.2}s`, opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {conn.type === 'conflict' ? '⚔️' : conn.type === 'alliance' ? '🤝' : '🎭'}
                  </span>
                  <div>
                    <div className="font-bold text-[var(--color-text)]">
                      {character.name} × {conn.otherCharacter}
                    </div>
                    <div className="text-xs text-[var(--color-text-dim)]">
                      {conn.interactionCount} 次历史交互 · {
                        conn.type === 'conflict' ? '宿敌' :
                        conn.type === 'alliance' ? '盟友' : '棋逢对手'
                      }
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[rgba(212,168,83,0.15)] text-[var(--color-gold)]">
                  可连接
                </span>
              </div>

              <p className="text-sm text-[var(--color-text)] mb-4">{conn.reason}</p>

              <button className="btn-ancient rounded-lg text-sm px-6 py-2 w-full">
                邀请对方见面，聊聊这段历史
              </button>
            </div>
          ))}
        </div>

        {connections.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🏯</div>
            <p className="text-[var(--color-text-dim)]">继续推进历史，与更多Agent产生交互</p>
            <button onClick={() => router.push('/game')} className="btn-ancient rounded-lg text-sm px-6 py-3 mt-4">
              回到历史沙盒
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <button onClick={() => router.push('/game')} className="text-sm text-[var(--color-gold)] hover:underline">
            ← 回到历史沙盒
          </button>
        </div>
      </div>
    </main>
  );
}
