# Bootstrap Manifest

只在用户明确要求为目标项目初始化或同步团队运行模式时使用这些资产。

## 目标文件映射

| 资产 | 目标项目文件 |
|---|---|
| `AGENTS.template.md` | `AGENTS.md` |
| `ROLE_CHAT_REGISTRY.template.md` | `ROLE_CHAT_REGISTRY.md` |
| `ROLE_CHAT_STARTER_PROMPTS.md` | `ROLE_CHAT_STARTER_PROMPTS.md` |
| `WORK_PACKAGE_AND_HANDOFF.template.md` | `WORK_PACKAGE_AND_HANDOFF.md` |
| `MODEL_ROUTING_POLICY.template.yaml` | `MODEL_ROUTING_POLICY.yaml` |
| `docs/*.template.md` | `docs/*.md`，移除 `.template` |

## 安装门禁

1. 先检查目标项目已有指令、治理文件、代码、测试、工作区状态和角色任务；不要假设是空白项目。
2. 已有文件要按语义合并，不直接覆盖；保留用户与项目特有规则。
3. 替换全部 `{{...}}` 占位符。没有对应内容时写清“暂无”，不要留下含义不明的模板变量。
4. 最小团队、可选岗位、远端/发布策略和模型映射先作为建议；只有获批内容才能写入生效组织或决策日志。
5. 初始化后检查生效组织与 Registry 一致、任务列表中只有一个总控标题/ID、每个长期角色只有一个任务、只有一个写入者、所有角色有唯一 Profile、所有 model/reasoning 组合在当前运行时有效。
6. 检查 `service_tier_policy.default_speed=standard`，确认 Standard/Fast 与 reasoning 分离，并记录当前工具能否设置或验证 service tier。
7. 未经单独授权，不创建、fork、重命名或归档用户可见任务，不发送派单，不连接远端，不部署、不发布，也不清理目标项目的已有改动。普通内部子任务使用 fresh-context 轻量 Agent。
