'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { characters, Character } from '@/data/characters';

const factionColors: Record<string, string> = {
  '魏': 'var(--color-wei)',
  '蜀': 'var(--color-shu)',
  '吴': 'var(--color-wu)',
  '群雄': 'var(--color-qun)',
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
    <main className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-gold)]"
            style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            选择你的历史身份
          </h1>
          <p className="text-[var(--color-text-dim)] mt-2">你的AI分身将以此人物的身份穿越三国</p>
        </div>

        {/* 势力筛选 */}
        <div className="flex justify-center gap-3 mb-8">
          {factions.map(f => (
            <button
              key={f}
              onClick={() => setFaction(f)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                faction === f
                  ? 'bg-[var(--color-crimson)] text-[var(--color-gold)] border border-[var(--color-gold)]'
                  : 'bg-[var(--color-dark-card)] text-[var(--color-text-dim)] border border-transparent hover:border-[rgba(212,168,83,0.3)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 角色网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {filtered.map(char => (
            <button
              key={char.id}
              onClick={() => setSelected(char)}
              className={`card-ancient rounded-lg p-4 text-left transition-all hover:scale-[1.02] ${
                selected?.id === char.id
                  ? 'ring-2 ring-[var(--color-gold)] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                  : ''
              }`}
            >
              <div className="text-3xl mb-2">{char.portrait}</div>
              <div className="font-bold text-[var(--color-text)]">{char.name}</div>
              <div className="text-xs text-[var(--color-text-dim)] mb-2">{char.title}</div>
              <span
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{ color: factionColors[char.faction], borderColor: factionColors[char.faction] }}
              >
                {char.faction}
              </span>
              <div className="mt-3 grid grid-cols-2 gap-1 text-xs text-[var(--color-text-dim)]">
                <span>武 {char.attributes.military}</span>
                <span>智 {char.attributes.intelligence}</span>
                <span>政 {char.attributes.politics}</span>
                <span>魅 {char.attributes.charisma}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 选中角色详情 */}
        {selected && (
          <div className="animate-slide-down card-ancient rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{selected.portrait}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--color-gold)]">
                  {selected.name} · {selected.title}
                </h2>
                <p className="text-sm text-[var(--color-text-dim)] mt-1 mb-3">{selected.bio}</p>
                <p className="text-sm text-[var(--color-text)] italic">
                  「{selected.signature}」
                </p>
                <div className="mt-3 flex gap-4 text-sm">
                  <span>武力 <span className="text-[var(--color-shu)]">{selected.attributes.military}</span></span>
                  <span>智力 <span className="text-[var(--color-wei)]">{selected.attributes.intelligence}</span></span>
                  <span>政治 <span className="text-[var(--color-wu)]">{selected.attributes.politics}</span></span>
                  <span>魅力 <span className="text-[var(--color-gold)]">{selected.attributes.charisma}</span></span>
                </div>
                <div className="mt-2 text-xs text-[var(--color-text-dim)]">
                  初始领地：{selected.territory.join('、')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 确认按钮 */}
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`btn-ancient rounded-lg text-lg px-12 py-4 ${
              !selected ? 'opacity-40 cursor-not-allowed' : 'animate-pulse-glow'
            }`}
          >
            {selected ? `以${selected.name}之名，进入三国` : '请选择一位历史人物'}
          </button>
        </div>
      </div>
    </main>
  );
}
