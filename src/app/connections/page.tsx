'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Character, characters } from '@/data/characters';
import { events } from '@/data/events';
import { GoldTitle, InkBackground, BackButton } from '@/components';

interface ConnectionData {
  otherCharacter: string;
  interactionCount: number;
  type: 'conflict' | 'alliance' | 'diplomacy';
  reason: string;
  portrait: string;
  sharedEvents: string[];
}

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

const characterPortraits: Record<string, string> = {};
characters.forEach(c => { characterPortraits[c.id] = c.portrait; });
const characterNames: Record<string, string> = {};
characters.forEach(c => { characterNames[c.id] = c.name; });

function deriveConnections(char: Character, gameState: GameState | null): ConnectionData[] {
  const completedEventIds = gameState
    ? gameState.decisions.map(d => d.eventId)
    : [];

  // Count how many events each other character shares with the player
  const interactionMap: Record<string, { count: number; events: string[]; factions: string[] }> = {};

  const relevantEvents = completedEventIds.length > 0
    ? events.filter(e => completedEventIds.includes(e.id))
    : events.slice(0, 5); // fallback: show first 5 events if no game state

  for (const event of relevantEvents) {
    for (const charId of event.involvedCharacters) {
      if (charId === char.id) continue;
      if (!interactionMap[charId]) {
        interactionMap[charId] = { count: 0, events: [], factions: [] };
      }
      interactionMap[charId].count++;
      interactionMap[charId].events.push(event.name);
      for (const f of event.involvedFactions) {
        if (!interactionMap[charId].factions.includes(f)) {
          interactionMap[charId].factions.push(f);
        }
      }
    }
  }

  // Sort by interaction count, take top connections
  const sorted = Object.entries(interactionMap)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  return sorted.map(([charId, data]) => {
    const otherChar = characters.find(c => c.id === charId);
    const isSameFaction = otherChar?.faction === char.faction;
    const isRival = !isSameFaction && data.count >= 3;

    let type: 'conflict' | 'alliance' | 'diplomacy';
    if (isRival) type = 'conflict';
    else if (isSameFaction) type = 'alliance';
    else type = 'diplomacy';

    const eventList = data.events.slice(0, 3).join('、');
    const reasons: Record<string, string> = {
      conflict: `你们在${eventList}等事件中反复交锋，命运交织。也许你们应该见个面，聊聊这段虚拟历史？`,
      alliance: `你们在${eventList}等事件中并肩作战，建立了深厚的战友情谊。`,
      diplomacy: `你们在${eventList}等事件中多次过招，智谋碰撞产生了精彩的火花。`,
    };

    return {
      otherCharacter: characterNames[charId] || charId,
      portrait: characterPortraits[charId] || '🎭',
      interactionCount: data.count,
      type,
      reason: reasons[type],
      sharedEvents: data.events,
    };
  });
}

export default function ConnectionsPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCharacter');
    if (!saved) { router.push('/character-select'); return; }
    const char = JSON.parse(saved) as Character;
    setCharacter(char);

    const savedGame = localStorage.getItem('gameState');
    const state = savedGame ? JSON.parse(savedGame) as GameState : null;
    setGameState(state);

    setConnections(deriveConnections(char, state));
  }, [router]);

  if (!character) return null;

  const typeInfo: Record<string, { icon: string; label: string; color: string }> = {
    conflict: { icon: '⚔️', label: '宿敌', color: 'var(--color-shu)' },
    alliance: { icon: '🤝', label: '盟友', color: 'var(--color-wu)' },
    diplomacy: { icon: '🎭', label: '棋逢对手', color: 'var(--color-wei)' },
  };

  return (
    <main className="min-h-screen bg-ink-wash relative">
      <InkBackground circles={[
        { position: 'top-0 right-0', size: 'w-[400px] h-[400px]', color: 'rgba(90,212,90,0.04)' },
        { position: 'bottom-0 left-0', size: 'w-[300px] h-[300px]', color: 'rgba(212,168,83,0.04)' },
      ]} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <GoldTitle className="animate-ink-reveal text-4xl tracking-[6px] mb-3">
            历史缘分
          </GoldTitle>
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
          {gameState && (
            <p className="text-[10px] text-[var(--color-text-dim)] mt-2">
              已完成 {gameState.eventsCompleted} 个历史事件 · 声望 {gameState.reputation}
            </p>
          )}
        </div>

        <div className="space-y-4 mb-10">
          {connections.map((conn, i) => {
            const info = typeInfo[conn.type] || typeInfo.diplomacy;
            return (
              <div key={i} className="animate-fade-in-up card-scroll p-6"
                style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
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

                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--color-gold)]">{conn.interactionCount}</div>
                    <div className="text-[9px] text-[var(--color-text-dim)]">缘分值</div>
                  </div>
                </div>

                {/* 共同事件标签 */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {conn.sharedEvents.map((evt, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(212,168,83,0.06)] border border-[rgba(212,168,83,0.1)] text-[var(--color-text-dim)]">
                      {evt}
                    </span>
                  ))}
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
          <BackButton href="/game" />
        </div>
      </div>
    </main>
  );
}
