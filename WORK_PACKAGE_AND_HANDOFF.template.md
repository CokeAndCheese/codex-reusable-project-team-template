# 工作包、派单与写入交接模板

本文件供产品经理内部调度使用，不增加用户日常汇报负担。

## 1. 工作包定义

```markdown
### WP-{{ID}} — {{TITLE}}

- 决策依据：{{APPROVED_DECISION_OR_SCOPE}}
- 目标：{{OUTCOME}}
- 范围：{{IN_SCOPE}}
- 非目标：{{OUT_OF_SCOPE}}
- 长期角色 owner：{{ROLE_CHAT_NAME}}
- 文件/系统所有权：{{FILES_OR_BOUNDARY}}
- 依赖：{{DEPENDENCIES}}
- 验收标准：{{ACCEPTANCE_CRITERIA}}
- 验证命令/方法：{{VERIFICATION}}
- 停止并升级条件：{{STOP_CONDITIONS}}
- 写入权：未分配 / 已分配 / 已归还
```

## 2. 统一派单门禁

每次真实派单前由产品经理填写；任一必需项为 `STOP` 时不得派单。

```markdown
### DISPATCH GATE — WP-{{ID}}

- 已批准依据：{{APPROVED_DECISION_OR_SCOPE}}
- Policy schema 门禁：PASS_V2 / STOP_AND_MIGRATE_POLICY_V2 / STOP_INVALID_POLICY_V2 / STOP_UNKNOWN_SCHEMA_VERSION
- 组织状态：目标角色已生效 / 仅提议中 / 无法确认
- 任务身份：唯一总控与唯一长期角色 PASS / STOP_DUPLICATE_PROJECT_CONTROL_IDENTITY / STOP_DUPLICATE_ROLE_IDENTITY
- 长期角色匹配：PASS / STOP；Thread ID：{{ROLE_THREAD_ID}}
- 临时 Agent：不使用 / 例外记录完整且 fresh context / STOP
- 临时数量与替换：无活动冲突，replacement 0 / 1 / STOP_REPEATED_TEMPORARY_REPLACEMENT
- 工作包字段：PASS / STOP
- 用户保留决定：无 / {{USER_RESERVED_DECISION}}
- 用户授权门禁：不适用 / PASS（证据：{{USER_AUTHORIZATION_EVIDENCE}}）/ STOP_AND_ESCALATE_TO_USER
- 内部保留裁决权限：不适用 / PASS / STOP_AND_REASSIGN
- model/reasoning 与运行时：PASS / STOP
- Standard/Fast speed：PASS / MANUAL_ACTION_REQUIRED / REQUESTED_UNVERIFIED / STOP_AND_ADD_SERVICE_TIER_POLICY
- 写入锁：只读 / 可发放 / STOP
- 外部或破坏性权限变化：无 / 已明确授权 / STOP
- 最终结果：READY / STOP
- 证据或缺失项：{{DISPATCH_GATE_EVIDENCE}}
```

“提议中”的角色只能用于规划，不能接收真实派单。模型升级不能修复职责、裁决权限、写入权或外部授权缺失。

## 3. 临时子 Agent 例外记录

只有使用临时子 Agent 时填写；缺少任一项不得进入后续模型计算或真实派发。

```markdown
- 不使用长期角色的原因：{{WHY_LONG_LIVED_ROLE_IS_UNSUITABLE}}
- 映射的现有岗位职责：{{MAPPED_RESPONSIBILITY}}
- 一次性范围：{{ONE_TIME_SCOPE}}
- 结论同步对象：{{LONG_LIVED_ROLE_OR_PM}}
- 上下文来源：fresh（独立 QA 必须）/ inherited（非独立且有理由）
- Parent / Child ID：none 或 {{PARENT_THREAD_ID}} / {{CHILD_THREAD_ID}}
- 当前同职责活动临时项：0（否则停止）
- 替换序号：0 / 1（大于 1 停止）
- 唯一临时名称：{{TEMPORARY_NAME_WITHOUT_PM_OR_LONG_LIVED_ROLE_TITLE}}
- 关闭方式：完成 Agent / 用户授权后归档 / 标记待归档并集中请求用户
- 不形成编制或长期所有权：确认
```

## 4. 模型路由决定

每次真实派单前填写。使用 `$project-team-orchestrator` 先完成职责、临时 Agent、工作包、用户保留决定和内部裁决权限门禁，再计算模型，随后才可发放写入权；不要把 `planning_only` 写成已经派单或换模。

```markdown
### MODEL ROUTING — WP-{{ID}}

- 模式：planning_only / next_dispatch / dispatched
- 目标长期角色：{{ROLE_CHAT_NAME}}
- 目标 Thread ID：{{ROLE_THREAD_ID}}
- Policy / Profile：{{POLICY_ID}} / {{PROFILE}}
- 任务类别：mechanical_evidence / standard_delivery / complex_analysis / critical_judgment
- 工作阶段：{{WORK_PHASE}}
- 用户保留决定：无 / {{USER_RESERVED_DECISION}}
- 用户授权门禁：不适用 / PASS / STOP_AND_ESCALATE_TO_USER；证据：{{USER_AUTHORIZATION_EVIDENCE}}
- 内部保留裁决或最终建议：无 / {{RETAINED_JUDGMENT}}
- 内部裁决权限门禁：PASS / STOP_AND_REASSIGN；授权 Profile：{{AUTHORIZED_PROFILES}}
- 活跃风险 trigger：{{ACTIVE_TRIGGERS_OR_NONE}}
- 产品经理 override：无 / {{PM_TIER_OVERRIDE}}
- 候选 tier：{{CANDIDATE_TIER}}
- 有效最低 tier：{{EFFECTIVE_FLOOR}}
- 最终请求：{{SELECTED_TIER}} / {{MODEL_ID}} / {{REASONING}}
- speed：standard / fast（默认 standard；与 reasoning 独立）
- service tier 运行时值：default / fast / priority / inherited / unresolved
- speed 应用状态：explicit_tool_argument / inherited_verified_config / manual_action_required / requested_unverified / not_requested
- model/reasoning 运行时核对：PASS / FAIL / 待手动核对
- speed 证据或手动动作：{{SPEED_EVIDENCE_OR_MANUAL_ACTION}}
- 降级状态：不适用 / 禁止 / 下一次派单可降级
- 权限、职责与写入权变化：无
- 路由证据或停止原因：{{ROUTING_EVIDENCE_OR_STOP_REASON}}
```

若执行中出现新的高风险条件，由当前角色返回 `MODEL CHANGE REQUEST`；产品经理在下一次实际工作消息中应用，不发送空的“仅换模/换速”轮次。Standard/Fast 不随 tier 升降自动改变。

## 5. 写入权发放

```markdown
- 当前分支：{{BRANCH}}
- 写入者：{{ROLE_CHAT_NAME}}
- 开始时间：{{START_TIME}}
- 开始时 Git 状态摘要：{{GIT_STATUS}}
- 用户拥有/受保护内容：{{PROTECTED_STATE}}
- 允许修改：{{ALLOWED_PATHS}}
- 禁止修改：{{DENIED_PATHS}}
- 并行只读角色：{{READ_ONLY_REVIEWERS}}
```

## 6. 实现者交回

```markdown
- 实际修改文件：{{CHANGED_FILES}}
- 实际交付：{{DELIVERED}}
- 验证结果：{{TEST_RESULTS}}
- 失败或跳过项：{{FAILURES_OR_SKIPS}}
- 遗留风险：{{RESIDUAL_RISKS}}
- 当前 Git 状态：{{FINAL_GIT_STATUS}}
- 受保护内容状态：{{PROTECTED_STATE_AFTER}}
- 写入权：请求归还
```

## 7. 产品经理交接判断

```markdown
- 范围核对：PASS / FAIL
- 证据核对：PASS / FAIL
- 受保护内容：PASS / FAIL
- 需要返工：{{REWORK}}
- 下一角色：{{NEXT_ROLE}}
- 下一次派单模型路由：保持 / 升级请求 / 降级候选 / 重新计算
- 临时执行单元：不适用 / 已回流并关闭 / 待授权归档 / STOP（仍有活动项）
- 写入权决定：释放 / 归还原角色 / 移交下一角色
- 是否需要向用户汇报：否 / 决策 / 重大风险 / 人事变动 / 里程碑
```

## 8. 最终验收摘要

```markdown
- 交付结果：
- 技术复核：
- QA 结论：
- 产品验收：
- 残余风险：
- 模型路由审计：PASS / FAIL；证据：
- 里程碑状态：研发完成 / 技术候选 / 用户已验收 / 已合入 / 已发布
- 本地检查点：
- 外部手动备份：待用户确认 / 已确认
```
