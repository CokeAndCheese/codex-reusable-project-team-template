# Codex 多 Chat 产品研发治理模板

这是一套可复制到其他软件项目的治理模板，复用以下工作模式：

- 一个产品经理主 Chat 负责项目总控，只向用户汇报决策、重大风险、人事变动和里程碑。
- 多个长期角色 Chat 按 `职责-分工内容` 命名并持续承担专业职责。
- 用户批准目标后，产品经理自行拆解、派单、排期、协调、验收，不把日常研发问题上抛。
- 长期角色 Chat 优先于临时子 Agent；普通内部子任务使用 fresh context，不从总控 fork 独立 QA。
- 产品经理通过可配置的模型层级、角色 Profile 和风险触发器，为每次工作包分别选择模型、推理强度和 Standard/Fast 服务速度；默认 Standard。
- 项目总控标题与 ID 唯一；临时任务不得冒充总控或长期角色，同职责临时 Agent 有数量、替换和关闭门禁。
- 所有角色共享一个工作区，但同一时刻只有一个实现角色拥有写入权。
- 重要产品事实、组织架构、决策和工作流写入仓库，避免上下文压缩造成失忆。
- 使用本地轻量 Git 保存差异和检查点，并在里程碑后进行外部手动备份。

## 目录内容

```text
reusable-project-team-template/
├── README.md
├── AGENTS.template.md
├── ROLE_CHAT_STARTER_PROMPTS.md
├── ROLE_CHAT_REGISTRY.template.md
├── WORK_PACKAGE_AND_HANDOFF.template.md
├── MODEL_ROUTING_POLICY.template.yaml
├── .agents/
│   └── skills/
│       └── project-team-orchestrator/
│           ├── SKILL.md
│           ├── agents/openai.yaml
│           ├── assets/project-template/...
│           └── references/
│               ├── team-operating-model.md
│               ├── policy-schema.md
│               ├── routing-protocol.md
│               ├── runtime-controls-and-task-lifecycle.md
│               └── acceptance-scenarios.md
├── index.html
├── assets/
│   ├── app.js
│   └── styles.css
├── Dockerfile
├── compose.yml
├── nginx.conf
└── docs/
    ├── PRODUCT_MANAGER_CHARTER.template.md
    ├── ORG_CHART.template.md
    ├── PRODUCT_CONTEXT.template.md
    ├── DECISION_LOG.template.md
    └── DEVELOPMENT_WORKFLOW.template.md
```

## 版本与镜像关系

- 根目录模板是供用户直接查看、复制和手动初始化项目的最新版模板。
- `.agents/skills/project-team-orchestrator/` 是 Codex 可引用的统一 Skill；不要再维护第二个旧版 Skill。
- Skill 内的 `assets/project-template/` 是为了让 Skill 能独立执行初始化而保留的发布镜像，应与根目录同名模板保持一致。
- 仓库不再保留旧的 `Codex 多 Chat 产品研发治理模板/` 子目录；文档站直接读取根目录模板和内嵌 Skill。
- 本机 `/Users/.../.codex/skills/project-team-orchestrator/` 属于安装副本，不是仓库目录。发布新版本后可用仓库内 Skill 同步更新本机安装副本。

## 使用方法

1. 将 `AGENTS.template.md` 复制为目标项目根目录的 `AGENTS.md`。
2. 将本模板的 `docs/*.template.md` 复制到目标项目的 `docs/`，并移除文件名中的 `.template`。
3. 将 `ROLE_CHAT_REGISTRY.template.md` 和 `WORK_PACKAGE_AND_HANDOFF.template.md` 复制到目标项目根目录，并移除文件名中的 `.template`。
4. 将 `MODEL_ROUTING_POLICY.template.yaml` 复制为项目根目录的 `MODEL_ROUTING_POLICY.yaml`，按项目预算、质量要求和当前运行时调整 model/reasoning；保留独立的 `service_tier_policy`，默认 Standard。
5. 将 `.agents/skills/project-team-orchestrator/` 保持在目标项目同一路径，使 Codex 可用 `$project-team-orchestrator` 引用。该 Skill 已包含本模板的完整分工与模型路由规则。
6. 将 `ROLE_CHAT_STARTER_PROMPTS.md` 一并复制到目标项目，作为建组材料。
7. 全局替换下列占位符。
8. 创建唯一产品经理主 Chat，并命名为 `{{PROJECT_NAME}}产品经理-项目总控`；登记唯一 Thread ID，禁止任何临时项沿用该标题。
9. 让产品经理先检查项目代码和文档，再提出适合该项目的组织方案与模型路由策略。
10. 用户批准组织方案后，按 `ROLE_CHAT_STARTER_PROMPTS.md` 创建和初始化长期角色 Chat。
11. 将 Chat 名称、任务 ID、状态、职责和模型 Profile 登记在 `ROLE_CHAT_REGISTRY.md`。
12. 后续所有已批准研发工作由产品经理通过长期角色 Chat 派发，并维护单一写入队列、临时任务生命周期，以及 model/reasoning/speed 各自的可审计记录。

## 必填占位符

| 占位符 | 含义 | 示例 |
|---|---|---|
| `{{PROJECT_NAME}}` | 人类可读项目名 | `Acme Studio` |
| `{{PROJECT_SLUG}}` | 分支、备份等机器友好名称 | `acme-studio` |
| `{{WORKSPACE_PATH}}` | 唯一项目目录绝对路径 | `/Users/name/Projects/acme-studio` |
| `{{DEFAULT_BRANCH}}` | 本地主分支 | `main` |
| `{{TASK_BRANCH_PREFIX}}` | 本地任务分支前缀 | `codex/` |
| `{{PROTECTED_PATHS}}` | 未经授权不得修改或提交的路径 | `config/local.json` |
| `{{CONTRACT_PATHS}}` | 对外或跨项目公共契约 | `docs/API_CONTRACT.md` |
| `{{PRIMARY_VERIFY_COMMAND}}` | 项目统一验证入口 | `npm run verify` |
| `{{ROUTING_POLICY_REVIEW_DATE}}` | 模型路由策略最近核对日期 | `2026-09-04` |

没有对应内容时，把占位符替换为“暂无”，不要保留未解释的模板变量。

角色范围、里程碑、风险和工作包中的其他占位符按文字语义逐项填写。完成初始化后可用下面的命令查找遗漏：

```text
rg -n '\{\{[^}]+\}\}' AGENTS.md docs ROLE_CHAT_*.md WORK_PACKAGE_*.md MODEL_ROUTING_POLICY.yaml .agents/skills/project-team-orchestrator
```

## 统一团队编排 Skill

`$project-team-orchestrator` 是整套工作模式的唯一入口，包含唯一产品经理总控、长期角色分工、组织变更、临时 Agent 例外与关闭、单一写入队列、工作包、交接、技术复核、独立 QA、产品验收，以及 model/reasoning/service-speed 路由。模型与速度选择不是另一个独立 Skill，而是每次派单门禁中的一个阶段。

产品经理先确定已批准范围和唯一责任角色任务，再计算模型：Profile 提供默认层级，任务类别给出候选层级，公共契约、安全、并发、数据损失、P0/P1 或内部最终建议等触发器形成不可突破的最低层级。产品经理可以按治理边界修改 tier→model/reasoning 映射、角色 Profile、触发器和降级门禁，也可以只覆盖某一个工作包。Standard/Fast 是独立轴，不随 tier 或 reasoning 自动变化。

典型调用：

```text
使用 $project-team-orchestrator 为 WP-12 规划下一次派单。
目标角色：工程师-核心产品实现
写入范围：src/jobs/**
任务类别：standard_delivery
风险标签：concurrency_shared_state_or_atomicity
服务速度：standard
模式：dispatch（planning_only）
```

Skill 默认按“每次派单”执行完整门禁：总控与长期角色任务必须唯一、工作包字段完整、临时 Agent 例外/数量/替换/关闭有记录、用户保留决定有明确授权证据、内部裁决权限匹配、写入锁可发放、模型达到风险下限，且 model/reasoning/speed 分别通过运行时校验。工具不能设置速度时返回 `manual_action_required` 或 `requested_unverified`，不得把 Standard 错映射成 medium reasoning，也不得声称已经切换。执行中的 Chat 发现升级条件时只能提交 `MODEL CHANGE REQUEST`，不能声称当前轮已经静默换模。

策略文件附带的 GPT-5.6 Luna/Terra/Sol 映射只是起始示例。模型目录、账户权限和支持的 reasoning 可能变化，每次派单都必须校验当前 Host；不支持时默认停止报告，不静默换成更弱模型。

当前策略 schema 为 v2，包含不可委托给内部 Profile 的 `user_reserved_decisions`。新建或同步的 v2 还包含 `service_tier_policy`；旧 v2 缺失时可以继续不换速的 model/reasoning 派单，但显式速度变更必须先补齐该字段。旧 v1 策略只能用于规划和审计。

## 推荐的最小常设团队

建议先建立以下四类长期 Chat，再按产品实际需要增减：

```text
用户 / 项目决策人
└── {{PROJECT_NAME}}产品经理-项目总控
    ├── 技术负责人-架构与边界
    ├── 工程师-核心产品实现
    └── QA工程师-质量与安全
```

前端、后端、AI、数据、DevOps、设计或行业专家不是所有项目的固定编制。只有形成持续工作量和清晰责任边界时，产品经理才提出新增或拆分，并向用户报告原因、影响和成本。

## 关键使用边界

- 复制模板不等于用户已经批准模板中的可选角色、产品范围、发布或风险接受。
- 组织架构的“提议中”和“已生效”必须分开；未经用户批准的人员变动不能写进生效架构。
- 长期角色 Chat 是职责载体，不因一次任务结束自动删除。临时子 Agent 不自动成为人员编制。
- 一个项目只有一个生效总控标题和 ID。普通内部子任务不建用户可见任务；独立 QA 使用长期 QA 或 fresh-context Agent，不从总控/实现者 fork。
- 同一职责默认最多一个活动临时 Agent；普通重试复用，替换一次后再次替换先停下来审查环境和工作包。交回后关闭或按授权归档。
- 长期角色暂时空闲不等于应撤销。只有职责确实结束、重要上下文已固化且没有未交接所有权时，才能提出归档或撤销。
- 多 Chat 不代表并行写代码。默认只允许一个写入者；其他角色可以只读评审。
- 模型升级不改变角色、编制、权限或写入队列；Evidence Agent 不能因为换成更强模型就取得架构、QA 或发布裁决权。
- 默认服务速度是 Standard。速度、模型层级和 reasoning 相互独立；配置默认、单次请求和实际应用必须分开记录。
- 所有完成声明必须附可复现证据。开发者自测不能替代独立 QA 和产品验收。
- 模板默认采用本地研发，不连接远端。若新项目需要 GitHub、部署或外部服务，必须在该项目中单独获得授权并修改治理文件。

## 新项目首次启动建议

首次启动时，产品经理应向用户集中汇报一次：

1. 产品当前状态和主要风险。
2. 建议的生效组织与暂不设置的岗位。
3. 第一个里程碑及验收条件。
4. 需要用户拍板的真实决策。
5. 工作区、Git、远端和备份策略。

此后只在出现新决策、重大风险、人事变化或里程碑结果时向用户汇报，日常研发协调留在项目团队内部。
