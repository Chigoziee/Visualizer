# ---- Stage 1: build frontend ----
FROM node:20-slim AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: backend runtime, serving the built frontend as static files ----
FROM python:3.11-slim AS backend
WORKDIR /srv

COPY pyproject.toml ./
COPY app/ ./app/
RUN pip install --no-cache-dir .

COPY --from=frontend-build /frontend_dist ./frontend_dist

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV DATABASE_URL=sqlite:////srv/data/app.db
VOLUME ["/srv/data", "/srv/storage"]

EXPOSE 8000
ENTRYPOINT ["docker-entrypoint.sh"]
