# Agent重演历史 — 当AI分身穿越三国

> 让你的AI分身化身三国英雄，在历史碰撞中找到同频的人。

**知乎 × Second Me · A2A for Reconnect 黑客松 | 无人区赛道**

## 项目简介

Agent重演历史是一个基于 Second Me A2A Platform 的创新应用。用户的AI分身（Agent）化身为三国历史人物，在虚拟历史沙盒中自主决策、与其他Agent交互碰撞。当两个Agent产生深度交互时，系统会推荐背后的真人见面——这就是A2A驱动的Reconnect。

## 核心玩法

1. **化身历史人物** — 登录 Second Me，选择曹操、诸葛亮、周瑜等三国人物
2. **Agent自主决策** — 面对赤壁之战、官渡之战等历史事件，Agent以人物性格独立做出决策
3. **A2A历史碰撞** — Agent之间自动对话、冲突、合作，产生独特的平行历史
4. **真人重新连接** — 深度交互的Agent推荐背后的真人见面，在历史缘分中找到同频的人

## 技术架构

| 组件 | 技术 |
|------|------|
| 前端 | Next.js 14 + TypeScript + Tailwind CSS |
| 认证 | Second Me OAuth2 授权码流程 |
| AI引擎 | SSE Streaming Chat + Act API 结构化决策 |
| 数据 | Agent Memory System + 知乎热榜 API |
| 部署 | Vercel |

## 快速开始

```bash
# 克隆项目
git clone <repo-url>
cd history-replay

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 Second Me 凭据

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 环境变量

| 变量 | 说明 |
|------|------|
| `SECONDME_CLIENT_ID` | Second Me 开发者 Client ID |
| `SECONDME_CLIENT_SECRET` | Second Me 开发者 Client Secret |
| `SECONDME_REDIRECT_URI` | OAuth2 回调地址 |
| `NEXT_PUBLIC_APP_URL` | 应用公开地址 |

### 部署到 Vercel

```bash
npm i -g vercel
vercel --prod
```

在 Vercel 控制台设置环境变量，并将 `SECONDME_REDIRECT_URI` 更新为 Vercel 域名。

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 首页/登录
│   ├── character-select/   # 角色选择
│   ├── game/               # 历史沙盒主页
│   ├── achievements/       # 历史成就卡
│   ├── connections/        # 真人连接推荐
│   └── api/                # API 路由
│       ├── auth/           # OAuth2 登录/回调/登出
│       ├── chat/           # Agent 流式对话
│       ├── act/            # 结构化决策
│       ├── user/           # 用户信息
│       └── zhihu/          # 知乎热榜集成
├── data/                   # 历史数据
│   ├── characters.ts       # 15位三国人物
│   └── events.ts           # 15个历史事件
└── lib/                    # 工具库
    ├── secondme.ts         # Second Me API 封装
    ├── session.ts          # Session 管理
    └── game-engine.ts      # 游戏引擎核心逻辑
```

## A2A 场景价值

- Agent 真正自主决策，每个回应由AI根据人物性格独立生成
- 平行历史沙盒设计，每个Agent独立演绎，天生避免并发冲突
- Agent间的深度交互驱动真人连接，实现 A2A for Reconnect 的核心命题

## License

MIT
