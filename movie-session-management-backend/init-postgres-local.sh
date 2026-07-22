#!/usr/bin/env bash
set -euo pipefail

MAX_WAIT_SECONDS=60
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-movie_session_management_backend_development}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"

run_as_postgres() {
  if [[ "$(id -un)" == "postgres" ]]; then
    "$@"
  elif command -v sudo >/dev/null 2>&1; then
    sudo -u postgres "$@"
  else
    echo "Erro: execute este script como usuário postgres ou com sudo disponível." >&2
    exit 1
  fi
}

start_postgres() {
  if command -v pg_lsclusters >/dev/null 2>&1; then
    local version name port status
    while read -r version name port status _; do
      [[ -z "${version:-}" || "$version" == "Ver" ]] && continue
      if [[ "$status" != "online" ]]; then
        echo "==> Iniciando cluster PostgreSQL ${version}/${name}..."
        if command -v sudo >/dev/null 2>&1; then
          sudo pg_ctlcluster "$version" "$name" start
        else
          pg_ctlcluster "$version" "$name" start
        fi
      else
        echo "==> Cluster PostgreSQL ${version}/${name} já está online."
      fi
    done < <(pg_lsclusters --no-header 2>/dev/null || pg_lsclusters | tail -n +2)
    return 0
  fi

  if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files postgresql.service >/dev/null 2>&1; then
    echo "==> Iniciando serviço postgresql via systemctl..."
    if command -v sudo >/dev/null 2>&1; then
      sudo systemctl start postgresql
    else
      systemctl start postgresql
    fi
    return 0
  fi

  if command -v service >/dev/null 2>&1; then
    echo "==> Iniciando serviço postgresql via service..."
    if command -v sudo >/dev/null 2>&1; then
      sudo service postgresql start
    else
      service postgresql start
    fi
    return 0
  fi

  echo "Erro: não foi possível determinar como iniciar o PostgreSQL local." >&2
  echo "Instale o pacote postgresql (ex.: sudo apt install postgresql postgresql-contrib)." >&2
  exit 1
}

ensure_role_and_database() {
  echo "==> Garantindo role e database de desenvolvimento..."

  run_as_postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${POSTGRES_USER}') THEN
    CREATE ROLE ${POSTGRES_USER} LOGIN PASSWORD '${POSTGRES_PASSWORD}' SUPERUSER;
  ELSE
    ALTER ROLE ${POSTGRES_USER} WITH LOGIN PASSWORD '${POSTGRES_PASSWORD}' SUPERUSER;
  END IF;
END
\$\$;

SELECT 'ok' WHERE EXISTS (
  SELECT FROM pg_database WHERE datname = '${POSTGRES_DB}'
);
SQL

  if ! run_as_postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB}'" | grep -q 1; then
    run_as_postgres createdb -O "$POSTGRES_USER" "$POSTGRES_DB"
  fi
}

if ! command -v psql >/dev/null 2>&1; then
  echo "Erro: psql não encontrado. Instale o PostgreSQL localmente e tente novamente." >&2
  echo "Exemplo (Debian/Ubuntu): sudo apt install postgresql postgresql-contrib" >&2
  exit 1
fi

if ! command -v pg_isready >/dev/null 2>&1; then
  echo "Erro: pg_isready não encontrado. Instale o cliente PostgreSQL e tente novamente." >&2
  exit 1
fi

start_postgres

echo "==> Aguardando PostgreSQL local ficar pronto..."
elapsed=0
until pg_isready -h localhost -p "$POSTGRES_PORT" -U "$POSTGRES_USER" >/dev/null 2>&1 \
   || pg_isready -p "$POSTGRES_PORT" >/dev/null 2>&1; do
  if (( elapsed >= MAX_WAIT_SECONDS )); then
    echo "Erro: PostgreSQL local não ficou pronto em ${MAX_WAIT_SECONDS}s." >&2
    exit 1
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done

ensure_role_and_database

echo "==> PostgreSQL local pronto em localhost:${POSTGRES_PORT}"
echo "    usuário: ${POSTGRES_USER}"
echo "    senha:   ${POSTGRES_PASSWORD}"
echo "    database: ${POSTGRES_DB}"
