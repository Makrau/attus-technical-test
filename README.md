# Sistema de Gestão de Sessões de Cinema

Sistema completo (backend + frontend) para gerenciamento de sessões de cinema, permitindo o cadastro de filmes, salas e sessões com validação inteligente de conflitos de horário.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura Geral](#arquitetura-geral)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Execução](#configuração-e-execução)
- [Estrutura do Monorepo](#estrutura-do-monorepo)
- [Decisões Técnicas e Arquiteturais](#decisões-técnicas-e-arquiteturais)
- [Trade-offs e Limitações](#trade-offs-e-limitações)
- [Evoluções Futuras](#evoluções-futuras)
- [Contexto de Desenvolvimento](#contexto-de-desenvolvimento)
- [Documentação Adicional](#documentação-adicional)

## 🎬 Sobre o Projeto

Sistema web desenvolvido como teste técnico que implementa um CRUD completo para gestão de sessões de cinema. O foco principal está no gerenciamento de sessões com **validação de choque de horários** entre sessões na mesma sala.

### Funcionalidades Principais

#### 🎥 Gestão de Filmes
- Cadastro com título, diretor, duração (minutos) e sinopse
- Listagem ordenada por título
- Edição e exclusão

#### 🚪 Gestão de Salas
- Cadastro de salas com número único
- Listagem ordenada por número
- Edição e exclusão

#### 🎫 Gestão de Sessões (Foco Principal)
- Criação vinculando filme e sala
- Validações inteligentes:
  - **Conflito de horário**: Mesma sala não pode ter sessões sobrepostas
  - **Antecedência**: Mínimo de 30 minutos de antecedência
  - **Passado**: Data/hora não pode ser no passado
- Cálculo automático de horário de término baseado na duração do filme
- Listagem com detalhes completos (nome do filme, número da sala, horários)

### Tecnologias Utilizadas

**Backend:**
- Ruby 3.3.0
- Rails 8.0 (API mode)
- PostgreSQL 16
- UUIDs como chave primária (via pgcrypto)

**Frontend:**
- Vue 3.5
- TypeScript 5.6
- Vite 8.0
- Pinia (state management)
- Axios (HTTP client)

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vue 3)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Views → Components → Stores → API Client       │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                          │
                    HTTP/JSON (REST)
                          │
┌──────────────────────────┴──────────────────────────────┐
│                    BACKEND (Rails 8)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Controllers → Models → Validators → Database   │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                          │
                    PostgreSQL
                          │
┌──────────────────────────┴──────────────────────────────┐
│              Database (PostgreSQL 16)                   │
│  movies, rooms, sessions (com UUIDs)                   │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Pré-requisitos

### Sistema Operacional
- **Linux** (testado em Ubuntu 22.04 LTS via WSL 2)
- **macOS** (compatível)
- **Windows** via WSL 2 (recomendado) ou Docker

### Backend (Rails)
- **Ruby**: 3.3.0
- **Rails**: 8.0+
- **PostgreSQL**: 14+
- **Bundler**: 2.5+

### Frontend (Vue)
- **Node.js**: v20.18.0+ (recomendado v22.18.0+)
- **npm**: v10.0.0+

### Ferramentas Auxiliares
- **Git**: Para controle de versão
- **curl** ou **Postman**: Para testar API (opcional)

## 🚀 Configuração e Execução

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd attus-technical-test
```

### 2. Configurar e Iniciar o Backend

```bash
cd movie-session-management-backend

# Instalar dependências Ruby
bundle install

# Configurar banco de dados (cria, migra e popula com dados de exemplo)
./start.sh

# Servidor Rails estará rodando em http://localhost:3000
```

**O script `start.sh` faz:**
1. Cria o banco de dados PostgreSQL
2. Executa as migrations
3. Popula com dados iniciais (seed)
4. Inicia o servidor Rails na porta 3000

**Alternativa (passo a passo manual):**
```bash
# Criar banco
rails db:create

# Executar migrations
rails db:migrate

# Popular com dados (opcional)
rails db:seed

# Iniciar servidor
rails server
```

### 3. Configurar e Iniciar o Frontend

Em um **novo terminal**:

```bash
cd movie-session-management-frontend

# Instalar dependências
npm install

# Criar arquivo de configuração
cp .env.example .env.local

# Editar .env.local se necessário (valores padrão já funcionam)
# VITE_API_BASE_URL=http://localhost:3000/api/v1
# VITE_API_TIMEOUT=10000

# Iniciar servidor de desenvolvimento
npm run dev

# Frontend estará disponível em http://localhost:5173
```

### 4. Acessar a Aplicação

Abra seu navegador em: **http://localhost:5173**

**Credenciais:** Não há autenticação (sistema administrativo interno)

## 📁 Estrutura do Monorepo

```
attus-technical-test/
├── movie-session-management-backend/    # Backend Rails
│   ├── app/
│   │   ├── controllers/                 # API Controllers
│   │   ├── models/                      # Modelos de domínio
│   │   └── validators/                  # Validadores customizados
│   ├── db/
│   │   ├── migrate/                     # Migrations
│   │   └── seeds.rb                     # Dados iniciais
│   ├── config/
│   │   ├── routes.rb                    # Rotas da API
│   │   └── database.yml                 # Configuração do banco
│   ├── start.sh                         # Script de inicialização
│   └── README.md                        # Documentação do backend
│
├── movie-session-management-frontend/   # Frontend Vue
│   ├── src/
│   │   ├── api/                         # Cliente HTTP
│   │   ├── components/                  # Componentes Vue
│   │   ├── stores/                      # Pinia stores
│   │   ├── views/                       # Páginas
│   │   └── router/                      # Rotas
│   ├── docs/                            # Documentação detalhada
│   │   ├── setup.md                     # Guia de configuração
│   │   ├── architecture.md              # Arquitetura frontend
│   │   └── deployment.md                # Guia de deploy
│   └── README.md                        # Documentação do frontend
│
├── openspec/                            # Especificações do projeto
│   └── changes/
│       └── build-frontend-admin-panel/
│           ├── tasks.md                 # Tarefas implementadas
│           └── specs/                   # Especificações técnicas
│
└── README.md                            # Este arquivo
```

## 🎯 Decisões Técnicas e Arquiteturais

### Backend (Rails)

#### 1. **Rails 8 em Modo API**
**Decisão:** Usar Rails sem views, assets ou helpers de frontend.

**Justificativa:**
- Aplicação moderna com frontend separado
- API JSON pura e performática
- Reduz complexidade e tamanho do bundle
- Facilita versionamento e documentação da API

**Trade-off:** Não aproveita sistema de views do Rails, mas ganha em clareza e separação de responsabilidades.

#### 2. **UUIDs como Chave Primária**
**Decisão:** Usar UUIDs (via extensão pgcrypto) ao invés de IDs incrementais.

**Justificativa:**
- Segurança: IDs não são sequenciais/previsíveis
- Distribuição: Facilita replicação e merge de bancos
- Migração: IDs únicos globalmente facilitam integrações futuras
- Escalabilidade: Permite geração de IDs no client-side se necessário

**Trade-off:** 
- UUIDs ocupam mais espaço (128 bits vs 32/64 bits)
- Performance de join ligeiramente inferior em tabelas muito grandes
- **Decisão:** Para o escopo deste projeto (cinema), os benefícios superam os custos

#### 3. **Validator Customizado para Conflitos**
**Decisão:** `NoOverlappingSessionValidator` como Active Model Validator.

**Justificativa:**
- Encapsula lógica complexa de validação
- Reutilizável e testável isoladamente
- Mensagens de erro contextuais e específicas
- Mantém controllers limpos

**Implementação:**
```ruby
# Verifica se há outra sessão na mesma sala que:
# 1. Começa antes desta terminar, E
# 2. Termina depois desta começar
# = CONFLITO
```

#### 4. **Validação de Antecedência (30 minutos)**
**Decisão:** Sessão deve começar pelo menos 30 minutos no futuro.

**Justificativa:**
- Tempo mínimo para preparação da sala
- Evita criação de sessões já passadas
- Buffer para operações de cinema

**Trade-off:** Em produção, esse valor poderia ser configurável por cinema.

### Frontend (Vue 3)

#### 1. **Atomic Design**
**Decisão:** Organizar componentes em atoms → molecules → organisms.

**Justificativa:**
- Reutilização máxima de código
- Hierarquia clara de dependências
- Facilita testes isolados
- Padrão reconhecido pela indústria

**Estrutura:**
- **Atoms**: Button, Input, Card (básicos, sem dependências)
- **Molecules**: Modal, Toast, FormField (combinam atoms)
- **Organisms**: MovieForm, SessionForm, Tables (lógica de negócio)

#### 2. **Pinia ao invés de Vuex**
**Decisão:** Usar Pinia para gerenciamento de estado.

**Justificativa:**
- API mais simples e intuitiva
- TypeScript nativo (type inference superior)
- Composition API first
- Recomendação oficial do Vue 3
- DevTools excelente

**Trade-off:** Vuex tem mais recursos de extensibilidade (plugins), mas Pinia é suficiente e mais moderno.

#### 3. **Tradução de Erros no Frontend**
**Decisão:** Backend retorna erros em inglês, frontend traduz para português.

**Justificativa:**
- Backend mantém padrão internacional (inglês)
- Frontend adapta para UX local
- Permite múltiplas linguagens no futuro (i18n)
- Mantém API RESTful e desacoplada

**Implementação:**
```typescript
// utils/errorTranslation.ts
const errorTranslations = {
  'starts_at': {
    'cannot be in the past': 'não pode estar no passado',
    'must be at least 30 minutes': 'deve ser pelo menos 30 minutos'
  }
}
```

**Trade-off:** Duplicação de strings, mas ganha flexibilidade e separação de responsabilidades.

#### 4. **Axios ao invés de Fetch**
**Decisão:** Usar Axios como cliente HTTP.

**Justificativa:**
- Interceptors (request/response)
- Transformações automáticas de JSON
- Timeout configurável
- Cancelamento de requisições
- Melhor tratamento de erros

**Trade-off:** Adiciona dependência externa, mas funcionalidades valem a pena.

#### 5. **Error Boundary Global**
**Decisão:** Componente que captura erros não tratados do Vue.

**Justificativa:**
- Evita "tela branca da morte"
- Feedback amigável ao usuário
- Logging centralizado de erros
- Opção de reload ou retry

**Implementação:** Usa `onErrorCaptured` do Vue 3.

### Banco de Dados

#### 1. **PostgreSQL**
**Decisão:** PostgreSQL como SGBD.

**Justificativa:**
- Robustez e confiabilidade
- UUIDs nativos via extensão pgcrypto
- Suporte a JSON para futuras evoluções
- Transações ACID garantem consistência

**Trade-off:** Requer servidor PostgreSQL rodando, mas é padrão para aplicações Rails modernas.

#### 2. **Migrations Versionadas**
**Decisão:** Schema controlado por migrations do Rails.

**Justificativa:**
- Versionamento de banco junto com código
- Rollback facilitado
- Histórico de mudanças
- Deploy automatizado

## ⚖️ Trade-offs e Limitações

### Trade-offs Conscientes

#### 1. **Sem Sistema de Reservas/Ingressos**
**Decisão:** Foco exclusivo em gestão de sessões.

**Justificativa:**
- Escopo definido do teste técnico
- Permite implementação sólida do core
- Reservas/ingressos adicionariam complexidade significativa

**Limitação:** Sistema ainda não é utilizável para venda de ingressos.

#### 2. **Sem Autenticação/Autorização**
**Decisão:** Sistema aberto (sem login).

**Justificativa:**
- Foco em funcionalidades de CRUD
- Simplifica desenvolvimento e testes
- Assumido como sistema administrativo interno

**Limitação:** Não pode ser exposto publicamente sem adicionar autenticação.

#### 3. **Validação de Conflitos no Backend**
**Decisão:** Validação acontece no backend, não no frontend.

**Justificativa:**
- Única fonte de verdade
- Evita race conditions
- Segurança (frontend pode ser manipulado)

**Trade-off:** Usuário só descobre conflito após submeter formulário, mas é mais seguro.

#### 4. **Single-threaded Rails**
**Decisão:** Usar Puma em modo single-thread (padrão Rails).

**Justificativa:**
- Suficiente para desenvolvimento e provas de conceito
- Simplifica debugging
- PostgreSQL já lida com concorrência

**Limitação:** Para produção com alta carga, seria necessário configurar multi-thread/multi-process.

### Limitações Conhecidas

1. **Concorrência de Sessões**: 
   - Sem sistema de locks otimistas
   - Dois usuários podem criar sessões conflitantes simultaneamente (rare race condition)
   - **Mitigação atual**: Validação no banco + transações ACID

2. **Performance em Escala**:
   - Validação de conflitos faz query no banco a cada criação
   - **Futura solução**: Índices otimizados, cache de sessões

3. **Sem Soft Deletes**:
   - Deletar filme/sala deleta sessões associadas (cascade)
   - **Futura solução**: Soft deletes (deleted_at)

4. **Timezone**:
   - Assume horário UTC no backend
   - **Futura solução**: Suporte a múltiplos timezones

## 🚀 Evoluções Futuras

### Curto Prazo

#### 1. **Sistema de Reservas/Ingressos**
**Escopo:**
- Modelo `Ticket` com referência a `Session` e `Seat`
- Status: disponível, reservado, vendido, cancelado
- Endpoint para consultar disponibilidade em tempo real

**Desafios:**
- **Concorrência**: Múltiplos usuários comprando mesmo assento
  - **Solução**: Lock otimista com `version` ou lock pessimista
  - **Alternativa**: Redis para queue de reservas
- **Timeout de Reserva**: Reserva expira após X minutos
  - **Solução**: Background job (Sidekiq) para liberar reservas expiradas
- **Pagamento**: Integração com gateway (Stripe, PagSeguro)
  - **Solução**: State machine para fluxo de pagamento

#### 2. **Autenticação e Autorização**
**Escopo:**
- JWT para API
- Roles: admin, gerente, operador
- Permissions baseadas em roles

**Implementação:**
- Devise + JWT no backend
- Interceptor Axios para adicionar token
- Protected routes no Vue Router

#### 3. **Melhorias de UX**
- Visualização de sessões em formato de grade/calendário
- Filtros e busca avançada
- Exportação de relatórios (PDF/Excel)

### Médio Prazo

#### 4. **Sistema de Pagamentos**
**Desafios:**
- **Idempotência**: Evitar cobranças duplicadas
  - **Solução**: `idempotency_key` nas requisições
- **Reconciliação**: Webhook de confirmação assíncrono
  - **Solução**: Background jobs + retry logic
- **Estornos**: Cancelamento com reembolso
  - **Solução**: State machine com estados intermediários

#### 5. **Gestão de Assentos**
**Escopo:**
- Modelo `Seat` com layout configurável por sala
- Tipos de assento (normal, VIP, acessível)
- Seleção visual de assentos no frontend

**Implementação:**
- JSON field para layout flexível
- WebSockets para atualização em tempo real de disponibilidade

#### 6. **Concorrência Otimista**
**Problema:** Race condition em reservas simultâneas.

**Soluções:**
1. **Optimistic Locking** (simples):
```ruby
# Add version column to sessions
add_column :sessions, :lock_version, :integer, default: 0
```

2. **Redis para Queue** (robusto):
```ruby
# Fila de reservas com TTL
Redis.current.setex("seat:#{seat_id}:lock", 300, user_id)
```

3. **PostgreSQL Advisory Locks** (nativo):
```ruby
# Lock específico por sessão
ActiveRecord::Base.connection.execute(
  "SELECT pg_advisory_lock(#{session_id})"
)
```

### Longo Prazo

#### 7. **Analytics e Relatórios**
- Dashboard com métricas
- Ocupação média por sala/horário
- Previsão de demanda (ML)

#### 8. **Mobile App**
- React Native ou Flutter
- Compra de ingressos mobile
- QR Code para entrada

## 🖥️ Contexto de Desenvolvimento

### Ambiente

**Sistema Operacional:**
- Ubuntu 22.04 LTS
- Executado via WSL 2 (Windows Subsystem for Linux)
- Kernel: Linux 6.18.33.1-microsoft-standard-WSL2

**Por que WSL 2?**
- Compatibilidade total com ferramentas Linux
- Performance nativa (kernel real)
- Integração com Windows (filesystem, IDE)
- Ideal para desenvolvimento full-stack

### IDEs e Ferramentas Utilizadas

- **Cursor** com extensões:
  - Remote - WSL
  - Vue - Official (Volar)
  - Ruby LSP
  - ESLint
  - Prettier
- **PostgreSQL**: Instalado nativamente no Ubuntu
- **Git**: Integrado entre Windows e WSL

## 📚 Documentação Adicional

### Backend

- **[Backend README](./movie-session-management-backend/README.md)**: 
  - Rotas da API documentadas
  - Modelos e relacionamentos
  - Validações customizadas
  - Como executar testes

### Frontend

- **[Frontend README](./movie-session-management-frontend/README.md)**:
  - Stack tecnológico detalhado
  - Funcionalidades implementadas
  - Scripts disponíveis

- **[Setup Guide](./movie-session-management-frontend/docs/setup.md)**:
  - Configuração passo a passo
  - Variáveis de ambiente
  - Troubleshooting

- **[Architecture](./movie-session-management-frontend/docs/architecture.md)**:
  - Atomic Design explicado
  - Gerenciamento de estado
  - Sistema de tipos
  - Decisões arquiteturais

- **[Deployment](./movie-session-management-frontend/docs/deployment.md)**:
  - Build de produção
  - Opções de deploy (Nginx, Vercel, Docker)
  - CI/CD
  - Monitoramento

### Especificações

- **[OpenSpec Tasks](./openspec/changes/build-frontend-admin-panel/tasks.md)**:
  - Todas as tarefas implementadas
  - Checklist de progresso

## 🧪 Testes

### Backend (RSpec)
```bash
cd movie-session-management-backend
bundle exec rspec

# Com cobertura
bundle exec rspec --format documentation
```

### Frontend (Vitest)
```bash
cd movie-session-management-frontend
npm run test:unit

# Com cobertura
npm run test:unit -- --coverage
```

**Cobertura Atual:**
- **Backend**: Modelos e validadores cobertos
- **Frontend**: 83%+ de cobertura (187 testes unitários)

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar PostgreSQL
sudo service postgresql status
sudo service postgresql start

# Recriar banco
rails db:drop db:create db:migrate db:seed
```

### Frontend não conecta ao backend

```bash
# Verificar se backend está rodando
curl http://localhost:3000/api/v1/movies

# Verificar variáveis de ambiente
cat movie-session-management-frontend/.env.local
```

### Erro de CORS

Verificar `backend/config/initializers/cors.rb`:
```ruby
origins 'http://localhost:5173' # deve incluir URL do frontend
```
## Licença

Projeto desenvolvido como teste técnico Attus. A aplicação não deve ser usado em um contexto de produção
sem autorização expressa do autor.

---

**Status do Projeto**: ✅ Completo e Funcional  
**Cobertura de Testes**: 83%+  
**Documentação**: Completa  
