FROM nginx:1.30.4-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY assets /usr/share/nginx/html/assets
COPY ["Codex 多 Chat 产品研发治理模板", "/usr/share/nginx/html/Codex 多 Chat 产品研发治理模板"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health | grep -qx ok

