FROM postgres:18-alpine
COPY scripts/init-dev.sql /docker-entrypoint-initdb.d/01-init.sql
