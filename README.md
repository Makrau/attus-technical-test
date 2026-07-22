# Sistema de Gestão de Sessões de Filmes

Sistema completo para gestão de sessões de cinema, desenvolvido como teste técnico para a Attus.

## 📂 Estrutura do Monorepo

Este repositório é organizado como um monorepo contendo:

```
/
├── frontend/                 → Vue 3 (planejado)
└── movie-session-management-backend/  → API Rails 8 (implementação atual)
```

## 🎯 Visão Geral do Backend

O backend é uma **API REST** completa desenvolvida em **Ruby on Rails 8** (modo API-only) que gerencia:

- **Filmes** (`Movies`) - Cadastro de filmes com título, diretor, duração e sinopse
- **Salas** (`Rooms`) - Gestão de salas de exibição
- **Sessões** (`Sessions`) - Agendamento de sessões de cinema com validação automática de conflitos

### 🔑 Características Principais

#### Validações Inteligentes
- **Prevenção de conflitos**: Não permite agendamento de duas sessões na mesma sala com horários sobrepostos
- **Regras de antecedência**: Sessões devem ser agendadas com pelo menos 30 minutos de antecedência
- **Cálculo automático**: O horário de término das sessões é calculado automaticamente baseado na duração do filme

#### Arquitetura Moderna
- **API-Only Rails**: Sem views ou asset pipeline, focado em performance
- **UUIDs**: Todas as tabelas utilizam UUID como chave primária (via `pgcrypto`)
- **PostgreSQL**: Banco de dados robusto com extensões nativas
- **Padrões REST**: Endpoints RESTful com respostas em JSON

#### Qualidade de Código
- **Testes completos**: RSpec com model specs, request specs e validator specs
- **Factory Bot**: Fixtures de teste usando Factory Bot e Faker
- **Segurança**: Análise com Brakeman e Bundler Audit
- **Linting**: Rubocop Rails Omakase

### 📊 Stack Tecnológico

| Componente | Tecnologia | Versão |
|------------|-----------|--------|
| Linguagem | Ruby | 3.4.2 |
| Framework | Rails | 8.1.3 |
| Banco de Dados | PostgreSQL | (com extensões pgcrypto, plpgsql) |
| Servidor Web | Puma | 8.0.2 |
| Testes | RSpec Rails | 7.1.1 |
| Fixtures | Factory Bot | 6.5.1 |
| Data Faker | Faker | 3.8.0 |
| Matchers | Shoulda Matchers | 6.5.0 |

### 🚀 Quick Start

#### Opção 1: Inicialização Rápida com Script Automatizado ⚡

O script `start.sh` automatiza todo o processo, incluindo inicialização do PostgreSQL:

```bash
# Navegar para o diretório do backend
cd movie-session-management-backend

# Executar script de inicialização (gerencia PostgreSQL, instala dependências, cria banco, inicia servidor)
./start.sh
```

A API estará disponível em `http://localhost:3000`.

**O que o script faz:**
- Verifica e inicia o PostgreSQL local automaticamente
- Cria usuário e banco de dados do PostgreSQL se necessário
- Instala dependências do projeto
- Executa migrations
- Inicia o servidor Rails

#### Opção 2: Configuração Manual

```bash
# Navegar para o diretório do backend
cd movie-session-management-backend

# Certifique-se de que o PostgreSQL está rodando
# sudo systemctl start postgresql  # ou
# sudo service postgresql start

# Instalar dependências
bundle install

# Criar e configurar o banco de dados
rails db:create db:migrate

# Iniciar o servidor
rails server
```

A API estará disponível em `http://localhost:3000`.

### 📚 Documentação Completa

Para informações detalhadas sobre:
- Instalação e configuração
- Endpoints disponíveis
- Regras de negócio
- Exemplos de uso da API
- Estrutura do banco de dados
- Execução de testes

Consulte o [README do Backend](./movie-session-management-backend/README.md).

### 🔗 Endpoints Principais

#### Filmes
- `GET /movies` - Lista todos os filmes
- `POST /movies` - Cria um novo filme
- `GET /movies/:id` - Retorna um filme específico
- `PATCH /movies/:id` - Atualiza um filme
- `DELETE /movies/:id` - Remove um filme

#### Salas
- `GET /rooms` - Lista todas as salas
- `POST /rooms` - Cria uma nova sala
- `GET /rooms/:id` - Retorna uma sala específica
- `PATCH /rooms/:id` - Atualiza uma sala
- `DELETE /rooms/:id` - Remove uma sala

#### Sessões
- `GET /sessions` - Lista todas as sessões
- `POST /sessions` - Cria uma nova sessão (com validação de conflitos)
- `GET /sessions/:id` - Retorna uma sessão específica
- `PATCH /sessions/:id` - Atualiza uma sessão (com validação de conflitos)
- `DELETE /sessions/:id` - Remove uma sessão

### 🎬 Exemplo de Uso

```bash
# Criar um filme
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "director": "Christopher Nolan",
    "duration": 148,
    "synopsis": "A thief who steals corporate secrets..."
  }'

# Criar uma sala
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{"room": {"number": 1}}'

# Criar uma sessão
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "movie_id": "uuid-do-filme",
      "room_id": "uuid-da-sala",
      "starts_at": "2026-07-23T20:00:00Z"
    }
  }'
```

### 🧪 Testes

O projeto possui cobertura completa de testes:

```bash
cd movie-session-management-backend
bundle exec rspec
```

## 🔮 Frontend (Planejado)

O frontend será desenvolvido em **Vue 3**, consumindo a API Rails via JSON.

## 📝 Escopo do Projeto

**O que o sistema faz:**
- ✅ CRUD completo de filmes
- ✅ CRUD completo de salas de exibição
- ✅ CRUD completo de sessões de cinema
- ✅ Validação de conflitos de horário por sala
- ✅ Cálculo automático de horário de término

**O que o sistema NÃO faz:**
- ❌ Gestão de reservas ou ingressos
- ❌ Sistema de pagamento
- ❌ Autenticação e autorização
- ❌ Gestão de assentos

O foco está exclusivamente no **gerenciamento de sessões**, com relacionamento entre filmes e salas, e validação de choque de horário por sala.

## 🤝 Contribuindo

Este é um projeto de teste técnico. Para mais informações sobre a estrutura e padrões adotados, consulte os arquivos de regras em `.cursor/rules/`.

---

Desenvolvido com ❤️ para o teste técnico da Attus
