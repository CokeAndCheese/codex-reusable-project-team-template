---
name: project-team-orchestrator
description: "Set up, operate, and audit reusable multi-conversation Codex project teams with one product-manager control task, long-lived role tasks, work packages, single-writer handoffs, independent acceptance, configurable model/reasoning/service-speed routing, and controlled temporary-task lifecycle. Use when bootstrapping this team mode, staffing or assigning roles, dispatching or handing off work, selecting or changing models, reasoning, or Standard/Fast speed, defining escalation or downgrade conditions, or checking duplicate-role and governance drift."
---

# Project Team Orchestrator

把项目的长期角色分工、产品经理总控、工作包、单一写入队列、交接、独立验收和模型路由作为同一套运行机制。模型选择是每次派单中的一个步骤，不是独立于组织和权限的第二套系统。

## 不可突破的运行边界

- 一个项目只有一个产品经理总控任务和一个生效 Thread ID。任何临时 Agent、fork 或子任务都不得继承、复用或冒充总控标题。
- 其他长期任务按 `职责-分工内容` 命名并承载稳定职责；项目经理名称例外为 `项目名产品经理-项目总控`。
- 优先复用已登记的长期角色。临时子 Agent 仅用于明确例外，必须记录例外理由、映射职责、一次性范围和结果同步对象；它不自动成为编制或长期 owner。
- 普通内部子任务优先使用 fresh-context 轻量 Agent，不创建用户可见任务。独立 QA 不从产品经理或实现者任务 fork；同一职责默认最多一个活动临时 Agent，重复替换先停止审查。
- 组织“提议中”与“已生效”分开。新增、拆分、合并、迁移或撤销长期角色必须遵循项目治理，不得静默变更。
- 所有角色共享一个受控工作区时，同一时刻只允许一个写入者；只读研究和评审可并行。模型变化不转移写入锁。
- 模型不是角色。换模不改变职责、汇报关系、文件所有权、最终裁决权或任何外部操作权限。
- 能力 tier、model、reasoning 与 Standard/Fast `service tier` 是独立控制轴。默认速度是 Standard；不得把 Standard 映射成 `medium` reasoning，也不得把“已请求”写成“已应用”。
- 开发者自测不替代独立技术复核、QA 和产品验收。完成声明必须有可复现证据。
- 不自行扩大产品范围、发布、部署、访问远端、处理凭据、执行破坏性动作或代表用户接受重大风险。

完整分工、人员变动、临时 Agent、写入队列和上下文恢复规则见 [team-operating-model.md](references/team-operating-model.md)。
选择速度、创建/fork 任务、运行独立 QA 或清理重复任务时，还必须读取 [runtime-controls-and-task-lifecycle.md](references/runtime-controls-and-task-lifecycle.md)。

## 事实源与初始化

按请求所需读取并核对：用户最新指令、系统权限、项目 `AGENTS.md`、产品经理章程、组织架构、产品上下文、决策日志、研发工作流、`ROLE_CHAT_REGISTRY.md`、`MODEL_ROUTING_POLICY.yaml`、当前工作包，以及相关源码、契约和测试。

优先级由项目治理决定；通用默认是：最新用户明确指令 > `AGENTS.md` > 产品经理章程 > 当前产品上下文与生效决策 > 历史聊天。发现实质冲突时停止受影响动作并向产品经理或用户报告。

当前模型策略 schema 为 v2。新建或同步的 v2 策略应包含独立的 `service_tier_policy`；旧 v2 缺少该字段时仍可做不改变速度的 model/reasoning 派单，但速度默认只按 Standard 意图记录，任何显式 Fast 或速度切换返回 `STOP_AND_ADD_SERVICE_TIER_POLICY`。读取 v1 时只允许 `plan-team` / `audit`，真实派单、override 或降级一律 `STOP_AND_MIGRATE_POLICY_V2`；未知版本失败关闭。迁移规则见 [policy-schema.md](references/policy-schema.md)，不得把旧内部权限推断成用户授权。

项目尚未采用本模式时：

1. 先只读检查现状，区分已有事实与建议。
2. 提出最小团队、职责、首个里程碑、写入方式、验收链和模型策略草案。
3. 只有用户明确要求初始化或同步时，才先读取 [BOOTSTRAP.md](assets/project-template/BOOTSTRAP.md)，再使用其中的项目模板资产生成文件并替换占位符。
4. 可选角色和模型示例都是草案；未获批准不得写成生效编制或项目决策。

## 工作模式

根据请求选择最小模式，可在一次明确授权的操作中组合：

- `bootstrap`：为一个项目提出或安装整套团队运行文件。
- `plan-team`：只规划角色、职责、依赖、里程碑和组织变更提议。
- `operate`：维护长期角色、Registry、队列、事实源和用户汇报边界。
- `dispatch`：创建工作包，选择责任角色和模型，核对写入锁并真实派单。
- `handoff`：接收交付证据，释放或转移写入权，安排下一责任人。
- `accept`：组织技术复核、独立 QA、产品验收和里程碑结论。
- `change-policy`：修改团队治理或模型、reasoning、服务速度路由策略；按各自批准边界记录。
- `audit`：只读检查组织、角色、任务身份、权限、工作包、模型/速度路由、临时任务生命周期和证据是否漂移。

没有文件修改、任务消息或外部状态变更授权时，默认只做 `plan-team` 或 `audit`。

## 统一派单算法

严格按顺序执行。前一门禁停止时，不得用提高模型层级绕过。

0. **策略 Schema**：真实派单前必须是字段完整的 v2。v1 返回 `STOP_AND_MIGRATE_POLICY_V2`，无效 v2 返回 `STOP_INVALID_POLICY_V2`，未知版本返回 `STOP_UNKNOWN_SCHEMA_VERSION`；停止后不再计算模型或发放写入权。
1. **授权与范围**：确认工作已获批准，写明目标、范围、非目标、验收标准、停止条件和外部权限。
2. **长期责任人与身份**：从组织事实源、Registry 和任务列表解析唯一长期角色与准确任务 ID。总控标题必须全项目唯一；发现重复总控或同职责多任务先停止消歧。
3. **临时 Agent 例外**：仅在没有合适长期角色、需要一次性独立视角、现有角色不可用/受限或隔离有明确价值时使用，并补齐例外记录。优先 fresh-context 轻量 Agent；禁止独立 QA 从总控/实现任务 fork，禁止同职责多个活动临时项。
4. **工作包与所有权**：登记工作包 ID、角色 owner、文件/系统边界、依赖、验证和当前写入状态。
5. **用户保留决定**：若工作包涉及发布批准、重大风险接受、不可逆架构/数据选择或外部/破坏性动作，必须找到当前请求或决策日志中的明确用户授权证据。缺失时立即返回 `STOP_AND_ESCALATE_TO_USER`；任何 Profile 或模型层级都不能替代用户。
6. **内部最终裁决权限**：若工作包包含内部保留裁决或最终建议，目标 Profile 必须同时满足 `final_judgment_allowed: true` 且位于该裁决的 `authorized_profiles`。否则返回 `STOP_AND_REASSIGN`；模型升级不能授予裁决权。
7. **候选模型层级**：产品经理单次 override 优先，其次任务类别候选值，最后角色 Profile 默认值。
8. **风险下限**：收集 Profile 最低值、阶段下限、活跃风险 trigger、用户保留决定下限、内部保留裁决下限和工作包最低值。
9. **最终模型层级**：`effective_floor = max(all floors)`；`selected_tier = max(candidate_tier, effective_floor)`。高于 Profile 最大值时停止并重新分工或修改已获批策略，不得向下截断。
10. **运行时校验**：从策略解析精确 `model` 与 `reasoning`，并独立解析默认或 override 的 `speed`。分别核对当前目标 Host/工具支持；只可使用策略明确声明且不降低有效下限的模型 fallback。速度不能设置或验证时返回准确的手动动作/未验证状态，不得用 reasoning 替代。
11. **写入锁**：写操作必须确认当前没有其他写入者，并记录允许/禁止路径和起始状态。只读任务明确标记无写入权。
12. **真实派单**：把完整工作包和受支持的显式 model/reasoning/speed 设置一起发送给准确任务；不发送没有工作内容的“仅换模/换速”消息。分别记录模型请求值、速度请求值、工具回执和应用状态，不声称已观测无法验证的内部设置。
13. **交回与验收**：实现者报告变更、验证、失败项、残余风险和工作区状态并归还写入权；产品经理再安排技术复核、独立 QA 与产品验收。

层级顺序只读取策略的 `tier_order`，不要根据模型名称猜测高低。策略结构和计算规则见 [policy-schema.md](references/policy-schema.md)，派单、变更请求和记录格式见 [routing-protocol.md](references/routing-protocol.md)。

## 模型升降级

公共契约/兼容性、安全/隐私、并发/共享状态/原子性、数据丢失/不可逆迁移、P0/P1 候选、证据冲突或“测试全绿但行为可疑”通常形成 L3 或更高下限。最终发布建议、重大风险建议、不可逆动作方案、P0 最终确认、P1 发布阻断建议和最终架构/安全/兼容性建议通常形成 critical 下限；项目策略可以采用不同层级名称。达到 critical 只提高分析质量，不代表用户已批准发布、风险接受或不可逆动作。

执行中的角色命中新风险时输出 `MODEL CHANGE REQUEST`。变化只在产品经理下一次显式派单时应用；当前轮仅继续不会跨越风险或权限边界的安全工作。若新证据同时触发用户保留决定，模型请求之外还必须返回 `STOP_AND_ESCALATE_TO_USER`，获得明确授权前不得继续该决定或动作。

降级也只影响下一次派单，并须同时满足：高于目标层级的 trigger 已关闭、当前不是锁定裁决阶段、无未解决高严重度风险或证据冲突、有支持降级的证据/交接，并达到策略要求的稳定工作包数。文件多、diff 长、命令多、耗时长或“仔细看看”不能单独触发升级。

模型 tier 的升降级不自动改变服务速度。Standard 可以配合任何受支持的 reasoning；Fast 也不代表更高 tier。速度只按 `service_tier_policy` 和当前派单的独立 override 处理。

## 产品经理可调范围

在项目已批准的成本、质量和权限边界内，产品经理可以按需调整：tier 对应的精确模型与 reasoning、独立的默认/单次 `speed`、角色 Profile 的默认/最小/最大 tier、长期角色与 Profile 绑定、任务类别候选值、阶段与风险下限、单个工作包 override、降级稳定次数，以及不降低有效下限的显式 fallback。默认 speed 为 Standard；Fast 只在 `service_tier_policy` 的授权范围内使用。

单次 override 写入工作包并在关闭或交接后失效。长期改变质量下限、内部最终裁决归属、成本边界或谁有权维护策略时，必须按项目治理获得相应批准并更新决策记录。用户保留决定不能通过策略改写成内部 Profile 权限。所有配置仍须在每次目标任务派单前校验当前 Host/工具实际支持的 model/reasoning 组合。

## 人员、写入与模型的三种独立变化

- **换人或改职责**：组织治理事件，需要提议、批准和事实源更新。
- **转移写入权**：工作包交接事件，需要原 owner 归还、状态核对和产品经理发放。
- **换模型**：下一次派单属性，需要风险计算和运行时校验。

三者不得互相暗示。服务速度是第四个独立变化，也不改变前三者。仅换模型或速度时，人员、权限和写入 owner 必须明确记录为 `none` / 不变。

## 完成与汇报

产品经理只把真实决策、重大风险、人事变化、里程碑结果和发布建议上报用户；日常协调留在团队内部。每次派单或审计至少返回：目标长期角色与唯一任务 ID、工作包、职责/权限门禁、临时任务状态、写入状态、Profile、任务类别、触发器、候选层级、有效下限、model/reasoning、speed、各自应用状态、证据或停止原因。

里程碑完成必须区分“研发完成、技术候选、用户已验收、已合入、已发布”，并给出技术复核、独立 QA、产品验收、残余风险和可恢复检查点。验收基线见 [acceptance-scenarios.md](references/acceptance-scenarios.md)。
