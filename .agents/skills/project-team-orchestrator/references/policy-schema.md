# Policy Schema

创建、迁移或修改 `MODEL_ROUTING_POLICY.yaml` 时读取本文件。

## 设计目标

策略文件只保存统一团队编排中“模型路由阶段”的可调事实，不复制组织架构、权限或完整工作流。组织是否生效、谁拥有职责和写入权，必须先由团队治理门禁确定；本策略不能覆盖。它回答六个问题：

1. 每个抽象层级当前映射到哪个模型和 reasoning。
2. 每类长期角色默认使用哪个 Profile。
3. 哪些任务风险形成不可低于的层级下限。
4. 哪些证据允许下一次派单降级。
5. 哪些事项只能由用户最终决定，不能转化为内部 Profile 权限。
6. 项目默认使用 Standard 还是 Fast，以及产品经理何时可做单次速度 override。

## 顶层字段

| 字段 | 必填 | 含义 |
|---|---:|---|
| `schema_version` | 是 | 当前为 `2`。v1 必须先迁移；未知版本必须停止，不猜测迁移。 |
| `policy_id` | 是 | 项目内稳定标识。 |
| `policy_owner` | 是 | 有权维护路由策略的角色。 |
| `reviewed_at` | 是 | 最近核对日期；不是模型可用性证明。 |
| `application_mode` | 是 | 推荐 `per_dispatch`，每次真实派单带入工具支持的 model/reasoning/speed 设置。 |
| `service_tier_policy` | 新建/同步策略必填 | 独立于 model/reasoning 的 Standard/Fast 默认、允许值、Fast 授权和无法设置时的行为。旧 v2 缺失时只允许 Standard 意图且不得声称已应用。 |
| `tier_order` | 是 | 从低到高的完整有序层级；所有 `max()` 均以此为准。 |
| `tiers` | 是 | 层级到精确模型 ID、reasoning 和用途的映射。 |
| `task_classes` | 是 | 工作类别到候选层级的映射，不是风险下限。 |
| `phase_floors` | 是 | 工作阶段到最低层级的映射。 |
| `triggers` | 是 | 风险标签到最低层级及保持条件的映射。 |
| `retained_judgments` | 是 | 团队内部最终裁决/建议的最低层级与授权 Profile。 |
| `user_reserved_decisions` | 是 | 只允许用户最终决定的事项、最低分析层级和建议 Profile。 |
| `profiles` | 是 | 角色默认、最小/最大层级和裁决权限。 |
| `role_assignments` | 是 | 长期角色名称到 Profile 的显式绑定。 |
| `downgrade_policy` | 是 | 降级必须满足的全部门禁。 |
| `runtime_validation` | 是 | 不支持的模型/effort/service tier 如何处理。 |

## Service tier 必须独立

推荐结构：

```yaml
service_tier_policy:
  default_speed: "standard"
  allowed_speeds:
    - "standard"
    - "fast"
  fast_authorization: "explicit_user_or_durable_project_policy"
  override_scope: "next_dispatch_only"
  on_unavailable_control: "manual_action_required"
  reasoning_independent: true
```

- `default_speed` 必须是 `standard`，除非用户明确批准项目长期使用其他速度。
- `allowed_speeds` 必须包含 `standard`；请求不在列表中的速度失败关闭。
- `fast_authorization` 决定产品经理能否在项目预算边界内选择 Fast。没有可定位授权时不得把 Fast 设为默认或单次 override。
- `reasoning_independent` 必须为 `true`。Standard/Fast 与 `low/medium/high/max` 没有映射关系。
- `on_unavailable_control` 推荐 `manual_action_required`：工具不能传 speed/service tier 时返回手动操作，不伪造应用成功。

用户可见规范使用 `standard` / `fast`；运行时配置或工具值按当前接口映射。例如 Standard 通常对应配置 `service_tier = "default"`，Fast 可能对应 `fast` 或 `priority`。映射必须来自当前目标工具或官方配置说明，不能写死为跨运行时通用事实。

已有 v2 策略缺少 `service_tier_policy` 时：

1. model/reasoning 的既有路由仍可使用。
2. 不改变速度的派单记录 `speed=standard`、`speed_application=requested_unverified` 或 `not_requested`。
3. 显式切换速度、允许 Fast 或宣称速度已应用时返回 `STOP_AND_ADD_SERVICE_TIER_POLICY`。
4. 历史自定义 `speed_policy` 不自动等同本结构；先迁移，并删除任何“Standard 映射 reasoning”的规则。

## 候选与下限必须分离

`task_classes` 只给候选层级，使高能力角色在机械任务上可以降低成本。`triggers`、`user_reserved_decisions`、`retained_judgments`、Profile 最小值和工作包最小值共同形成不可突破的下限。

```text
if user_reserved_decision:
  require explicit user authorization evidence from current request or decision log
  otherwise STOP_AND_ESCALATE_TO_USER

if retained_judgment:
  require profile.final_judgment_allowed == true
  require profile in retained_judgment.authorized_profiles
  otherwise STOP_AND_REASSIGN

candidate = PM override ?? task_class tier ?? profile.default_tier

effective_floor = max(
  profile.minimum_tier,
  phase/work-package minimum,
  all active trigger minimum_tier,
  user-reserved decision minimum_tier,
  retained judgment minimum_tier
)

selected = max(candidate, effective_floor)
```

如果 `selected` 高于 Profile 的 `maximum_tier`，结果是 `STOP_AND_REASSIGN_OR_EDIT_POLICY`，不是把结果压回最大值。

## 用户保留决定

发布批准、重大风险接受、不可逆架构/数据选择以及外部或破坏性动作授权不能出现在 `retained_judgments.authorized_profiles` 中。它们必须放入 `user_reserved_decisions`：

```yaml
release_approval:
  minimum_tier: "L3_CRITICAL"
  requires_explicit_user_authorization: true
  recommendation_profiles:
    - "independent_qa"
    - "product_manager"
```

`recommendation_profiles` 只能准备建议、向用户升级，或在用户已经明确批准后记录与执行后续派单；它不是最终决定权。缺少可定位到当前用户请求或有效决策日志的授权证据时，必须 `STOP_AND_ESCALATE_TO_USER`。提高 tier、修改 Profile、QA 全绿或产品经理认可都不能通过这道门禁。

## Profile 约束

每个 Profile 至少包含：

```yaml
default_tier: "L2"
minimum_tier: "L1"
maximum_tier: "L3_CRITICAL"
final_judgment_allowed: true
```

`final_judgment_allowed` 仅控制团队内部保留裁决/最终建议，不影响用户保留决定。值为 `false` 的 Profile 可以收集和整理证据，但发现需要内部最终裁决的触发器时必须回到责任角色；不能只靠升高模型取得裁决权。

每个 `retained_judgments` 条目必须列出至少一个 `authorized_profiles`。即使某 Profile 的 `final_judgment_allowed` 为 true，只要它不在该裁决的授权列表中，也必须 `STOP_AND_REASSIGN`。根据 `role_assignments` 解析授权 Profile：只有一个准确角色时可建议该角色；没有或存在多个匹配时由产品经理消歧，不能自动任选。

## 运行时可用性

- `tiers.*.model` 使用精确模型 ID，不用 `best`、`cheap` 等模糊别名。
- `reasoning` 必须是当前目标工具实际接受的值。
- 策略允许声明同层或更高层的备用组合，但默认不设置自动 fallback。
- 运行时不支持所选组合时，先尝试策略中显式声明且不降低 `effective_floor` 的备用；否则停止并报告。
- 不因官方目录出现新模型而自动改写项目策略。先比较、验证，再由策略 owner 更新映射。
- 单独验证 speed/service tier。工具只支持 model/reasoning 时，不得把速度字段塞进 reasoning 或 prompt 后声称已设置。
- 记录速度的 `requested`、`application_status` 和 `evidence`。用户级默认配置不能证明已有任务没有显式覆盖。

## 变更权限

常规单次 model/reasoning/speed override 由项目的产品经理在既有授权内处理。长期改变 tier 映射、默认速度、Fast 授权、Profile 默认值、风险下限、内部最终裁决归属或预算/质量边界时，遵循该项目自己的治理和决策日志规则；本 Skill 不替项目决定谁能批准。任何策略变更都不能把 `user_reserved_decisions` 转成内部 Profile 的最终权限。

## v1 → v2 迁移

v2 新增必填的 `user_reserved_decisions`，因此与不含该门禁的 v1 不兼容。读取 `schema_version: 1` 时：

1. `plan-team` 和 `audit` 可以继续读取并报告现状。
2. 任何真实派单、单次 override 或降级决定返回 `STOP_AND_MIGRATE_POLICY_V2`。
3. 复制 v1 的现有 tier、Profile、任务类别、trigger 和内部裁决配置，另行形成 v2 草案。
4. 根据当前项目治理明确列出用户保留决定；不得把历史内部建议或旧 Profile 权限推断为用户批准。
5. 由原策略 owner 按项目治理确认迁移，并记录生效日期及兼容影响后，才把 `schema_version` 改为 `2`。
6. v2 缺少 `user_reserved_decisions`、任一条目未要求明确用户授权，或建议 Profile 为空时一律失败关闭。

未知版本返回 `STOP_UNKNOWN_SCHEMA_VERSION`，不自动升级或降级。

## 兼容规则

- 新增字段时优先保持旧字段语义；破坏性变化提升 `schema_version`。
- 未识别的 tier、Profile、trigger、retained judgment、user-reserved decision、reasoning 或应用模式一律 fail closed。
- 每个 `user_reserved_decisions` 条目必须设置 `requires_explicit_user_authorization: true` 并列出至少一个 `recommendation_profiles`；这些 Profile 不是批准者。
- 同一角色只能有一个生效 assignment；重复或模糊匹配必须报错。
- `role_assignments` 只能绑定生效组织与 Registry 中可唯一解析的长期角色；它不会使提议角色自动生效。
- Registry 的临时 override 不修改策略默认值；它在工作包关闭或明确清除后失效。
- Standard/Fast 与 reasoning 必须分别存储、校验和记录；互相映射或共用一个字段视为无效速度配置。
- 新建/同步的 v2 策略缺少 `service_tier_policy` 时不得通过显式速度变更门禁；旧 v2 的 model/reasoning 兼容行为按本文件规定处理。
