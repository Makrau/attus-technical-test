#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PORT="${PORT:-3000}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"

echo "==> Verificando PostgreSQL local..."
if pg_isready -h localhost -p "$POSTGRES_PORT" -U "$POSTGRES_USER" >/dev/null 2>&1 \
  || pg_isready -h localhost -p "$POSTGRES_PORT" >/dev/null 2>&1; then
  echo "==> PostgreSQL já está em execução em localhost:${POSTGRES_PORT}."
else
  echo "==> PostgreSQL não está disponível. Inicializando..."
  bash "$SCRIPT_DIR/init-postgres-local.sh"
fi

if ! command -v bundle >/dev/null 2>&1; then
  echo "Erro: bundle não encontrado. Instale o Ruby e o Bundler e tente novamente." >&2
  exit 1
fi

echo "==> Verificando dependências do Bundler..."
bundle check >/dev/null 2>&1 || bundle install

echo "==> Preparando banco e rodando migrações..."
bundle exec rails db:prepare

echo "==> Subindo a aplicação Rails em http://localhost:${PORT}"
exec bundle exec rails server -b 0.0.0.0 -p "$PORT"
