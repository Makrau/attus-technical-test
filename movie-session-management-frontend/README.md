# Sistema de Gestão de Sessões de Cinema - Frontend

Sistema web para gerenciamento de sessões de cinema, permitindo o cadastro e controle de filmes, salas e sessões de exibição com validação de conflitos de horário.

## 🎬 Sobre o Projeto

Este é o frontend de um sistema de gestão de sessões de cinema desenvolvido como parte de um teste técnico. O sistema permite:

- **Gestão de Filmes**: Cadastrar filmes com título, diretor, duração e sinopse
- **Gestão de Salas**: Cadastrar e gerenciar salas de exibição
- **Gestão de Sessões**: Criar sessões vinculando filmes e salas com validação de:
  - Conflitos de horário (mesma sala não pode ter sessões sobrepostas)
  - Antecedência mínima de 30 minutos
  - Data/hora não pode ser no passado

## 🚀 Tecnologias

### Core

- **[Vue 3](https://vuejs.org/)** (3.5+) - Framework progressivo
- **[TypeScript](https://www.typescriptlang.org/)** (5.6+) - Tipagem estática
- **[Vite](https://vitejs.dev/)** (8.0+) - Build tool e dev server
- **[Pinia](https://pinia.vuejs.org/)** (2.3+) - Gerenciamento de estado
- **[Vue Router](https://router.vuejs.org/)** (4.5+) - Roteamento SPA

### Bibliotecas Adicionais

- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[Lucide Vue Next](https://lucide.dev/)** - Ícones SVG
- **[Vitest](https://vitest.dev/)** - Framework de testes
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Utilitários de teste

### Ferramentas de Desenvolvimento

- **ESLint** + **Oxlint** - Linting
- **TypeScript** - Type checking
- **Vite** - Hot Module Replacement (HMR)

## 📁 Estrutura do Projeto

```
src/
├── api/                    # Cliente HTTP e módulos de API
│   ├── client.ts          # Configuração Axios e interceptors
│   ├── movies.ts          # API de filmes
│   ├── rooms.ts           # API de salas
│   └── sessions.ts        # API de sessões
│
├── components/            # Componentes Vue (Atomic Design)
│   ├── atoms/            # Componentes básicos (Button, Input, etc.)
│   ├── molecules/        # Componentes compostos (Modal, Toast, etc.)
│   ├── organisms/        # Componentes complexos (Forms, Tables, etc.)
│   └── layout/           # Componentes de layout (Header, Sidebar, etc.)
│
├── router/               # Configuração de rotas
├── stores/               # Stores Pinia (movies, rooms, sessions, ui)
├── styles/               # Estilos globais e variáveis CSS
├── types/                # Tipos e interfaces TypeScript
├── utils/                # Funções utilitárias
├── views/                # Páginas/Views da aplicação
├── App.vue               # Componente raiz
└── main.ts               # Entry point
```

## 🎨 Design System

O projeto utiliza um design system customizado com:

- **Atomic Design** para organização de componentes
- **CSS Variables** para temas e consistência
- **Paleta de Cores** definida e acessível (WCAG AA)
- **Componentes reutilizáveis** e tipados
- **Ícones Lucide** para interface consistente

## ⚙️ Configuração e Execução

### Pré-requisitos

- **Node.js** v20.18.0 ou superior
- **npm** v10.0.0 ou superior

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd attus-technical-test/movie-session-management-frontend

# Instale as dependências
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=10000
```

### Executar em Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

## 🧪 Testes

```bash
# Executar todos os testes
npm run test:unit

# Testes em modo watch
npm run test:unit -- --watch

# Relatório de cobertura
npm run test:unit -- --coverage
```

### Cobertura Atual

- **Statements**: 83.57%
- **Lines**: 83.56%
- **Functions**: 79.05%
- **187 testes unitários**

## 🔍 Linting e Type Checking

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatação
npm run format
```

## 📚 Documentação

- **[Setup Guide](./docs/setup.md)** - Configuração detalhada do ambiente
- **[Architecture](./docs/architecture.md)** - Arquitetura e decisões de design
- **[Deployment](./docs/deployment.md)** - Guia de deploy e CI/CD

## 🎯 Funcionalidades Principais

### Dashboard
- Visão geral com contadores de filmes, salas e sessões
- Navegação rápida para cada módulo

### Filmes
- Listagem com ordenação por título
- Criar novo filme
- Editar filme existente
- Excluir filme (com confirmação)
- Validações: título, diretor e duração obrigatórios

### Salas
- Listagem com ordenação por número
- Criar nova sala
- Editar sala existente
- Excluir sala (com confirmação)
- Validação: número único e obrigatório

### Sessões
- Listagem com detalhes de filme e sala
- Criar nova sessão
- Editar sessão existente
- Excluir sessão (com confirmação)
- Validações complexas:
  - Data/hora não pode ser no passado
  - Antecedência mínima de 30 minutos
  - Sem conflito de horário na mesma sala
  - Cálculo automático de horário de término

## ♿ Acessibilidade

O projeto segue padrões **WCAG 2.1 Level AA**:

- ✅ ARIA labels em todos os componentes interativos
- ✅ Navegação completa por teclado (Tab, Enter, Escape)
- ✅ Estilos de foco visíveis
- ✅ Contraste de cores adequado
- ✅ Semantic HTML
- ✅ Skip-to-content link
- ✅ Screen reader friendly

## 🌐 Integração com Backend

O frontend consome a API REST do Rails backend:

```
GET    /api/v1/movies      # Listar filmes
POST   /api/v1/movies      # Criar filme
GET    /api/v1/movies/:id  # Obter filme
PUT    /api/v1/movies/:id  # Atualizar filme
DELETE /api/v1/movies/:id  # Deletar filme

# Similar para /rooms e /sessions
```

**Tratamento de Erros:**
- Network errors
- Validation errors (422)
- Not found (404)
- Server errors (500+)
- Tradução de mensagens para português

## 🎨 UI/UX Features

- **Toast Notifications**: Feedback visual para ações
- **Loading States**: Spinners e overlays
- **Empty States**: Mensagens amigáveis quando não há dados
- **Error Boundary**: Captura erros não tratados
- **Confirm Dialogs**: Confirmação antes de ações destrutivas
- **Focus Management**: Auto-focus em formulários
- **Responsive Design**: Mobile, tablet e desktop

## 🚀 Performance

- **Lazy Loading**: Rotas carregadas sob demanda
- **Code Splitting**: Bundles otimizados
- **Tree Shaking**: Remoção de código não utilizado
- **Minificação**: JavaScript e CSS minificados
- **Caching**: Headers apropriados para assets

## 📦 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run test:unit` | Executa testes unitários |
| `npm run test:unit -- --coverage` | Testes com cobertura |
| `npm run lint` | Executa linter |
| `npm run type-check` | Verifica tipos TypeScript |
| `npm run format` | Formata código |

## 🔐 Segurança

- Headers de segurança configurados
- Validação de inputs
- Sanitização de dados
- CORS configurado no backend
- Environment variables para secrets
- Type safety com TypeScript

## 📝 Convenções de Código

- **Nomenclatura**: PascalCase para componentes, camelCase para funções
- **Imports**: Organizados por categoria
- **CSS**: BEM methodology com kebab-case
- **TypeScript**: Tipagem forte, sem `any`
- **Testes**: Descrições claras, AAA pattern

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste técnico.

## 👨‍💻 Autor

Desenvolvido como parte do teste técnico Attus.

## 🔗 Links Úteis

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vitest Documentation](https://vitest.dev/)

---

**Status do Projeto**: ✅ Completo  
**Cobertura de Testes**: 83%+  
**Acessibilidade**: WCAG AA Compliant
