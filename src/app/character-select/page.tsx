'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { characters, Character } from '@/data/characters';
import { GoldTitle, InkBackground } from '@/components';

const factionColors: Record<string, string> = {
  '魏': 'var(--color-wei)',
  '蜀': 'var(--color-shu)',
  '吴': 'var(--color-wu)',
  '群雄': 'var(--color-qun)',
};

const factionBg: Record<string, string> = {
  '魏': 'rgba(90,159,212,0.08)',
  '蜀': 'rgba(212,90,90,0.08)',
  '吴': 'rgba(90,212,90,0.08)',
  '群雄': 'rgba(212,192,90,0.08)',
};

export default function CharacterSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Character | null>(null);
  const [faction, setFaction] = useState<string>('全部');

  const factions = ['全部', '魏', '蜀', '吴', '群雄'];
  const filtered = faction === '全部' ? characters : characters.filter(c => c.faction === faction);

  function handleConfirm() {
    if (!selected) return;
    localStorage.setItem('selectedCharacter', JSON.stringify(selected));
    router.push('/game');
  }

  return (
    <main className="min-h-screen bg-ink-wash relative">
      <InkBackground circles={[
        { position: 'top-0 right-0', size: 'w-[400px] h-[400px]', color: 'rgba(139,26,26,0.06)' },
        { position: 'bottom-0 left-0', size: 'w-[300px] h-[300px]', color: 'rgba(90,159,212,0.04)' },
      ]} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* 标题区 */}
        <div className="text-center mb-10">
          <GoldTitle className="animate-ink-reveal text-4xl md:text-5xl tracking-[6px] mb-3">
            择主而事
          </GoldTitle>
          <p className="text-[var(--color-text-dim)] text-sm tracking-[3px]">你的AI分身将以此人物的身份穿越三国</p>
        </div>

        {/* 势力筛选 */}
        <div className="flex justify-center gap-2 mb-10">
          {factions.map(f => (
            <button
              key={f}
              onClick={() => setFaction(f)}
              className={`px-5 py-2 rounded-full text-sm tracking-wider transition-all duration-300 ${
                faction === f
                  ? 'bg-[var(--color-crimson)] text-[var(--color-gold)] shadow-[0_0_16px_rgba(139,26,26,0.4)]'
                  : 'bg-[rgba(20,20,34,0.6)] text-[var(--color-text-dim)] border border-[rgba(212,168,83,0.08)] hover:border-[rgba(212,168,83,0.2)] hover:text-[var(--color-text)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 角色网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {filtered.map((char, i) => (
            <button
              key={char.id}
              onClick={() => setSelected(char)}
              className={`card-character p-5 text-left animate-fade-in-up ${
                selected?.id === char.id ? 'selected' : ''
              }`}
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
            >
              {/* 阵营色条 */}
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl opacity-60"
                style={{ background: factionColors[char.faction] }} />

              <div className="text-3xl mb-3 ml-1">{char.portrait}</div>
              <div className="font-bold text-[var(--color-text)] text-base ml-1">{char.name}</div>
              <div className="text-xs text-[var(--color-text-dim)] mb-3 ml-1">{char.title}</div>

              <span className="tag-ancient ml-1"
                style={{ color: factionColors[char.faction], borderColor: factionColors[char.faction], background: factionBg[char.faction] }}>
                {char.faction}
              </span>

              {/* 属性条 */}
              <div className="mt-4 space-y-2 ml-1">
                {[
                  { label: '武', value: char.attributes.military, color: 'var(--color-shu)' },
                  { label: '智', value: char.attributes.intelligence, color: 'var(--color-wei)' },
                  { label: '政', value: char.attributes.politics, color: 'var(--color-wu)' },
                  { label: '魅', value: char.attributes.charisma, color: 'var(--color-gold)' },
                ].map(attr => (
                  <div key={attr.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--color-text-dim)] w-3">{attr.label}</span>
                    <div className="attr-bar flex-1">
                      <div className="attr-bar-fill" style={{ width: `${attr.value}%`, background: attr.color }} />
                    </div>
                    <span className="text-[10px] w-5 text-right" style={{ color: attr.color }}>{attr.value}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* 选中角色详情 */}
        {selected && (
          <div className="animate-slide-reveal card-scroll p-8 mb-10 max-w-2xl mx-auto">
            <div className="flex items-start gap-6">
              <div className="text-6xl animate-float-slow flex-shrink-0">{selected.portrait}</div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold animate-shimmer mb-1"
                  style={{ fontFamily: "'Ma Shan Zheng', cursive", letterSpacing: '3px' }}>
                  {selected.name} · {selected.title}
                </h2>
                <p className="text-sm text-[var(--color-text-dim)] leading-relaxed mb-4">{selected.bio}</p>

                <div className="card-scroll p-3 mb-4 text-center">
                  <p className="text-sm text-[var(--color-text)] italic tracking-wider">
                    <span className="text-[var(--color-gold)] opacity-40">「</span>
                    {selected.signature}
                    <span className="text-[var(--color-gold)] opacity-40">」</span>
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3">
                  {[
                    { label: '武力', value: selected.attributes.military, color: 'var(--color-shu)' },
                    { label: '智力', value: selected.attributes.intelligence, color: 'var(--color-wei)' },
                    { label: '政治', value: selected.attributes.politics, color: 'var(--color-wu)' },
                    { label: '魅力', value: selected.attributes.charisma, color: 'var(--color-gold)' },
                  ].map(attr => (
                    <div key={attr.label} className="text-center">
                      <div className="text-xl font-bold" style={{ color: attr.color }}>{attr.value}</div>
                      <div className="text-[10px] text-[var(--color-text-dim)] tracking-wider">{attr.label}</div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-[var(--color-text-dim)]">
                  <span className="text-[var(--color-gold)] opacity-60">初始领地</span>
                  <span className="mx-2 opacity-30">|</span>
                  {selected.territory.join('、')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 确认按钮 */}
        <div className="text-center pb-8">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`btn-brush rounded-lg text-lg px-14 py-4 tracking-[3px] ${
              !selected ? 'opacity-30 cursor-not-allowed' : 'animate-breath'
            }`}
          >
            {selected ? `以${selected.name}之名，进入三国` : '请选择一位历史人物'}
          </button>
        </div>
      </div>
    </main>
  );
}
