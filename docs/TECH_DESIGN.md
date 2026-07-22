# 健身教练 CRM - 技术方案详细设计

> 版本: v1.0
> 日期: 2026-07-12
> 状态: 初稿

---

## 一、技术栈选型

### 1.1 前端

| 层 | 技术 | 理由 |
|----|------|------|
| Web 管理后台 | Next.js 15 (App Router) + React 19 + TypeScript | SSR/SSG 利于 SEO，App Router 路由灵活，TypeScript 保证类型安全 |
| 移动端 App | React Native (Expo) | 一套代码覆盖 iOS/Android，教练和学员都需要手机端 |
| UI 组件库 | shadcn/ui + Tailwind CSS | 零运行时、高度可定制、与 Next.js 无缝集成 |
| 状态管理 | Zustand | 轻量、无 boilerplate，适合中小应用 |
| 表单处理 | React Hook Form + Zod | 类型安全的表单验证 |

### 1.2 后端

| 层 | 技术 | 理由 |
|----|------|------|
| API | Next.js Route Handlers (API Routes) | 前后端同仓，减少部署复杂度 |
| 数据库 | PostgreSQL (via Supabase) | 关系型数据完美匹配 CRM 场景，Supabase 自带 Auth + Realtime |
| ORM | Drizzle ORM | 轻量、类型安全、SQL-like 语法，比 Prisma 更快更灵活 |
| 认证 | Supabase Auth | 内置 JWT、OAuth、MFA，支持手机号/邮箱/微信登录 |
| 文件存储 | Supabase Storage | 学员照片、训练计划 PDF 等 |
| 实时通信 | Supabase Realtime (WebSocket) | 学员进度更新、消息通知实时推送 |
| 任务队列 | Upstash Redis Queue | 异步任务：续费提醒、进度报告、AI 生成 |

### 1.3 AI 服务

| 用途 | 模型 | 理由 |
|------|------|------|
| 训练计划生成 | OpenAI GPT-4o-mini | 性价比高，推理能力强，.15/M tokens |
| 饮食建议 | GPT-4o-mini | 同上 |
| 智能客服 | GPT-4o-mini + RAG | 基于教练预设的知识库回答 |
| 内容生成 | GPT-4o-mini | 学员进度报告自动生成 |

### 1.4 基础设施

| 层 | 技术 | 理由 |
|----|------|------|
| 部署 | Vercel (前端+API) + Supabase (DB+Auth) | 零运维，自动 HTTPS，全球 CDN |
| 监控 | Sentry | 错误追踪 + 性能监控 |
| 分析 | PostHog (开源) | 用户行为分析，免费版够用 |
| CI/CD | GitHub Actions | 自动测试 + 部署 |

### 1.5 成本估算（月度）

| 项目 | 免费版 | 付费版 | 说明 |
|------|--------|--------|------|
| Vercel |  |  | Hobby -> Pro，1000+ MAU 后考虑 |
| Supabase |  |  | 5 万行数据以内免费 |
| OpenAI API |  (1000次) | -50 | 取决于 AI 调用频率 |
| Upstash Redis |  |  | 队列 + 缓存 |
| Sentry |  |  | 免费版 5K events/月 |
| **合计** | **** | **-120** | 起步几乎零成本 |

---

## 二、数据库 Schema 设计

### 2.1 ER 图概览

profiles (用户档案) -> coachee_programs (学员分配) -> programs (训练计划)
programs -> program_weeks (周) -> program_days (天) -> exercise_sets (动作组)
exercises (动作库) -> exercise_sets
coachee_programs -> workout_logs (训练日志) -> session_data (JSONB)
coachee_programs -> body_measurements (体测数据)
coachee_programs -> messages (消息)
coachee_programs -> payments (支付记录)
profiles (user_id) -> notifications (通知)

### 2.2 核心表说明

profiles: 用户档案，role 区分 coach/coachee，教练和学员各有专属字段
programs: 训练计划，关联教练，支持 AI 生成标记
program_weeks: 计划的周安排，每个计划 4-12 周
program_days: 每周每天的训练安排，区分训练日和休息日
exercises: 全局动作库，预置 200+ 常见健身动作，支持分类/肌群/器材标签
exercise_sets: 每个训练日的具体组数、次数、重量
coachee_programs: 教练给学员分配计划，支持状态管理
workout_logs: 学员每次训练的实际完成记录，session_data 用 JSONB 存储每组详情
body_measurements: 体测数据，含围度和照片 URL
payments: 支付记录，关联 Stripe
messages: 教练-学员消息
notifications: 系统通知

---

## 三、API 接口设计

### 3.1 认证相关

| 方法 | 路径 | 描述 | Auth |
|------|------|------|------|
| POST | /auth/register | 注册（邮箱/手机） | 否 |
| POST | /auth/login | 登录 | 否 |
| POST | /auth/refresh | 刷新 Token | 否 |
| POST | /auth/logout | 登出 | 是 |
| GET | /auth/me | 获取当前用户 | 是 |

### 3.2 教练端 API

| 方法 | 路径 | 描述 | Auth |
|------|------|------|------|
| GET | /coaches/profile | 获取教练资料 | 是 |
| PUT | /coaches/profile | 更新教练资料 | 是 |
| GET | /coaches/coachees | 获取学员列表（分页） | 是 |
| GET | /coaches/coachees/:id | 获取单个学员详情 | 是 |
| PUT | /coaches/coachees/:id | 更新学员信息 | 是 |
| DELETE | /coaches/coachees/:id | 移除学员 | 是 |

### 3.3 训练计划 API

| 方法 | 路径 | 描述 | Auth |
|------|------|------|------|
| GET | /programs | 获取我的计划列表 | 是 |
| POST | /programs | 创建新计划 | 是 |
| GET | /programs/:id | 获取计划详情 | 是 |
| PUT | /programs/:id | 更新计划 | 是 |
| DELETE | /programs/:id | 删除计划 | 是 |
| POST | /programs/:id/clone | 克隆计划为模板 | 是 |
| POST | /programs/ai/generate | AI 生成训练计划 | 是 |
| GET | /exercises | 获取动作库（搜索） | 是 |
| POST | /exercises | 添加自定义动作 | 是 |

### 3.4 学员端 API

| 方法 | 路径 | 描述 | Auth |
|------|------|------|------|
| GET | /coachees/program | 获取当前训练计划 | 是 |
| POST | /coachees/workout-log | 提交训练日志 | 是 |
| GET | /coachees/workout-logs | 获取训练历史 | 是 |
| POST | /coachees/body-measurements | 记录体测数据 | 是 |
| GET | /coachees/body-measurements | 获取体测历史 | 是 |
| GET | /coachees/progress-chart | 获取进度图表数据 | 是 |
| POST | /coachees/messages/send | 发送消息给教练 | 是 |
| GET | /coachees/messages | 获取聊天记录 | 是 |

### 3.5 支付 API

| 方法 | 路径 | 描述 | Auth |
|------|------|------|------|
| POST | /payments/create-subscription | 创建订阅 | 是 |
| POST | /payments/cancel-subscription | 取消订阅 | 是 |
| GET | /payments/history | 支付记录 | 是 |
| POST | /payments/webhook | Stripe 回调 | 否（签名验证） |

### 3.6 通知 API

| 方法 | 路径 | 描述 | Auth |
|------|------|------|------|
| GET | /notifications | 获取通知列表 | 是 |
| PUT | /notifications/:id/read | 标记已读 | 是 |
| PUT | /notifications/read-all | 全部已读 | 是 |
| GET | /notifications/unread-count | 未读数量 | 是 |

---

## 四、AI 训练计划生成模块

### 4.1 核心 Prompt 设计

SYSTEM PROMPT:
你是专业的健身教练助手。根据以下信息，为用户生成一份科学、渐进式的训练计划。

要求：
1. 每周安排 4-6 天训练，合理安排休息日
2. 每个训练日包含 6-10 个动作
3. 每组标注建议的组数、次数、重量（kg）
4. 遵循渐进超负荷原则：每 2 周适当增加重量或次数
5. 动作选择要均衡，覆盖全身主要肌群
6. 根据用户的训练水平调整难度
7. 输出格式为 JSON，不要包含其他文字

可用动作库分类：
- 胸：卧推、飞鸟、俯卧撑、双杠臂屈伸...
- 背：引体向上、划船、高位下拉...
- 腿：深蹲、硬拉、腿举、箭步蹲...
- 肩：推举、侧平举、前平举、俯身飞鸟...
- 手臂：弯举、颈后臂屈伸、锤式弯举...
- 核心：平板支撑、卷腹、俄罗斯转体...

### 4.2 AI 调用流程

教练填写训练参数 -> 构建 Prompt + 上下文 -> 调用 GPT-4o-mini API -> 解析响应 + 验证 -> 保存为计划 -> 教练预览/编辑

### 4.3 AI 响应格式

interface AIProgramResponse {
  program: {
    name: string;
    duration_weeks: number;
    weeks: {
      week_number: number;
      focus_area: string;
      days: {
        day_of_week: number;
        rest_day: boolean;
        session_type: string;
        exercises: {
          exercise_id: string;
          sets_count: number;
          reps_per_set: number;
          weight_kg: number | null;
          rest_seconds: number;
          notes: string;
        }[];
      }[];
    }[];
  };
  coaching_notes: string;
}

### 4.4 成本估算

每次 AI 生成：
- 输入 Token: ~800 tokens
- 输出 Token: ~2000 tokens
- 单价: .15 / 1M input tokens, .60 / 1M output tokens
- 单次成本: (800 * .15 + 2000 * .60) / 1,000,000 = .0013

假设 1000 个教练，每人每月生成 4 次：
- 月调用: 4,000 次
- 月成本: .20

结论: AI 成本极低，几乎可以忽略不计

---

## 五、前端页面设计

### 5.1 教练端页面结构

教练 Dashboard
+-- 首页 (Dashboard)
|   +-- 今日训练安排概览
|   +-- 待跟进学员列表
|   +-- 本月收入统计
|   +-- 快速操作入口
|
+-- 学员管理 (Coachees)
|   +-- 学员列表（搜索/筛选）
|   +-- 学员详情
|   |   +-- 基本信息
|   |   +-- 训练历史
|   |   +-- 体测数据趋势图
|   |   +-- 消息记录
|   |   +-- 支付记录
|   +-- 添加新学员
|
+-- 训练计划 (Programs)
|   +-- 我的计划列表
|   +-- 创建新计划
|   |   +-- AI 生成
|   |   +-- 手动创建
|   +-- 计划编辑器
|   |   +-- 周视图
|   |   +-- 动作库搜索
|   |   +-- 拖拽调整
|   +-- 计划模板库
|
+-- 消息 (Messages)
|   +-- 对话列表
|   +-- 聊天窗口
|
+-- 收入 (Payments)
|   +-- 本月收入概览
|   +-- 支付记录
|   +-- 续费提醒管理
|
+-- 设置 (Settings)
    +-- 个人资料
    +-- 订阅管理
    +-- 通知偏好
    +-- API Keys

### 5.2 学员端页面结构

学员 App
+-- 今日训练
|   +-- 今天的训练计划
|   +-- 动作演示视频
|   +-- 训练完成打卡
|
+-- 训练历史
|   +-- 按日期查看
|   +-- 重量趋势图
|   +-- PR（个人纪录）记录
|
+-- 身体数据
|   +-- 体重/体脂趋势图
|   +-- 围度变化
|   +-- 照片对比
|
+-- 消息
|   +-- 与教练对话
|   +-- 系统通知
|
+-- 我的
    +-- 个人信息
    +-- 订阅状态
    +-- 设置

---

## 六、用户角色和权限体系

### 6.1 角色定义

| 角色 | 描述 | 典型用户 |
|------|------|----------|
| Coach (管理员) | 教练本人，拥有所有权限 | 健身教练 |
| Coachee (学员) | 被训练的学员 | 健身爱好者 |
| Coach Assistant | 助理教练（可选） | 大型工作室 |

### 6.2 权限矩阵

| 功能 | Coach | Coachee |
|------|-------|---------|
| 查看/编辑自己的资料 | 是 | 是 |
| 管理学员列表 | 是 | 否 |
| 创建/编辑训练计划 | 是 | 否 |
| 查看学员训练日志 | 是 | 是（自己的） |
| 提交训练日志 | 否 | 是 |
| 记录体测数据 | 否 | 是 |
| 与学员发消息 | 是 | 是 |
| 查看收入 | 是 | 否 |
| 管理订阅 | 是 | 是（自己的） |
| AI 生成计划 | 是 | 否 |

### 6.3 Supabase RLS 策略

所有表启用 Row Level Security (RLS)：
- 教练只能查看/编辑自己的学员数据
- 学员只能查看自己的训练日志和体测数据
- 教练可以查看所有学员的数据
- 消息表：双方只能看到彼此的对话
- 支付表：教练看收入，学员看自己的订阅

---

## 七、项目目录结构

fitness-coach-crm/
+-- docs/
|   +-- TECH_DESIGN.md          # 本文档
|   +-- API_SPEC.md             # 详细 API 文档
|   +-- DEPLOYMENT.md           # 部署指南
|
+-- src/
|   +-- app/                    # Next.js App Router
|   |   +-- (auth)/             # 认证路由组
|   |   |   +-- login/
|   |   |   +-- register/
|   |   |   +-- layout.tsx
|   |   +-- (coach)/            # 教练端路由组
|   |   |   +-- dashboard/
|   |   |   +-- coachees/
|   |   |   +-- programs/
|   |   |   +-- messages/
|   |   |   +-- payments/
|   |   |   +-- settings/
|   |   |   +-- layout.tsx
|   |   +-- (coachee)/          # 学员端路由组
|   |   |   +-- today-workout/
|   |   |   +-- history/
|   |   |   +-- body-data/
|   |   |   +-- messages/
|   |   |   +-- layout.tsx
|   |   +-- api/                # API Routes
|   |   |   +-- auth/
|   |   |   +-- coaches/
|   |   |   +-- programs/
|   |   |   +-- ai/
|   |   |   +-- payments/
|   |   +-- globals.css
|   |   +-- layout.tsx
|   |   +-- page.tsx
|   |
|   +-- components/             # React 组件
|   |   +-- ui/                 # 基础 UI 组件 (shadcn)
|   |   +-- coach/              # 教练端组件
|   |   |   +-- CoachDashboard.tsx
|   |   |   +-- CoacheeList.tsx
|   |   |   +-- ProgramEditor.tsx
|   |   |   +-- AIProgramGenerator.tsx
|   |   |   +-- PaymentOverview.tsx
|   |   +-- coachee/            # 学员端组件
|   |   |   +-- TodayWorkout.tsx
|   |   |   +-- WorkoutLog.tsx
|   |   |   +-- ProgressChart.tsx
|   |   |   +-- BodyMeasurements.tsx
|   |   +-- shared/             # 共享组件
|   |   |   +-- ExerciseCard.tsx
|   |   |   +-- MessageBubble.tsx
|   |   |   +-- NotificationBell.tsx
|   |   |   +-- DataTable.tsx
|   |   +-- layout/             # 布局组件
|   |       +-- Sidebar.tsx
|   |       +-- Header.tsx
|   |       +-- MobileNav.tsx
|   |
|   +-- lib/                    # 工具函数
|   |   +-- db/                 # 数据库
|   |   |   +-- schema.ts       # Drizzle schema
|   |   |   +-- queries.ts      # 数据库查询
|   |   |   +-- seed.ts         # 种子数据
|   |   +-- ai/                 # AI 服务
|   |   |   +-- program-generator.ts
|   |   |   +-- diet-suggestion.ts
|   |   |   +-- types.ts
|   |   +-- payments/           # 支付
|   |   |   +-- stripe.ts
|   |   |   +-- subscriptions.ts
|   |   |   +-- webhook.ts
|   |   +-- auth/               # 认证
|   |   |   +-- middleware.ts
|   |   |   +-- guards.ts
|   |   +-- utils.ts            # 通用工具
|   |
|   +-- hooks/                  # 自定义 Hooks
|   |   +-- useAuth.ts
|   |   +-- useCoachees.ts
|   |   +-- usePrograms.ts
|   |   +-- useMessages.ts
|   |   +-- useAI.ts
|   |
|   +-- stores/                 # Zustand stores
|   |   +-- authStore.ts
|   |   +-- uiStore.ts
|   |   +-- notificationStore.ts
|   |
|   +-- types/                  # TypeScript 类型
|   |   +-- index.ts
|   |   +-- coach.ts
|   |   +-- coachee.ts
|   |   +-- program.ts
|   |   +-- payment.ts
|   |
|   +-- styles/                 # 样式
|       +-- themes.ts
|
+-- supabase/                   # Supabase 配置
|   +-- migrations/             # 数据库迁移
|   |   +-- 001_create_profiles.sql
|   |   +-- 002_create_programs.sql
|   |   +-- 003_create_exercises.sql
|   |   +-- 004_create_coachee_programs.sql
|   |   +-- 005_create_workout_logs.sql
|   |   +-- 006_create_body_measurements.sql
|   |   +-- 007_create_payments.sql
|   |   +-- 008_create_messages.sql
|   |   +-- 009_create_notifications.sql
|   +-- seed/                   # 种子数据
|       +-- exercises.sql
|
+-- __tests__/                  # 测试
|   +-- unit/
|   +-- integration/
|   +-- e2e/
|
+-- .env.local                  # 环境变量
+-- .env.example                # 环境变量模板
+-- next.config.js
+-- drizzle.config.ts
+-- tailwind.config.ts
+-- tsconfig.json
+-- package.json
+-- README.md

---

## 八、关键实现细节

### 8.1 训练计划编辑器（核心功能）

关键交互：
- 周视图：水平排列一周 7 天，训练日用蓝色边框，休息日用灰色背景
- 拖拽排序：使用 @hello-pangea/dnd 实现动作和天的拖拽排序
- AI 调整：点击按钮，AI 根据当前计划生成优化建议
- 动作库搜索：实时搜索 200+ 动作，按类别/肌群/器材筛选
- 实时保存：编辑时防抖 500ms 自动保存到数据库

### 8.2 AI 训练计划生成器

输入参数：
- 训练目标：增肌 / 减脂 / 力量 / 塑形 / 康复
- 训练水平：新手（0-6月）/ 中级（6月-2年）/ 高级（2年+）
- 每周训练天数：3-7 天
- 可用器材：哑铃 / 杠铃 / 器械 / 弹力带 / 自重 / 单杠
- 伤病史：自由文本，用于排除危险动作
- 个性化备注：教练的自由输入

输出：完整的 N 周训练计划，包含每周每天的每个动作的组数、次数、重量

### 8.3 学员端今日训练

关键交互：
- 显示今天的训练计划，包含每个动作的视频演示
- 每完成一组，勾选完成，输入实际重量和次数
- 训练完成后，一键提交日志
- 自动记录 PR（个人纪录）
- 训练结束后显示简要总结

---

## 九、部署架构

流量走向：
用户 -> Vercel CDN (Global Edge)
         |
         +-> Next.js App (React SSR)
         +-> API Routes (Node.js)
         +-> Static Assets (CSS/JS/IMG)
         |
         +-> Supabase
             +-- PostgreSQL (Database)
             +-- Auth (JWT/OAuth)
             +-- Storage (Photos)
             +-- Realtime (WebSocket)
         |
         +-> Stripe (Payments)
         +-> OpenAI API (AI Model)

---

## 十、开发路线图

### Phase 1: MVP (Week 1-4)

| 周 | 任务 | 交付物 |
|----|------|--------|
| W1 | 项目初始化 + 数据库 Schema + Auth | 可注册的 Web 应用 |
| W2 | 教练 Dashboard + 学员管理 | 教练可 CRUD 学员 |
| W3 | 训练计划 CRUD + 动作库 | 教练可创建/编辑计划 |
| W4 | 学员端基础 + 训练日志 | 学员可查看计划+打卡 |

### Phase 2: 核心功能 (Week 5-8)

| 周 | 任务 | 交付物 |
|----|------|--------|
| W5 | AI 训练计划生成器 | 教练可用 AI 生成计划 |
| W6 | 支付集成 (Stripe) | 教练可收费、学员可订阅 |
| W7 | 消息系统 | 教练-学员实时聊天 |
| W8 | 体测数据 + 进度图表 | 可视化进度追踪 |

### Phase 3: 完善 (Week 9-12)

| 周 | 任务 | 交付物 |
|----|------|--------|
| W9 | 通知系统 | 续费提醒、训练提醒 |
| W10 | React Native App | 移动端原生体验 |
| W11 | 性能优化 + 测试 | 加载速度 < 2s |
| W12 | Beta 发布 + 用户反馈 | 100 个种子用户 |

---

## 十一、环境变量

# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# OpenAI
OPENAI_API_KEY=sk-proj-xxx

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

---

## 十二、安全要点

1. Supabase RLS: 所有表启用行级安全，教练只能访问自己的学员数据
2. API 中间件: 验证 JWT token，检查角色权限
3. 输入验证: 所有 API 输入用 Zod 校验
4. CSRF 防护: Next.js 默认防护
5. Rate Limiting: API 限流（Upstash Redis）
6. 文件上传: 限制文件大小（5MB）、类型（图片/视频）
7. Stripe 签名验证: Webhook 回调必须验证签名
8. AI 输出验证: AI 生成的计划必须经过 Zod schema 验证后才入库
