# Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts
COPY . .
# Env VITE_* được bake lúc build; truyền qua --build-arg khi cần đổi theo môi trường.
ARG VITE_API_BASE_URL=/api
ARG VITE_ENABLE_MOCK_API=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL VITE_ENABLE_MOCK_API=$VITE_ENABLE_MOCK_API
RUN yarn build

# Serve
FROM nginx:1.27-alpine
# nginx image tự chạy envsubst cho /etc/nginx/templates/*.template lúc start.
COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV API_UPSTREAM=http://api:3000
# Image nginx tự đọc /etc/resolv.conf ra NGINX_LOCAL_RESOLVERS khi bật cờ này.
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1
# Chỉ thay 2 biến này; giữ nguyên $host, $remote_addr... của nginx trong template.
ENV NGINX_ENVSUBST_FILTER="^(API_UPSTREAM|NGINX_LOCAL_RESOLVERS)$"
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/healthz || exit 1
