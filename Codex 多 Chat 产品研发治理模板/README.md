# Codex 多 Chat 产品研发治理模板

这是一套可复制到其他软件项目的治理模板，复用以下工作模式：

- 一个产品经理主 Chat 负责项目总控，只向用户汇报决策、重大风险、人事变动和里程碑。
- 多个长期角色 Chat 按 `职责-分工内容` 命名并持续承担专业职责。
- 用户批准目标后，产品经理自行拆解、派单、排期、协调、验收，不把日常研发问题上抛。
- 长期角色 Chat 优先于产品经理 Chat 内的临时子 Agent。
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
└── docs/
    ├── PRODUCT_MANAGER_CHARTER.template.md
    ├── ORG_CHART.template.md
    ├── PRODUCT_CONTEXT.template.md
    ├── DECISION_LOG.template.md
    └── DEVELOPMENT_WORKFLOW.template.md
```

## 使用方法

1. 将 `AGENTS.template.md` 复制为目标项目根目录的 `AGENTS.md`。
2. 将本模板的 `docs/*.template.md` 复制到目标项目的 `docs/`，并移除文件名中的 `.template`。
3. 将 `ROLE_CHAT_REGISTRY.template.md` 和 `WORK_PACKAGE_AND_HANDOFF.template.md` 复制到目标项目根目录，并移除文件名中的 `.template`。
4. 将 `ROLE_CHAT_STARTER_PROMPTS.md` 一并复制到目标项目，作为建组材料。
5. 全局替换下列占位符。
6. 创建产品经理主 Chat，并命名为 `{{PROJECT_NAME}}产品经理-项目总控`。
7. 让产品经理先检查项目代码和文档，再提出适合该项目的组织方案。
8. 用户批准组织方案后，按 `ROLE_CHAT_STARTER_PROMPTS.md` 创建和初始化长期角色 Chat。
9. 将 Chat 名称、任务 ID、状态和职责登记在 `ROLE_CHAT_REGISTRY.md`。
10. 后续所有已批准研发工作由产品经理通过长期角色 Chat 派发，并维护单一写入队列。

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

没有对应内容时，把占位符替换为“暂无”，不要保留未解释的模板变量。

角色范围、里程碑、风险和工作包中的其他占位符按文字语义逐项填写。完成初始化后可用下面的命令查找遗漏：

```text
rg -n '\{\{[^}]+\}\}' AGENTS.md docs ROLE_CHAT_*.md WORK_PACKAGE_*.md
```

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
- 长期角色暂时空闲不等于应撤销。只有职责确实结束、重要上下文已固化且没有未交接所有权时，才能提出归档或撤销。
- 多 Chat 不代表并行写代码。默认只允许一个写入者；其他角色可以只读评审。
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
