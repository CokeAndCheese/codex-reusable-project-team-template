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

## 2. 临时子 Agent 例外记录

只有使用临时子 Agent 时填写；缺少任一项不得派发。

```markdown
- 不使用长期角色的原因：{{WHY_LONG_LIVED_ROLE_IS_UNSUITABLE}}
- 映射的现有岗位职责：{{MAPPED_RESPONSIBILITY}}
- 一次性范围：{{ONE_TIME_SCOPE}}
- 结论同步对象：{{LONG_LIVED_ROLE_OR_PM}}
- 不形成编制或长期所有权：确认
```

## 3. 写入权发放

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

## 4. 实现者交回

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

## 5. 产品经理交接判断

```markdown
- 范围核对：PASS / FAIL
- 证据核对：PASS / FAIL
- 受保护内容：PASS / FAIL
- 需要返工：{{REWORK}}
- 下一角色：{{NEXT_ROLE}}
- 写入权决定：释放 / 归还原角色 / 移交下一角色
- 是否需要向用户汇报：否 / 决策 / 重大风险 / 人事变动 / 里程碑
```

## 6. 最终验收摘要

```markdown
- 交付结果：
- 技术复核：
- QA 结论：
- 产品验收：
- 残余风险：
- 里程碑状态：研发完成 / 技术候选 / 用户已验收 / 已合入 / 已发布
- 本地检查点：
- 外部手动备份：待用户确认 / 已确认
```
