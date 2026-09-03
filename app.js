"use strict";

const ROOT = "./Codex 多 Chat 产品研发治理模板/";

const groups = [
  {
    name: "入门",
    documents: [
      { id: "readme", title: "使用说明", path: `${ROOT}README.md` },
      { id: "agents", title: "项目指令模板", path: `${ROOT}AGENTS.template.md` }
    ]
  },
  {
    name: "角色与协作",
    documents: [
      { id: "starters", title: "角色 Chat 启动词", path: `${ROOT}ROLE_CHAT_STARTER_PROMPTS.md` },
      { id: "registry", title: "角色 Chat 登记表", path: `${ROOT}ROLE_CHAT_REGISTRY.template.md` },
      { id: "work-package", title: "工作包与交接", path: `${ROOT}WORK_PACKAGE_AND_HANDOFF.template.md` },
      { id: "pm-charter", title: "产品经理角色章程", path: `${ROOT}docs/PRODUCT_MANAGER_CHARTER.template.md` },
      { id: "org-chart", title: "组织架构", path: `${ROOT}docs/ORG_CHART.template.md` }
    ]
  },
  {
    name: "项目治理",
    documents: [
      { id: "product-context", title: "产品与团队上下文", path: `${ROOT}docs/PRODUCT_CONTEXT.template.md` },
      { id: "decisions", title: "决策日志", path: `${ROOT}docs/DECISION_LOG.template.md` },
      { id: "workflow", title: "研发与备份流程", path: `${ROOT}docs/DEVELOPMENT_WORKFLOW.template.md` }
    ]
  }
];

const documents = groups.flatMap((group) => group.documents);
const nav = document.querySelector("#document-nav");
const article = document.querySelector("#document");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderInline(value) {
  const code = [];
  let output = escapeHtml(value).replace(/`([^`]+)`/g, (_match, content) => {
    const token = `@@INLINE_CODE_${code.length}@@`;
    code.push(`<code>${content}</code>`);
    return token;
  });

  output = output
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  code.forEach((snippet, index) => {
    output = output.replace(`@@INLINE_CODE_${index}@@`, snippet);
  });
  return output;
}

function isTableDivider(line) {
  return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
}

function tableCells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const content = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        content.push(lines[index]);
        index += 1;
      }
      index += 1;
      html.push(`<pre><div class="code-label">${escapeHtml(language || "text")}</div><code>${escapeHtml(content.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
      html.push("<hr>");
      index += 1;
      continue;
    }

    if (index + 1 < lines.length && line.includes("|") && isTableDivider(lines[index + 1])) {
      const headers = tableCells(line);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      html.push(`<div class="table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote>${quote.map(renderInline).join("<br>")}</blockquote>`);
      continue;
    }

    const unordered = line.match(/^\s*[-+*]\s+(.+)$/);
    if (unordered) {
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*[-+*]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      html.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (ordered) {
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*\d+[.)]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      html.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,6})\s+/.test(lines[index]) && !lines[index].startsWith("```") && !/^\s*(?:[-+*]\s+|\d+[.)]\s+|>\s?)/.test(lines[index])) {
      if (index + 1 < lines.length && lines[index].includes("|") && isTableDivider(lines[index + 1])) break;
      paragraph.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}

function renderNav() {
  nav.innerHTML = groups.map((group) => `
    <section class="nav-group">
      <h3>${escapeHtml(group.name)}</h3>
      ${group.documents.map((doc) => `<button type="button" data-doc-id="${doc.id}">${escapeHtml(doc.title)}<span aria-hidden="true">↗</span></button>`).join("")}
    </section>
  `).join("");
}

function setActive(id) {
  document.querySelectorAll("[data-doc-id]").forEach((button) => {
    const active = button.dataset.docId === id;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

async function openDocument(id, updateHistory = true) {
  const doc = documents.find((candidate) => candidate.id === id) || documents[0];
  setActive(doc.id);
  article.innerHTML = `<div class="document__status">正在载入“${escapeHtml(doc.title)}”…</div>`;

  try {
    const response = await fetch(doc.path, { headers: { Accept: "text/markdown, text/plain" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    article.innerHTML = `<div class="document__meta"><span>Markdown 模板</span><a href="${encodeURI(doc.path)}" download>下载原文件</a></div>${markdownToHtml(markdown)}`;
    document.title = `${doc.title} · Codex 多 Chat 治理模板`;
    if (updateHistory) {
      const url = new URL(window.location.href);
      url.searchParams.set("doc", doc.id);
      window.history.pushState({ doc: doc.id }, "", url);
    }
    article.focus({ preventScroll: true });
    if (updateHistory) {
      document.querySelector("#workspace").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    article.innerHTML = `<div class="document__error"><h2>文档暂时无法载入</h2><p>${escapeHtml(error.message)}</p></div>`;
  }
}

renderNav();

nav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-doc-id]");
  if (button) openDocument(button.dataset.docId);
});

document.querySelectorAll("[data-open-doc]").forEach((button) => {
  button.addEventListener("click", () => openDocument(button.dataset.openDoc));
});

window.addEventListener("popstate", (event) => {
  const id = event.state?.doc || new URL(window.location.href).searchParams.get("doc") || "readme";
  openDocument(id, false);
});

const initialDocument = new URL(window.location.href).searchParams.get("doc") || "readme";
openDocument(initialDocument, false);
