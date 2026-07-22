# Movie Session Management - Backend API

Sistema de gestão de sessões de cinema. Esta API REST fornece endpoints para gerenciar filmes, salas de exibição e sessões de cinema, com validação automática de conflitos de horário.

## 📋 Índice

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Banco de Dados](#-banco-de-dados)
- [Preparação para Execução Local](#-preparação-para-execução-local)
- [Funcionalidades](#-funcionalidades)
- [Regras de Negócio](#-regras-de-negócio)
- [Padrões REST](#-padrões-rest)
- [Exemplos de Uso da API](#-exemplos-de-uso-da-api)
- [Executando os Testes](#-executando-os-testes)

## 🛠 Tecnologias Utilizadas

- **Ruby**: 3.4.2
- **Rails**: 8.1.3 (modo API)
- **Banco de Dados**: PostgreSQL
  - Extensões habilitadas: `pgcrypto`, `plpgsql`
  - Driver: `pg` 1.6.3
- **Servidor Web**: Puma 8.0.2
- **Testes**:
  - RSpec Rails 7.1.1
  - FactoryBot Rails 6.5.1
  - Faker 3.8.0
  - Shoulda Matchers 6.5.0

### Gems de Desenvolvimento e Segurança

- `bundler-audit` - Auditoria de segurança de gems
- `brakeman` - Análise estática de vulnerabilidades
- `rubocop-rails-omakase` - Linter e style guide
- `debug` - Debugger
- `thruster` - HTTP asset caching/compression

## 💾 Banco de Dados

### PostgreSQL

O sistema utiliza PostgreSQL com as seguintes características:

- **Extensão pgcrypto**: Habilitada para geração de UUIDs
- **IDs**: Todas as tabelas utilizam UUID como chave primária (via `gen_random_uuid()`)
- **Configuração**: Via variáveis de ambiente (ver seção de preparação)

### Estrutura de Dados

O banco possui três tabelas principais:

#### Movies (Filmes)
- `id` (UUID, PK)
- `title` (String) - Título do filme
- `director` (String) - Diretor
- `duration` (Integer) - Duração em minutos
- `synopsis` (String, opcional) - Sinopse do filme
- `created_at`, `updated_at` (DateTime)

#### Rooms (Salas)
- `id` (UUID, PK)
- `number` (Integer, único) - Número da sala
- `created_at`, `updated_at` (DateTime)

#### Sessions (Sessões)
- `id` (UUID, PK)
- `movie_id` (UUID, FK) - Referência ao filme
- `room_id` (UUID, FK) - Referência à sala
- `starts_at` (DateTime) - Horário de início
- `ends_at` (DateTime) - Horário de término (calculado automaticamente)
- `created_at`, `updated_at` (DateTime)

### Relacionamentos

- Um filme pode ter várias sessões (1:N)
- Uma sala pode ter várias sessões (1:N)
- Exclusão de filme ou sala remove automaticamente suas sessões (`dependent: :destroy`)

## 🚀 Preparação para Execução Local

### Pré-requisitos Mínimos

1. **Ruby 3.4.2** instalado (recomenda-se uso de `rbenv` ou `mise`)
2. **PostgreSQL** instalado no sistema (não precisa estar rodando)
3. **Bundler** instalado (`gem install bundler`)

### Opção 1: Inicialização Rápida com Script Automatizado ⚡

O projeto inclui um script `start.sh` que automatiza **todo** o processo de setup e inicialização:

```bash
# Navegar para o diretório do backend
cd movie-session-management-backend

# Executar o script de inicialização
./start.sh
```

#### O que o `start.sh` faz automaticamente:

1. ✅ **Verifica e inicializa o PostgreSQL local**
   - Detecta se o PostgreSQL está rodando
   - Se não estiver, inicia automaticamente o serviço PostgreSQL (via `systemctl`, `service` ou `pg_ctlcluster`)
   - Aguarda até o PostgreSQL ficar disponível (timeout de 60s)
   - Cria automaticamente o usuário/role do PostgreSQL se não existir
   - Cria o banco de dados de desenvolvimento se não existir

2. ✅ **Verifica e instala dependências**
   - Verifica se o Bundler está disponível
   - Instala as gems do projeto (se necessário)

3. ✅ **Prepara o banco de dados**
   - Executa `rails db:prepare` (cria tabelas e roda migrations)

4. ✅ **Inicia o servidor Rails**
   - Servidor disponível em `http://localhost:3000`

#### Variáveis de ambiente opcionais:

```bash
# Customizar porta da aplicação (padrão: 3000)
PORT=4000 ./start.sh

# Customizar configurações do PostgreSQL
POSTGRES_USER=meuusuario \
POSTGRES_PASSWORD=minhasenha \
POSTGRES_PORT=5433 \
./start.sh
```

**Valores padrão:**
- `PORT=3000` - Porta da aplicação Rails
- `POSTGRES_USER=postgres` - Usuário do PostgreSQL
- `POSTGRES_PASSWORD=postgres` - Senha do PostgreSQL
- `POSTGRES_PORT=5432` - Porta do PostgreSQL
- `POSTGRES_DB=movie_session_management_backend_development` - Nome do banco

O servidor estará disponível em `http://localhost:3000` (ou na porta configurada).

> **💡 Por que usar o `start.sh` ao invés do `bin/setup`?**
>
> O `start.sh` é mais robusto para ambientes de desenvolvimento local, pois:
> - Gerencia automaticamente o serviço PostgreSQL (não requer que ele já esteja rodando)
> - Cria automaticamente o usuário e banco de dados do PostgreSQL
> - Suporta múltiplas formas de inicialização do PostgreSQL (systemctl, service, pg_ctlcluster)
> - Ideal para ambientes WSL, Linux e macOS
>
> O `bin/setup` padrão do Rails assume que o PostgreSQL já está configurado e rodando.

### Opção 2: Configuração Manual Passo a Passo

Se preferir executar os passos manualmente ou precisar de mais controle sobre cada etapa:

1. **Clone o repositório e navegue até o diretório do backend:**

```bash
cd movie-session-management-backend
```

2. **Instale as dependências:**

```bash
bundle install
```

3. **Configure as variáveis de ambiente (opcional):**

Crie um arquivo `.env` na raiz do projeto ou exporte as variáveis:

```bash
# Configurações do PostgreSQL (opcional, valores padrão)
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
```

4. **Crie o banco de dados:**

```bash
rails db:create
```

5. **Execute as migrations:**

```bash
rails db:migrate
```

6. **(Opcional) Popular o banco com dados de exemplo:**

```bash
rails db:seed
```

7. **Inicie o servidor:**

```bash
rails server
# ou
rails s
```

O servidor estará disponível em `http://localhost:3000`.

### Verificação de Saúde

Para verificar se a aplicação está rodando corretamente:

```bash
curl http://localhost:3000/up
```

Deve retornar status 200 se tudo estiver funcionando.

### Troubleshooting

**Se o PostgreSQL não iniciar automaticamente:**

```bash
# Verifique o status do PostgreSQL
sudo systemctl status postgresql
# ou
sudo service postgresql status

# Tente iniciar manualmente
sudo systemctl start postgresql
# ou
sudo service postgresql start

# Verifique se está acessível
pg_isready -h localhost -p 5432
```

**Se houver erro de permissão no PostgreSQL:**

O script `init-postgres-local.sh` precisa de permissões sudo para gerenciar o serviço PostgreSQL. Certifique-se de que seu usuário tem permissões sudo ou execute como usuário `postgres`.

## ✨ Funcionalidades

A API oferece operações CRUD completas para três recursos:

### 1. Filmes (Movies)
- Listar todos os filmes
- Visualizar detalhes de um filme
- Criar novo filme
- Atualizar filme existente
- Excluir filme (remove automaticamente todas as sessões associadas)

### 2. Salas (Rooms)
- Listar todas as salas
- Visualizar detalhes de uma sala
- Criar nova sala
- Atualizar sala existente
- Excluir sala (remove automaticamente todas as sessões associadas)

### 3. Sessões (Sessions)
- Listar todas as sessões
- Visualizar detalhes de uma sessão
- Criar nova sessão (com validações automáticas)
- Atualizar sessão existente (com validações automáticas)
- Excluir sessão

## 📐 Regras de Negócio

### Filmes (Movies)

- **Título**: obrigatório
- **Diretor**: obrigatório
- **Duração**: obrigatória, deve ser maior que 0 (em minutos)
- **Sinopse**: opcional

### Salas (Rooms)

- **Número**: obrigatório, deve ser um inteiro positivo maior que 0 e único

### Sessões (Sessions)

#### Validações de Horário

1. **Horário de início obrigatório**: `starts_at` não pode ser vazio
2. **Não pode ser no passado**: O horário de início deve ser maior que o momento atual
3. **Antecedência mínima**: A sessão deve ser agendada com pelo menos 30 minutos de antecedência
4. **Horário de término automático**: O `ends_at` é calculado automaticamente somando `starts_at + duration` (duração do filme em minutos)

#### Validação de Conflito de Horários

O sistema valida automaticamente se há conflito de horários na mesma sala através do `NoOverlappingSessionValidator`:

- **Regra**: Não pode haver duas sessões na mesma sala com horários sobrepostos
- **Algoritmo**: Verifica se existe outra sessão na mesma sala onde:
  ```
  nova_sessão.starts_at < sessão_existente.ends_at 
  E 
  nova_sessão.ends_at > sessão_existente.starts_at
  ```
- **Mensagem de erro**: "There is already a session in this room at that time"

#### Integridade Referencial

- **Filme**: obrigatório, deve existir no banco
- **Sala**: obrigatória, deve existir no banco

## 🌐 Padrões REST

A API segue os padrões REST convencionais do Rails, com respostas em formato JSON.

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/movies` | Lista todos os filmes |
| GET | `/movies/:id` | Retorna um filme específico |
| POST | `/movies` | Cria um novo filme |
| PUT/PATCH | `/movies/:id` | Atualiza um filme |
| DELETE | `/movies/:id` | Remove um filme |
| GET | `/rooms` | Lista todas as salas |
| GET | `/rooms/:id` | Retorna uma sala específica |
| POST | `/rooms` | Cria uma nova sala |
| PUT/PATCH | `/rooms/:id` | Atualiza uma sala |
| DELETE | `/rooms/:id` | Remove uma sala |
| GET | `/sessions` | Lista todas as sessões |
| GET | `/sessions/:id` | Retorna uma sessão específica |
| POST | `/sessions` | Cria uma nova sessão |
| PUT/PATCH | `/sessions/:id` | Atualiza uma sessão |
| DELETE | `/sessions/:id` | Remove uma sessão |

### Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida (GET, PUT/PATCH)
- **201 Created**: Recurso criado com sucesso (POST)
- **204 No Content**: Recurso removido com sucesso (DELETE)
- **422 Unprocessable Content**: Erros de validação

### Formato de Respostas

#### Sucesso (Listagem de Filmes)
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Matrix",
    "director": "Lana Wachowski",
    "duration": 136,
    "synopsis": "Um programador descobre a verdade sobre a realidade...",
    "created_at": "2026-07-22T10:00:00.000Z",
    "updated_at": "2026-07-22T10:00:00.000Z"
  }
]
```

#### Erro de Validação (422)
```json
{
  "title": ["can't be blank"],
  "duration": ["must be greater than 0"]
}
```

## 📖 Exemplos de Uso da API

### Criar um Filme

```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "director": "Christopher Nolan",
    "duration": 148,
    "synopsis": "A thief who steals corporate secrets..."
  }'
```

**Resposta (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Inception",
  "director": "Christopher Nolan",
  "duration": 148,
  "synopsis": "A thief who steals corporate secrets...",
  "created_at": "2026-07-22T15:30:00.000Z",
  "updated_at": "2026-07-22T15:30:00.000Z"
}
```

### Criar uma Sala

```bash
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "room": {
      "number": 1
    }
  }'
```

**Resposta (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "number": 1,
  "created_at": "2026-07-22T15:32:00.000Z",
  "updated_at": "2026-07-22T15:32:00.000Z"
}
```

### Criar uma Sessão

```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "movie_id": "550e8400-e29b-41d4-a716-446655440000",
      "room_id": "660e8400-e29b-41d4-a716-446655440001",
      "starts_at": "2026-07-23T20:00:00Z"
    }
  }'
```

**Resposta (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "movie_id": "550e8400-e29b-41d4-a716-446655440000",
  "room_id": "660e8400-e29b-41d4-a716-446655440001",
  "starts_at": "2026-07-23T20:00:00.000Z",
  "ends_at": "2026-07-23T22:28:00.000Z",
  "created_at": "2026-07-22T15:35:00.000Z",
  "updated_at": "2026-07-22T15:35:00.000Z"
}
```

**Nota**: O campo `ends_at` é calculado automaticamente (starts_at + duration do filme).

### Listar Todas as Sessões

```bash
curl http://localhost:3000/sessions
```

### Atualizar uma Sessão

```bash
curl -X PATCH http://localhost:3000/sessions/770e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "starts_at": "2026-07-23T21:00:00Z"
    }
  }'
```

### Deletar uma Sessão

```bash
curl -X DELETE http://localhost:3000/sessions/770e8400-e29b-41d4-a716-446655440002
```

### Exemplo de Erro: Conflito de Horário

Tentando criar uma sessão que conflita com outra:

```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "movie_id": "550e8400-e29b-41d4-a716-446655440000",
      "room_id": "660e8400-e29b-41d4-a716-446655440001",
      "starts_at": "2026-07-23T21:30:00Z"
    }
  }'
```

**Resposta (422 Unprocessable Content):**
```json
{
  "base": ["There is already a session in this room at that time"]
}
```

### Exemplo de Erro: Sessão com Antecedência Insuficiente

```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "movie_id": "550e8400-e29b-41d4-a716-446655440000",
      "room_id": "660e8400-e29b-41d4-a716-446655440001",
      "starts_at": "2026-07-22T15:40:00Z"
    }
  }'
```

**Resposta (422 Unprocessable Content):**
```json
{
  "starts_at": ["must be at least 30 minutes from now"]
}
```

## 🧪 Executando os Testes

O projeto utiliza RSpec como framework de testes.

### Executar todos os testes

```bash
bundle exec rspec
```

### Executar testes específicos

```bash
# Testes de um modelo específico
bundle exec rspec spec/models/session_spec.rb

# Testes de um controller específico
bundle exec rspec spec/requests/sessions_spec.rb

# Executar um teste específico por linha
bundle exec rspec spec/models/session_spec.rb:10
```

### Verificar cobertura de testes

Os testes incluem:
- **Model specs**: Validações, callbacks e associações
- **Request specs**: Testes de integração dos endpoints da API
- **Validator specs**: Testes customizados de validação

## 📝 Notas Adicionais

### UUIDs como Chave Primária

O sistema foi configurado para utilizar UUIDs ao invés de integers sequenciais como chave primária:

- **Vantagens**: Maior segurança (não expõe quantidade de registros), facilita merge de bancos distribuídos, elimina colisões em sistemas distribuídos
- **Implementação**: Via `config/application.rb` com `g.orm :active_record, primary_key_type: :uuid`

### Modo API-Only

O Rails foi configurado no modo API-only (`--api`):
- Sem views, sem asset pipeline
- Controladores herdam de `ActionController::API`
- Focado em performance e simplicidade para APIs REST

### Timezone

O sistema utiliza UTC como timezone padrão. Todas as datas são armazenadas e retornadas em UTC.

## 🔒 Segurança

- **bundler-audit**: Verifica vulnerabilidades conhecidas em gems
- **brakeman**: Análise estática de segurança do código Rails
- **Strong Parameters**: Proteção contra mass assignment
- **UUIDs**: Dificulta enumeração de recursos

---

Desenvolvido com ❤️ usando Ruby on Rails
