# 长期角色 Chat 登记表

> 项目：{{PROJECT_NAME}}
> 维护人：`{{PROJECT_NAME}}产品经理-项目总控`
> 本表记录任务入口和运行状态；生效编制与汇报关系仍以 `docs/ORG_CHART.md` 为准。
> 第一节只允许一个总控和每个获批长期职责一个任务；临时 Agent/任务必须单列，不能占用长期角色名称。

## 1. Chat 清单

| Chat 名称 | Task / Thread ID | 生效职责 | 当前状态 | 当前写入权 | 最近交接或检查点 |
|---|---|---|---|---|---|
| {{PROJECT_NAME}}产品经理-项目总控 | {{PM_THREAD_ID}} | 产品与项目总控 | 工作中 | 否 | {{PM_LAST_STATE}} |
| 技术负责人-架构与边界 | {{TECH_THREAD_ID}} | 见 ORG_CHART | 待创建 / 空闲 / 工作中 / 受阻 | 否 | {{TECH_LAST_STATE}} |
| 工程师-核心产品实现 | {{ENGINEER_THREAD_ID}} | 见 ORG_CHART | 待创建 / 空闲 / 工作中 / 受阻 | 否 | {{ENGINEER_LAST_STATE}} |
| QA工程师-质量与安全 | {{QA_THREAD_ID}} | 见 ORG_CHART | 待创建 / 空闲 / 工作中 / 受阻 | 否 | {{QA_LAST_STATE}} |

身份门禁：项目任务列表中 `{{PROJECT_NAME}}产品经理-项目总控` 的标题和生效 ID 均必须唯一。发现 fork 或临时项沿用该标题时，记录 `STOP_DUPLICATE_PROJECT_CONTROL_IDENTITY`；仅上表登记的原总控可继续协调。

## 1A. 临时执行单元

| 临时名称 | Agent / Thread ID | Parent ID | 映射职责 | 一次性范围 | 上下文 | 状态 | 替换序号 | 结果同步对象 | 关闭方式 |
|---|---|---|---|---|---|---|---:|---|---|
| {{TEMP_NAME_OR_NONE}} | {{TEMP_ID_OR_NONE}} | none / {{PARENT_ID}} | {{MAPPED_RESPONSIBILITY}} | {{ONE_TIME_SCOPE}} | fresh / inherited（独立 QA 禁止 inherited） | 活动 / 已交回 / 待归档 / 已归档 | 0 / 1 | {{SYNC_TARGET}} | 完成 Agent / 用户授权归档 / 待用户决定 |

规则：同一映射职责最多一个活动临时执行单元；普通重试复用原单元。替换一次后再次请求替换时停止并审查环境、测试装置和工作包。临时项不得包含“产品经理-项目总控”或长期角色的精确名称。

## 2. 模型路由登记

> Profile、tier 与默认 speed 以 `MODEL_ROUTING_POLICY.yaml` 为准。model/reasoning 与 Standard/Fast 分开记录；请求值、配置默认和实际应用不是同一事实。

| Chat 名称 | Policy Profile | 默认 tier | 默认 speed | 当前工作包 override | 最近 model/reasoning 请求 | 最近 speed 请求 | speed 应用状态 | 最近路由证据 |
|---|---|---|---|---|---|---|---|---|
| {{PROJECT_NAME}}产品经理-项目总控 | product_manager | L3 | standard | 无 / {{PM_WP_OVERRIDE}} | {{PM_LAST_REQUESTED_MODEL}} | {{PM_LAST_REQUESTED_SPEED}} | {{PM_SPEED_APPLICATION}} | {{PM_ROUTING_EVIDENCE}} |
| 技术负责人-架构与边界 | architecture_owner | L3 | standard | 无 / {{TECH_WP_OVERRIDE}} | {{TECH_LAST_REQUESTED_MODEL}} | {{TECH_LAST_REQUESTED_SPEED}} | {{TECH_SPEED_APPLICATION}} | {{TECH_ROUTING_EVIDENCE}} |
| 工程师-核心产品实现 | implementation_owner | L2 | standard | 无 / {{ENGINEER_WP_OVERRIDE}} | {{ENGINEER_LAST_REQUESTED_MODEL}} | {{ENGINEER_LAST_REQUESTED_SPEED}} | {{ENGINEER_SPEED_APPLICATION}} | {{ENGINEER_ROUTING_EVIDENCE}} |
| QA工程师-质量与安全 | independent_qa | L3 | standard | 无 / {{QA_WP_OVERRIDE}} | {{QA_LAST_REQUESTED_MODEL}} | {{QA_LAST_REQUESTED_SPEED}} | {{QA_SPEED_APPLICATION}} | {{QA_ROUTING_EVIDENCE}} |

规则：

- 同一生效 Chat 只能绑定一个 Profile；重复或未知 Profile 必须先修正。
- override 只属于一个明确工作包，关闭、取消或交接后立即清除或标记失效。
- “最近 model/reasoning 请求”写 `tier / model / reasoning / 时间`；未附带显式参数时写“未显式请求”。
- speed 单独写 `standard / fast / 时间`；应用状态只能是 `explicit_tool_argument`、`inherited_verified_config`、`manual_action_required`、`requested_unverified` 或 `not_requested`。
- 用户/项目配置为 Standard 只证明默认偏好，不证明已有任务没有显式覆盖；`requested_unverified` 不得写成“已切换”。
- 路由证据至少指向工作包 ID、命中 trigger、有效下限、model/reasoning 派单回执，以及 speed 的工具回执、配置证据或手动操作状态。
- 涉及用户保留决定时，还必须记录决定键和可定位的明确用户授权证据；没有证据只能记录 `STOP_AND_ESCALATE_TO_USER`，不得派单。
- 改模型不改变本表第 1 节的职责、状态或写入权。

## 3. 状态定义

- `待创建`：组织提议尚未批准或 Chat 尚未建立。
- `空闲`：在岗但当前没有工作包；后续相同职责优先复用。
- `工作中`：正在执行已登记工作包。
- `受阻`：同一外部阻塞已经确认，需要产品经理处理或升级。
- `待归档`：职责已经结束，正在核对上下文和所有权。
- `已归档`：可恢复历史已保留，但不再接收常规派单。

空闲、额度不足或一次任务没有输出，不自动构成人员撤销。涉及离岗、职责迁移、合并或撤销时，必须先走 `ORG_CHART.md` 的组织变更流程。

## 4. 当前写入锁

```text
分支：{{CURRENT_TASK_BRANCH}}
写入者：{{CURRENT_WRITER_OR_NONE}}
工作包：{{CURRENT_WORK_PACKAGE_OR_NONE}}
允许路径：{{CURRENT_ALLOWED_PATHS}}
开始时间：{{WRITE_LOCK_START}}
```

写入者交回且产品经理明确释放前，其他 Chat 只能只读。

## 5. 归档门禁

归档或撤销长期 Chat 前必须全部满足：

- 当前没有写入权、文件所有权或未完成工作包。
- 有价值的决策、产品事实和风险已写入权威文档。
- 实现差异、测试证据和检查点已可复现。
- 依赖该 Chat 的其他角色已收到必要交接。
- 若属于人事变动，用户已经收到变动、原因、影响和成本汇报，并完成所需决策。
- 产品经理已更新 `ORG_CHART.md`、`PRODUCT_CONTEXT.md` 和适用的 `DECISION_LOG.md`。

不要把“归档 Chat”和“删除仓库事实源”混为一谈。
