'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/data/characters';
import { events, HistoricalEvent } from '@/data/events';

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
              // 可能是纯文本
              if (data && data !== '[DONE]') {
                fullText += data;
                setStreamText(fullText);
              }
            }
          }
        }
      }

      // 如果流式没有拿到内容，用 fallback
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

      // 更新属性
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

  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6" ref={scrollRef}>
        {/* 顶部状态栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{character.portrait}</span>
            <div>
              <div className="font-bold text-[var(--color-gold)]">{character.name}</div>
              <div className="text-xs text-[var(--color-text-dim)]">{character.faction} · {character.title}</div>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-[var(--color-shu)] font-bold">{reputation}</div>
              <div className="text-xs text-[var(--color-text-dim)]">声望</div>
            </div>
            <div className="text-center">
              <div className="text-[var(--color-wei)] font-bold">{military}</div>
              <div className="text-xs text-[var(--color-text-dim)]">军力</div>
            </div>
            <div className="text-center">
              <div className="text-[var(--color-gold)] font-bold">{decisions.length}</div>
              <div className="text-xs text-[var(--color-text-dim)]">决策</div>
            </div>
          </div>
          <button onClick={goToAchievements} className="text-sm text-[var(--color-gold)] hover:underline">
            查看成就
          </button>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[var(--color-text-dim)] mb-1">
            <span>历史进程</span>
            <span>{currentEventIdx + 1} / {events.length}</span>
          </div>
          <div className="h-1.5 bg-[var(--color-dark-card)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-crimson)] to-[var(--color-gold)] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 当前事件 */}
        {showEvent && (
          <div className="animate-fade-in-up card-ancient rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                currentEvent.type === 'battle' ? 'border-[var(--color-shu)] text-[var(--color-shu)]' :
                currentEvent.type === 'diplomacy' ? 'border-[var(--color-wei)] text-[var(--color-wei)]' :
                currentEvent.type === 'betrayal' ? 'border-[var(--color-qun)] text-[var(--color-qun)]' :
                'border-[var(--color-wu)] text-[var(--color-wu)]'
              }`}>
                {currentEvent.type === 'battle' ? '⚔️ 战役' :
                 currentEvent.type === 'diplomacy' ? '🤝 外交' :
                 currentEvent.type === 'betrayal' ? '🗡️ 背叛' :
                 currentEvent.type === 'alliance' ? '🏳️ 联盟' : '📜 内政'}
              </span>
              <span className="text-xs text-[var(--color-text-dim)]">{currentEvent.year}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                currentEvent.difficulty === 'hard' ? 'bg-[rgba(196,78,78,0.2)] text-[var(--color-shu)]' :
                currentEvent.difficulty === 'medium' ? 'bg-[rgba(212,168,83,0.2)] text-[var(--color-gold)]' :
                'bg-[rgba(78,181,78,0.2)] text-[var(--color-wu)]'
              }`}>
                {currentEvent.difficulty === 'hard' ? '困难' : currentEvent.difficulty === 'medium' ? '中等' : '简单'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-[var(--color-gold)] mb-3"
              style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
              {currentEvent.name}
            </h2>
            <p className="text-sm text-[var(--color-text)] mb-6 leading-relaxed">
              {currentEvent.description}
            </p>

            {/* 决策选项 */}
            {!streamText && (
              <div className="space-y-3">
                <p className="text-xs text-[var(--color-text-dim)] mb-2">
                  以{character.name}之名，你将如何抉择？
                </p>
                {currentEvent.choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id, choice.text)}
                    disabled={streaming}
                    className="w-full text-left p-4 rounded-lg bg-[var(--color-dark-surface)] border border-[rgba(212,168,83,0.15)] hover:border-[var(--color-gold)] hover:bg-[rgba(212,168,83,0.05)] transition-all disabled:opacity-40"
                  >
                    <div className="text-sm text-[var(--color-text)]">{choice.text}</div>
                    <div className="text-xs text-[var(--color-text-dim)] mt-1">{choice.consequence}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Agent 回应（流式） */}
            {streamText && (
              <div className="mt-4 p-4 rounded-lg bg-[var(--color-dark-surface)] border border-[rgba(212,168,83,0.2)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{character.portrait}</span>
                  <span className="text-sm font-bold text-[var(--color-gold)]">{character.name}的决策</span>
                </div>
                <p className={`text-sm text-[var(--color-text)] leading-relaxed ${streaming ? 'streaming-text' : ''}`}>
                  {streamText}
                </p>
                {!streaming && (
                  <div className="mt-4 flex gap-3">
                    {currentEventIdx < events.length - 1 ? (
                      <button onClick={nextEvent} className="btn-ancient rounded-lg text-sm px-6 py-2">
                        继续推进历史 →
                      </button>
                    ) : (
                      <button onClick={goToAchievements} className="btn-ancient rounded-lg text-sm px-6 py-2">
                        查看最终成就 🏆
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
          <div className="mt-8">
            <h3 className="text-sm font-bold text-[var(--color-gold)] mb-4"
              style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
              📜 {character.name}的历史轨迹
            </h3>
            <div className="space-y-3">
              {[...decisions].reverse().map((d, i) => (
                <div key={i} className="card-ancient rounded-lg p-4 opacity-80">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[var(--color-gold)]">{d.eventName}</span>
                  </div>
                  <div className="text-xs text-[var(--color-text-dim)]">选择：{d.choiceText}</div>
                  <div className="text-xs text-[var(--color-text)] mt-1 line-clamp-2">{d.aiResponse}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
