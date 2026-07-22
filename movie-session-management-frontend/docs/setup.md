# Configuração do Ambiente de Desenvolvimento

Este guia fornece instruções detalhadas para configurar o ambiente de desenvolvimento do **Sistema de Gestão de Sessões de Cinema**.

## Pré-requisitos

### Software Necessário

- **Node.js**: v20.18.0 ou superior (recomendado v22.18.0 ou v24.12.0+)
- **npm**: v10.0.0 ou superior
- **Git**: Para controle de versão
- **Editor de Código**: VSCode (recomendado) ou outro editor de sua preferência

### Backend

Para desenvolvimento completo, você também precisará configurar o backend Rails:

- **Ruby**: 3.3.0
- **Rails**: 8.0+
- **PostgreSQL**: 14 ou superior

## Instalação

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd attus-technical-test/movie-session-management-frontend
```

### 2. Instale as Dependências

```bash
npm install
```

Se encontrar conflitos de dependências peer, use:

```bash
npm install --legacy-peer-deps
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# URL base da API Rails (ajuste conforme necessário)
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Timeout para requisições (em milissegundos)
VITE_API_TIMEOUT=10000
```

**Nota**: O arquivo `.env.local` é ignorado pelo Git e não deve ser commitado.

### 4. Inicie o Backend (Rails)

Em outro terminal, navegue até o diretório do backend e inicie o servidor:

```bash
cd ../movie-session-management-backend
bundle install
rails db:create db:migrate db:seed
rails server
```

O backend estará disponível em `http://localhost:3000`.

### 5. Inicie o Servidor de Desenvolvimento Frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## Scripts Disponíveis

### Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento com hot-reload
npm run dev

# Inicia o servidor em modo debug
npm run dev -- --debug
```

### Build

```bash
# Gera build de produção otimizado
npm run build

# Visualiza o build de produção localmente
npm run preview
```

### Testes

```bash
# Executa todos os testes unitários
npm run test:unit

# Executa testes em modo watch
npm run test:unit -- --watch

# Executa testes com relatório de cobertura
npm run test:unit -- --coverage

# Executa testes de um arquivo específico
npm run test:unit -- src/components/atoms/Button.spec.ts
```

### Linting e Formatação

```bash
# Executa o linter (ESLint + Oxlint)
npm run lint

# Formata o código com Prettier
npm run format

# Verifica formatação sem modificar
npm run format:check
```

### Type Checking

```bash
# Verifica tipos TypeScript
npm run type-check

# Verifica tipos em modo watch
npm run type-check -- --watch
```

## Estrutura de Diretórios

```
movie-session-management-frontend/
├── docs/               # Documentação do projeto
├── public/             # Arquivos estáticos
├── src/
│   ├── api/           # Cliente HTTP e módulos de API
│   ├── components/    # Componentes Vue (Atomic Design)
│   │   ├── atoms/     # Componentes básicos
│   │   ├── molecules/ # Combinações de atoms
│   │   └── organisms/ # Componentes complexos
│   ├── router/        # Configuração do Vue Router
│   ├── stores/        # Stores Pinia
│   ├── styles/        # Estilos globais e variáveis CSS
│   ├── types/         # TypeScript types e interfaces
│   ├── utils/         # Funções utilitárias
│   ├── views/         # Páginas/Views da aplicação
│   ├── App.vue        # Componente raiz
│   └── main.ts        # Entry point
├── .env.example       # Exemplo de variáveis de ambiente
├── index.html         # HTML base
├── package.json       # Dependências e scripts
├── tsconfig.json      # Configuração TypeScript
├── vite.config.ts     # Configuração Vite
└── vitest.config.ts   # Configuração Vitest
```

## Configuração do Editor (VSCode)

### Extensões Recomendadas

1. **Vue - Official** (Vue.volar) - Suporte a Vue 3
2. **TypeScript Vue Plugin** (Vue.vscode-typescript-vue-plugin)
3. **ESLint** - Integração com ESLint
4. **Prettier** - Formatação de código
5. **EditorConfig** - Consistência de código

### Configuração do VSCode

Crie ou atualize `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Configuração CORS (Backend)

Certifique-se de que o backend Rails está configurado para aceitar requisições do frontend:

```ruby
# backend/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173' # URL do frontend em desenvolvimento
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## Solução de Problemas

### Porta 5173 já está em uso

```bash
# Use uma porta diferente
npm run dev -- --port 3001
```

### Erros de módulos não encontrados

```bash
# Limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erros de TypeScript

```bash
# Verifique a configuração do TypeScript
npm run type-check
```

### Testes falhando

```bash
# Limpe cache do Vitest
npm run test:unit -- --clearCache
```

## Recursos Adicionais

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## Próximos Passos

Após configurar o ambiente, consulte:

- [`architecture.md`](./architecture.md) - Arquitetura e decisões de design
- [`deployment.md`](./deployment.md) - Instruções de deploy
- [`README.md`](../README.md) - Visão geral do projeto
