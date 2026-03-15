'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/data/characters';
import { events, HistoricalEvent } from '@/data/events';
import { GoldTitle, StatCard, FactionTag } from '@/components';

interface Decision {
  eventId: string;
  eventName: string;
  choiceText: string;
  aiResponse: string;
  timestamp: string;
}

export default function GamePage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [currentEventIdx, setCurrentEventIdx] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [showEvent, setShowEvent] = useState(false);
  const [reputation, setReputation] = useState(50);
  const [military, setMilitary] = useState(50);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCharacter');
    if (!saved) { router.push('/character-select'); return; }
    setCharacter(JSON.parse(saved));
    setShowEvent(true);
  }, [router]);

  const currentEvent = events[currentEventIdx];

  async function handleChoice(choiceId: string, choiceText: string) {
    if (!character || !currentEvent || streaming) return;
    setStreaming(true);
    setStreamText('');

    const systemPrompt = `你是${character.name}，${character.title}，三国时期${character.faction}势力的核心人物。
你的性格：${character.personality}
你的风格：${character.signature}
当前声望：${reputation}/100，军力：${military}/100
请完全以${character.name}的口吻和性格回应，简洁有力，不超过150字。`;

    const message = `【${currentEvent.name}·${currentEvent.year}】
${currentEvent.description}

你选择了：${choiceText}
请以${character.name}的身份，阐述你的决策理由和下一步计划。`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, systemPrompt }),
      });

      if (!res.ok) throw new Error('Chat failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.content || parsed.text || parsed.delta?.content || data;
              if (typeof content === 'string') {
                fullText += content;
                setStreamText(fullText);
              }
            } catch {
              if (data && data !== '[DONE]') {
                fullText += data;
                setStreamText(fullText);
              }
            }
          }
        }
      }

      if (!fullText) {
        fullText = `（${character.name}沉思片刻）此计甚妙，${choiceText}正合我意。天下大势，分久必合，合久必分。吾当顺势而为。`;
        setStreamText(fullText);
      }

      const newDecision: Decision = {
        eventId: currentEvent.id,
        eventName: currentEvent.name,
        choiceText,
        aiResponse: fullText,
        timestamp: new Date().toISOString(),
      };

      setDecisions(prev => [...prev, newDecision]);

      const choice = currentEvent.choices.find(c => c.id === choiceId);
      if (choice) {
        const consequence = choice.consequence;
        if (consequence.includes('胜') || consequence.includes('强')) {
          setReputation(r => Math.min(100, r + 8));
          setMilitary(m => Math.min(100, m + 5));
        } else if (consequence.includes('败') || consequence.includes('损')) {
          setReputation(r => Math.max(0, r - 5));
          setMilitary(m => Math.max(0, m - 8));
        } else {
          setReputation(r => Math.min(100, r + 3));
        }
      }
    } catch (err) {
      console.error('Stream error:', err);
      const fallback = `（${character.name}）${choiceText}，此乃上策。`;
      setStreamText(fallback);
      setDecisions(prev => [...prev, {
        eventId: currentEvent.id,
        eventName: currentEvent.name,
        choiceText,
        aiResponse: fallback,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setStreaming(false);
    }
  }

  function nextEvent() {
    if (currentEventIdx < events.length - 1) {
      setCurrentEventIdx(i => i + 1);
      setStreamText('');
      setShowEvent(true);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goToAchievements() {
    localStorage.setItem('gameState', JSON.stringify({
      character, decisions, reputation, military,
      eventsCompleted: currentEventIdx + 1,
    }));
    router.push('/achievements');
  }

  if (!character || !currentEvent) return null;

  const progress = ((currentEventIdx + 1) / events.length) * 100;
  const typeMap: Record<string, { icon: string; label: string; color: string }> = {
    battle: { icon: '⚔️', label: '战役', color: 'var(--color-shu)' },
    diplomacy: { icon: '🤝', label: '外交', color: 'var(--color-wei)' },
    betrayal: { icon: '🗡️', label: '背叛', color: 'var(--color-qun)' },
    alliance: { icon: '🏳️', label: '联盟', color: 'var(--color-wu)' },
    internal: { icon: '📜', label: '内政', color: 'var(--color-text-dim)' },
  };
  const eventType = typeMap[currentEvent.type] || typeMap.internal;

  return (
    <main className="min-h-screen bg-ink-wash relative">
      {/* 顶部导航 */}
      <nav className="nav-glass sticky top-0 z-50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{character.portrait}</span>
            <div>
              <div className="font-bold text-[var(--color-gold)] text-sm tracking-wider">{character.name}</div>
              <div className="text-[10px] text-[var(--color-text-dim)] tracking-wider">{character.faction} · {character.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {[
              { value: reputation, label: '声望', color: 'var(--color-shu)' },
              { value: military, label: '军力', color: 'var(--color-wei)' },
              { value: decisions.length, label: '决策', color: 'var(--color-gold)' },
            ].map(stat => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} color={stat.color} />
            ))}
            <button onClick={goToAchievements}
              className="text-[11px] text-[var(--color-gold)] tracking-wider px-3 py-1.5 rounded-full border border-[rgba(212,168,83,0.2)] hover:border-[rgba(212,168,83,0.4)] hover:bg-[rgba(212,168,83,0.05)] transition-all">
              成就
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6" ref={scrollRef}>
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-[10px] text-[var(--color-text-dim)] mb-2 tracking-wider">
            <span>历史进程</span>
            <span>{currentEventIdx + 1} / {events.length}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* 当前事件 */}
        {showEvent && (
          <div className="animate-fade-in-up card-scroll p-7 mb-6">
            {/* 事件标签 */}
            <div className="flex items-center gap-2 mb-4">
              <FactionTag label={eventType.label} color={eventType.color} icon={eventType.icon} bgColor={`color-mix(in srgb, ${eventType.color} 8%, transparent)`} />
              <span className="text-[11px] text-[var(--color-text-dim)] tracking-wider">{currentEvent.year}</span>
              <FactionTag
                label={currentEvent.difficulty === 'hard' ? '困难' : currentEvent.difficulty === 'medium' ? '中等' : '简单'}
                color={currentEvent.difficulty === 'hard' ? 'var(--color-shu)' : currentEvent.difficulty === 'medium' ? 'var(--color-gold)' : 'var(--color-wu)'}
                bgColor={currentEvent.difficulty === 'hard' ? 'rgba(212,90,90,0.08)' : currentEvent.difficulty === 'medium' ? 'rgba(212,168,83,0.08)' : 'rgba(90,212,90,0.08)'}
              />
            </div>

            {/* 事件标题 */}
            <GoldTitle as="h2" className="text-2xl tracking-[3px] mb-4">
              {currentEvent.name}
            </GoldTitle>

            <div className="divider-ink mb-4" />

            <p className="text-sm text-[var(--color-text)] leading-[1.9] tracking-wider mb-6">
              {currentEvent.description}
            </p>

            {/* 决策选项 */}
            {!streamText && (
              <div className="space-y-3">
                <p className="text-[11px] text-[var(--color-text-dim)] mb-3 tracking-wider">
                  以{character.name}之名，你将如何抉择？
                </p>
                {currentEvent.choices.map((choice, i) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id, choice.text)}
                    disabled={streaming}
                    className="choice-option w-full text-left disabled:opacity-30 group"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[var(--color-gold)] opacity-40 text-sm mt-0.5 group-hover:opacity-80 transition-opacity">
                        {['壹', '贰', '叁'][i]}
                      </span>
                      <div>
                        <div className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors tracking-wider">{choice.text}</div>
                        <div className="text-[11px] text-[var(--color-text-dim)] mt-1 leading-relaxed">{choice.consequence}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Agent 回应 */}
            {streamText && (
              <div className="mt-5 card-scroll p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{character.portrait}</span>
                  <span className="text-sm font-bold text-[var(--color-gold)] tracking-wider">{character.name}</span>
                  <span className="text-[10px] text-[var(--color-text-dim)]">的决策</span>
                </div>
                <div className="divider-ink mb-3" />
                <p className={`text-sm text-[var(--color-text)] leading-[1.9] tracking-wider ${streaming ? 'streaming-cursor' : ''}`}>
                  {streamText}
                </p>
                {!streaming && (
                  <div className="mt-5 flex gap-3">
                    {currentEventIdx < events.length - 1 ? (
                      <button onClick={nextEvent} className="btn-brush rounded-lg text-sm px-8 py-2.5 tracking-wider">
                        继续推进历史
                      </button>
                    ) : (
                      <button onClick={goToAchievements} className="btn-brush rounded-lg text-sm px-8 py-2.5 tracking-wider">
                        查看最终成就
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 历史决策日志 */}
        {decisions.length > 0 && (
          <div className="mt-10">
            <h3 className="text-base font-bold text-[var(--color-gold)] mb-5 tracking-[3px]"
              style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
              {character.name}的历史轨迹
            </h3>
            <div className="space-y-3">
              {[...decisions].reverse().map((d, i) => (
                <div key={i} className="card-scroll p-4 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-[var(--color-gold)] tracking-wider">{d.eventName}</span>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-dim)] tracking-wider">决策：{d.choiceText}</div>
                  <div className="text-[11px] text-[var(--color-text)] mt-1 line-clamp-2 leading-relaxed">{d.aiResponse}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
