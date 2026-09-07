FROM nginx:1.30.4-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY assets /usr/share/nginx/html/assets
COPY README.md /usr/share/nginx/html/README.md
COPY AGENTS.template.md /usr/share/nginx/html/AGENTS.template.md
COPY MODEL_ROUTING_POLICY.template.yaml /usr/share/nginx/html/MODEL_ROUTING_POLICY.template.yaml
COPY ROLE_CHAT_REGISTRY.template.md /usr/share/nginx/html/ROLE_CHAT_REGISTRY.template.md
COPY ROLE_CHAT_STARTER_PROMPTS.md /usr/share/nginx/html/ROLE_CHAT_STARTER_PROMPTS.md
COPY WORK_PACKAGE_AND_HANDOFF.template.md /usr/share/nginx/html/WORK_PACKAGE_AND_HANDOFF.template.md
COPY docs /usr/share/nginx/html/docs
COPY .agents /usr/share/nginx/html/.agents

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health | grep -qx ok
