// 历史沙盒游戏引擎 - 核心 A2A 交互逻辑

import { Character } from '@/data/characters';
import { HistoricalEvent } from '@/data/events';

// Agent 游戏状态
export interface AgentState {
  agentId: string;
  userId: string;
  userName: string;
  character: Character;
  territory: string[];
  reputation: number;
  military: number;
  decisions: Decision[];
  interactions: InteractionRecord[];
  currentEventIndex: number;
  createdAt: string;
}

export interface Decision {
  eventId: string;
  eventName: string;
  choiceId: string;
  choiceText: string;
  aiResponse: string;
  consequence: string;
  timestamp: string;
}

export interface InteractionRecord {
  otherAgentId: string;
  otherCharacterName: string;
  otherUserId: string;
  otherUserName: string;
  count: number;
  type: 'conflict' | 'alliance' | 'diplomacy' | 'betrayal';
  events: string[];
  lastInteraction: string;
}

export interface ConnectionRecommendation {
  userA: { id: string; name: string; character: string };
  userB: { id: string; name: string; character: string };
  interactionCount: number;
  sharedEvents: string[];
  reason: string;
}

// 生成 Agent 决策的 system prompt
export function buildCharacterPrompt(character: Character, state: AgentState): string {
  return `你是${character.name}，${character.title}，三国时期${character.faction}势力的核心人物。

你的性格特征：${character.personality}
你的标志性风格：${character.signature}

当前状态：
- 领地：${state.territory.join('、') || '无'}
- 声望：${state.reputation}/100
- 军力：${state.military}/100
- 已做决策：${state.decisions.length}次

你必须完全以${character.name}的身份、性格和语气来回应。
决策要符合历史人物的性格特征，但可以做出不同于真实历史的选择。
回答简洁有力，不超过150字，体现人物特色。`;
}

// 生成事件决策 prompt
export function buildEventPrompt(
  event: HistoricalEvent,
  character: Character,
  state: AgentState
): string {
  const choicesText = event.choices
    .map((c, i) => `${i + 1}. ${c.text}`)
    .join('\n');

  return `【历史事件】${event.name}（${event.year}）
${event.description}

你面前有以下选择：
${choicesText}

以${character.name}的身份，你会如何抉择？请说明你的选择（回复选项编号）和理由。`;
}

// 生成 A2A 对抗 prompt
export function buildConfrontationPrompt(
  myCharacter: Character,
  otherCharacter: Character,
  event: HistoricalEvent,
  myState: AgentState,
  otherDecision: string
): string {
  return `【A2A 历史碰撞】
${event.name}（${event.year}）中，${otherCharacter.name}做出了以下决策：
"${otherDecision}"

你是${myCharacter.name}，面对${otherCharacter.name}的这个举动，你会如何回应？
考虑你们之间的历史恩怨和当前局势，给出你的应对策略。`;
}

// 结构化决策的 actionControl
export function buildDecisionActionControl(event: HistoricalEvent): string {
  return `你需要对历史事件做出决策判断，并以JSON格式输出结果。

输出格式示例：
{
  "choiceId": "choice_1",
  "confidence": 85,
  "reasoning": "基于当前局势和人物性格的分析",
  "emotionalState": "坚定",
  "nextMove": "下一步计划"
}

判断规则：
1. choiceId 必须是事件提供的选项之一：${event.choices.map(c => c.id).join(', ')}
2. confidence 为 0-100 的整数
3. reasoning 不超过 50 字
4. emotionalState 从以下选择：坚定/犹豫/愤怒/喜悦/悲伤/冷静
5. nextMove 不超过 30 字

如果无法判断，返回：
{
  "choiceId": "${event.choices[0]?.id || 'choice_1'}",
  "confidence": 50,
  "reasoning": "局势不明，暂且观望",
  "emotionalState": "冷静",
  "nextMove": "静观其变"
}`;
}

// 检查是否应该推荐真人连接
export function checkConnectionThreshold(interactions: InteractionRecord[]): ConnectionRecommendation[] {
  return interactions
    .filter(i => i.count >= 5)
    .map(i => ({
      userA: { id: '', name: '', character: '' }, // 由调用方填充
      userB: { id: i.otherUserId, name: i.otherUserName, character: i.otherCharacterName },
      interactionCount: i.count,
      sharedEvents: i.events,
      reason: generateConnectionReason(i),
    }));
}

function generateConnectionReason(interaction: InteractionRecord): string {
  const typeMap = {
    conflict: '在历史长河中多次交锋对抗',
    alliance: '在乱世中结为同盟，共御外敌',
    diplomacy: '在外交博弈中多次过招',
    betrayal: '经历了背叛与反转的戏剧性关系',
  };
  return `你们的Agent${typeMap[interaction.type]}，共经历了${interaction.count}次重大交互。也许你们应该见个面，聊聊这段"虚拟历史"？`;
}

// 生成历史成就卡数据
export function generateAchievementCard(state: AgentState) {
  const wins = state.decisions.filter(d => d.consequence.includes('胜')).length;
  const totalBattles = state.decisions.filter(d => d.consequence.includes('战')).length;

  return {
    characterName: state.character.name,
    characterTitle: state.character.title,
    faction: state.character.faction,
    territory: state.territory,
    reputation: state.reputation,
    military: state.military,
    totalDecisions: state.decisions.length,
    wins,
    totalBattles,
    topInteractions: state.interactions
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(i => ({
        character: i.otherCharacterName,
        count: i.count,
        type: i.type,
      })),
  };
}
