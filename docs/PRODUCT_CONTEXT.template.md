# {{PROJECT_NAME}} — 产品与团队上下文

> 最近核对：{{REVIEW_DATE}}
> 本文件只保存当前事实；长期批准记录见 `DECISION_LOG.md`，组织编制见 `ORG_CHART.md`。

## 1. 产品定位

- 产品一句话：{{PRODUCT_ONE_LINER}}
- 首要用户：{{PRIMARY_USERS}}
- 核心问题：{{CORE_PROBLEM}}
- 当前阶段：探索 / 原型 / 内测 / 候选 / 已发布
- 明确非目标：{{NON_GOALS}}

## 2. 核心用户链路

```text
{{USER_ENTRY}}
→ {{CORE_STEP_1}}
→ {{CORE_STEP_2}}
→ {{USER_VALUE}}
```

## 3. 当前能力基线

- 已实现：{{IMPLEMENTED_CAPABILITIES}}
- 部分实现：{{PARTIAL_CAPABILITIES}}
- 尚未实现：{{MISSING_CAPABILITIES}}
- 权威契约：{{AUTHORITATIVE_CONTRACTS}}
- 受保护边界：{{PROTECTED_BOUNDARIES}}

## 4. 当前架构

```text
{{ARCHITECTURE_DIAGRAM}}
```

关键边界：

- {{BOUNDARY_1}}
- {{BOUNDARY_2}}
- {{BOUNDARY_3}}

## 5. 当前验证证据

| 能力或里程碑 | 验证方式 | 最近结果 | 证据位置 |
|---|---|---|---|
| {{AREA}} | {{COMMAND_OR_REVIEW}} | PASS / FAIL / 未验证 | {{PATH_OR_CHECKPOINT}} |

未覆盖证据：{{NOT_YET_VERIFIED}}

## 6. 风险与优先级

### P0 — 下一里程碑前必须处理

1. {{P0_RISK}}

### P1 — 形成可靠产品

1. {{P1_RISK}}

### P2 — 中长期产品化

1. {{P2_RISK}}

## 7. 当前生效团队

以 `ORG_CHART.md` 为唯一组织事实源。此处只记录对当前产品阶段有直接影响的职责摘要：

- 产品经理：{{PM_CURRENT_FOCUS}}
- 技术负责人：{{TECH_LEAD_CURRENT_FOCUS}}
- 实现角色：{{IMPLEMENTATION_CURRENT_FOCUS}}
- QA：{{QA_CURRENT_FOCUS}}

## 8. 当前里程碑

| 里程碑 | 状态 | 目标 | 验收条件 | 下一动作 |
|---|---|---|---|---|
| {{MILESTONE_ID}} {{MILESTONE_NAME}} | 提议 / 已批准 / 研发中 / 候选 / 已验收 | {{GOAL}} | {{ACCEPTANCE}} | {{NEXT_ACTION}} |

状态必须精确区分：研发完成、技术候选、用户已验收、本地已合入、已发布不是同一件事。

## 9. 工作区事实

- 唯一工作区：`{{WORKSPACE_PATH}}`
- 当前任务分支：`{{CURRENT_BRANCH}}`
- 用户拥有的未提交/未跟踪内容：{{USER_OWNED_CHANGES}}
- 远端策略：{{REMOTE_POLICY}}
- 最近本地检查点：{{LAST_CHECKPOINT}}
- 最近外部备份：{{LAST_MANUAL_BACKUP}}

## 10. 更新规则

产品范围、架构、风险、团队、验证或里程碑状态发生实质变化时立即更新。源码、机器契约和测试仍是技术事实的最终依据；本文不能替代代码验证。
