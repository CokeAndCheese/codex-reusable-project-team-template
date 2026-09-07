# Dispatch and Model Routing Protocol

实际建组、派单、交接、升级、降级或审计时读取本文件。

## 策略 Schema 前置门禁

在业务门禁和任何模型计算之前先读取 `schema_version`：

- `2`：继续，但必须验证 `user_reserved_decisions` 及其他 v2 必填字段；缺失或无效时返回 `STOP_INVALID_POLICY_V2`。
- `1`：`plan-team` / `audit` 可只读报告；`dispatch`、override 和 downgrade 一律返回 `STOP_AND_MIGRATE_POLICY_V2`，不得生成可执行派单。
- 其他数值、非数值或缺失：返回 `STOP_UNKNOWN_SCHEMA_VERSION`，不得自动迁移、猜测或派单。

Schema 门禁停止后，不再执行下方统一派单门禁、tier 计算、fallback、写入权发放或任务消息。v1 → v2 的迁移步骤见 [policy-schema.md](policy-schema.md)。

完整 v2 若缺少 `service_tier_policy`，仍可执行不改变速度的 model/reasoning 派单，但必须把速度状态记为 `not_requested` 或 `requested_unverified`。任何显式 Standard/Fast 切换、Fast 授权或“速度已应用”结论返回 `STOP_AND_ADD_SERVICE_TIER_POLICY`。速度控制与任务生命周期细节见 [runtime-controls-and-task-lifecycle.md](runtime-controls-and-task-lifecycle.md)。

## 统一派单门禁

按以下顺序核对，任一项 `stop` 都不得继续真实派单：

1. 工作目标属于已批准范围，或本次请求本身已明确授权。
2. 目标是生效组织中的唯一长期角色，Registry 可解析准确任务 ID，且任务列表中只有一个生效总控和一个该长期职责任务；否则先消歧。
3. 若使用临时 Agent，例外理由、映射职责、一次性范围、同步对象和无长期所有权声明完整；同一职责没有其他活动临时项，且没有超过一次替换。
4. 工作包包含目标、范围、非目标、owner、文件/系统边界、依赖、验收、验证与停止条件。
5. 若涉及用户保留决定，已有明确用户授权证据；否则停止并升级给用户。
6. 若包含内部保留裁决/最终建议，目标 Profile 通过两道裁决权限门禁。
7. 计算出的模型组合达到全部有效下限；独立计算的 speed 符合策略，并分别通过目标运行时校验或返回明确手动动作。
8. 写任务拥有明确且唯一的写入锁；只读任务明确无写入权。
9. 派单不会扩大外部操作、破坏性动作、发布、部署、凭据或风险接受权限。

```text
WORK PACKAGE DISPATCH
mode: planning_only | next_dispatch | dispatched
work_package: <ID>
policy_schema_version: <值>
policy_schema_gate: pass_v2 | stop_and_migrate_policy_v2 | stop_invalid_policy_v2 | stop_unknown_schema_version
approved_basis: <用户决定、已批准范围或本次明确请求>
target_role: <长期角色名称>
target_thread_id: <准确 ID 或 unresolved>
organization_state: effective | proposed | unresolved
responsibility_match: pass | stop
task_identity_gate: pass | stop_duplicate_project_control_identity | stop_duplicate_role_identity
temporary_agent: none | exception
temporary_exception_record: <none 或 reason / mapped responsibility / scope / sync target>
temporary_lifecycle: <agent type / fresh context / active count / replacement count / closure plan>
scope: <目标、范围、非目标>
ownership: <文件或系统边界>
write_lock: read_only | granted | blocked
acceptance: <标准与验证>
user_reserved_decision: <none 或决定键>
user_authority_gate: not_applicable | pass_with_evidence | stop_and_escalate_to_user
user_authorization_evidence: <none、当前用户请求或有效决策记录>
model_routing: <MODEL ROUTING DECISION 引用>
speed_routing: <speed / runtime value / application status / evidence>
permission_change: none
result: ready | stop
evidence: <Registry、工作包、策略、工作区和工具回执>
```

`organization_state: proposed` 的角色不能被当作已生效人员派单。`planning_only` 可以为其形成待批准计划，但不得创建任务、发消息或发放写入权。

## 状态机

```text
DEFAULT
  ├─ 命中更高风险下限 → ELEVATION_REQUESTED
  │                         └─ 下一次显式派单成功 → ELEVATED
  ├─ 无法满足模型/权限 → BLOCKED
  └─ 工作包结束 → CLOSED

ELEVATED
  ├─ 命中 critical 下限 → ELEVATION_REQUESTED
  ├─ 全部降级门禁满足 → DOWNGRADE_ELIGIBLE
  │                         └─ 下一次显式派单成功 → DEFAULT/LOWER
  └─ 裁决或工作包结束 → CLOSED
```

状态描述的是路由决定，不宣称 Host 内部模型状态。只有带显式模型参数的真实派单请求，才能记录为“已请求应用”。

## MODEL ROUTING DECISION

```text
MODEL ROUTING DECISION
mode: planning_only | next_dispatch | dispatched
target_role: <长期角色名称>
target_thread_id: <准确 ID 或 unresolved>
work_package: <ID>
policy_id: <策略 ID>
profile: <Profile>
task_class: <类别>
user_reserved_decision: <none 或决定键>
user_authority_gate: not_applicable | pass_with_evidence | stop_and_escalate_to_user
user_authorization_evidence: <证据或 none>
retained_judgment: <none 或裁决键>
internal_authority_gate: pass | stop_and_reassign
internal_authorized_profiles: [<Profile>]
active_triggers: [<trigger>]
candidate_tier: <tier>
effective_floor: <tier>
selected: <tier / model / reasoning>
speed: <standard | fast>
service_tier_runtime_value: <default | fast | priority | inherited | unresolved>
speed_application: <explicit_tool_argument | inherited_verified_config | manual_action_required | requested_unverified | not_requested>
speed_evidence: <工具回执、配置证据、手动确认或缺失原因>
override: <none 或产品经理 override>
downgrade_state: not_applicable | blocked | eligible
permission_change: none
evidence: <策略、工作包和运行时校验证据>
```

`planning_only` 不得写成已经完成换模或换速。`dispatched` 只表示已发出工具实际支持的目标设置；model/reasoning 和 speed 必须分别说明是否可观测。`requested_unverified` 不等于已应用。

`user_authority_gate: stop_and_escalate_to_user` 时立即停止。产品经理、QA 或任何其他 Profile 只能形成建议，不能用 critical tier、全绿测试或策略 override 代替用户批准。

`internal_authority_gate: stop_and_reassign` 时不得继续计算或派发给原角色。返回授权 Profile，并从 Registry 提供唯一匹配角色或要求产品经理消歧；模型升级不能改变该结果。

## MODEL CHANGE REQUEST

角色在执行中发现新风险时使用：

```text
MODEL CHANGE REQUEST
work_package: <ID>
role: <当前责任角色>
current_requested_tier: <已知值或 unknown>
requested_minimum_tier: <tier>
triggers: [<trigger>]
why_now: <新证据>
user_reserved_decision: <none 或决定键>
user_authority_gate: not_applicable | stop_and_escalate_to_user
safe_to_continue: <仅列出不跨越风险边界的工作，或 none>
blocked_decision: <等待升级的判断/动作>
requested_action: product_manager_apply_on_next_dispatch
permission_change: none
```

产品经理核对后可以接受、提高、拒绝或要求补证据。拒绝必须记录理由；不能删除原始触发证据。若 `user_authority_gate` 停止，产品经理只能整理建议并请求用户决定，不能通过接受模型升级解除停止。

## DOWNGRADE DECISION

```text
DOWNGRADE DECISION
work_package: <ID>
from_tier: <tier>
target_tier: <tier>
closed_triggers: [<trigger>]
remaining_triggers: []
locked_phase: false
unresolved_high_risk: false
supporting_evidence: <检查/交接>
stable_dispatches: <n>
result: eligible_next_dispatch | denied
```

只要任何字段未知或不满足策略，结果为 `denied`。

## 任务工具行为

1. 先通过策略 Schema 前置门禁；停止结果禁止真实派单、override 或 downgrade。
2. 再使用任务列表、组织事实源和 Registry 解析准确目标，不只按相似标题猜测；多个总控标题立即停止，Registry 中唯一原总控之外的项不得继续协调。
3. 对已有长期角色，优先发送完整工作包；如果工具支持，显式附带 `model`、`thinking/reasoning` 和独立的 service tier。工具不支持 speed 时记录 `manual_action_required` 或 `requested_unverified`。
4. 不发送空消息来消耗一轮只为改变设置，也不把 speed 写进 prompt 后声称工具已应用。
5. 普通内部子任务使用 fresh-context 轻量 Agent。只有用户明确要求/授权新的用户可见任务时才使用 `create_thread`；`fork_thread` 不作为独立 QA 默认路径。
6. 如果已授权且不得不 fork，先取得 child ID，立即改成唯一临时标题，再发送工作。标题不得包含或等于产品经理总控/长期角色精确名称；无法重命名就停止并保留空任务待整理。
7. 临时 Agent 必须在消息中带一次性范围和同步对象；同一映射职责最多一个活动项，默认复用，最多替换一次。完成后先回流结果，再关闭/按授权归档。
8. 不在未获批准时新建、归档、重命名或拆分长期任务；模型、速度、额度或普通重试不匹配不是新建重复角色的理由。
9. 发送成功后记录：时间、目标 ID、工作包、写入状态、请求的模型组合、独立速度请求与应用状态、触发器和工具回执。
10. 工具不可用时返回可复制的完整派单块和路由决策块，并说明产品经理或用户需要手动完成的步骤。

## 交回与写入权移交

```text
WORK PACKAGE HANDOFF
work_package: <ID>
from_role: <角色>
changed_files_or_systems: <列表>
delivered: <结果>
verification: <命令、结果与证据位置>
failures_or_skips: <列表或 none>
residual_risks: <列表或 none>
workspace_state: <分支、diff、受保护内容>
write_lock_returned: requested | confirmed
next_role: <角色或 none>
next_dispatch_requires_new_routing: yes
```

只有产品经理确认 `write_lock_returned` 后才能释放或移交。下一角色必须形成新的派单与模型路由决定，不能继承上一角色的写入权或临时 override。

## 审计检查

- Schema 是否为完整 v2；是否从 v1/未知/无效策略越过停止码进入派单、override 或 downgrade。
- 生效组织和 Registry 是否一致；是否把“提议中”角色当成已生效人员。
- 任务列表是否只有一个总控标题/ID；是否有 fork 或临时 QA 冒充总控或长期角色。
- 每个工作包是否优先匹配长期角色；临时 Agent 例外记录和结果回流是否完整。
- 同一职责是否出现多个活动临时项、连续替换、完成后未关闭，或把内部子任务错误建成用户可见任务。
- 独立 QA 是否来自 fresh context；是否从总控/实现任务 fork 后仍声称独立。
- 当前是否只有一个写入者；角色或模型变化是否被误当作写入权转移。
- 工作包、交回、技术复核、独立 QA 和产品验收是否有可复现证据。
- 发布批准、重大风险接受、不可逆决定或外部/破坏性动作是否有明确用户授权证据；是否把内部建议误写为用户批准。
- Registry 的每个生效角色是否唯一绑定一个 Profile。
- 最近派单是否存在工作包、任务分类、触发器和路由证据。
- 选定层级是否低于有效下限或高于 Profile 最大值。
- Evidence Profile 是否越权给出最终架构、缺陷级别或发布结论。
- 内部最终裁决/建议的目标 Profile 是否同时通过 `final_judgment_allowed` 与 `authorized_profiles` 两道门禁。
- 是否把“已请求模型”误写成“已证明当前模型”。
- Standard/Fast 是否与 reasoning 分开；速度是否默认 Standard；工具不能设置时是否误报为已应用。
- 是否出现连续升降级抖动、未关闭触发器却降级、工作包结束后 override 未清除。
- 是否因工作量而非推理风险升级。
- 模型/effort 是否经过当前运行环境校验。
