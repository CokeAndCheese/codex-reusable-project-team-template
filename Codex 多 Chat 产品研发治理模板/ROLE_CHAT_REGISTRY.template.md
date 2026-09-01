# 长期角色 Chat 登记表

> 项目：{{PROJECT_NAME}}
> 维护人：`{{PROJECT_NAME}}产品经理-项目总控`
> 本表记录任务入口和运行状态；生效编制与汇报关系仍以 `docs/ORG_CHART.md` 为准。

## 1. Chat 清单

| Chat 名称 | Task / Thread ID | 生效职责 | 当前状态 | 当前写入权 | 最近交接或检查点 |
|---|---|---|---|---|---|
| {{PROJECT_NAME}}产品经理-项目总控 | {{PM_THREAD_ID}} | 产品与项目总控 | 工作中 | 否 | {{PM_LAST_STATE}} |
| 技术负责人-架构与边界 | {{TECH_THREAD_ID}} | 见 ORG_CHART | 待创建 / 空闲 / 工作中 / 受阻 | 否 | {{TECH_LAST_STATE}} |
| 工程师-核心产品实现 | {{ENGINEER_THREAD_ID}} | 见 ORG_CHART | 待创建 / 空闲 / 工作中 / 受阻 | 否 | {{ENGINEER_LAST_STATE}} |
| QA工程师-质量与安全 | {{QA_THREAD_ID}} | 见 ORG_CHART | 待创建 / 空闲 / 工作中 / 受阻 | 否 | {{QA_LAST_STATE}} |

## 2. 状态定义

- `待创建`：组织提议尚未批准或 Chat 尚未建立。
- `空闲`：在岗但当前没有工作包；后续相同职责优先复用。
- `工作中`：正在执行已登记工作包。
- `受阻`：同一外部阻塞已经确认，需要产品经理处理或升级。
- `待归档`：职责已经结束，正在核对上下文和所有权。
- `已归档`：可恢复历史已保留，但不再接收常规派单。

空闲、额度不足或一次任务没有输出，不自动构成人员撤销。涉及离岗、职责迁移、合并或撤销时，必须先走 `ORG_CHART.md` 的组织变更流程。

## 3. 当前写入锁

```text
分支：{{CURRENT_TASK_BRANCH}}
写入者：{{CURRENT_WRITER_OR_NONE}}
工作包：{{CURRENT_WORK_PACKAGE_OR_NONE}}
允许路径：{{CURRENT_ALLOWED_PATHS}}
开始时间：{{WRITE_LOCK_START}}
```

写入者交回且产品经理明确释放前，其他 Chat 只能只读。

## 4. 归档门禁

归档或撤销长期 Chat 前必须全部满足：

- 当前没有写入权、文件所有权或未完成工作包。
- 有价值的决策、产品事实和风险已写入权威文档。
- 实现差异、测试证据和检查点已可复现。
- 依赖该 Chat 的其他角色已收到必要交接。
- 若属于人事变动，用户已经收到变动、原因、影响和成本汇报，并完成所需决策。
- 产品经理已更新 `ORG_CHART.md`、`PRODUCT_CONTEXT.md` 和适用的 `DECISION_LOG.md`。

不要把“归档 Chat”和“删除仓库事实源”混为一谈。
