# Arquitetura do Sistema

Este documento descreve a arquitetura, estrutura e decisões de design do frontend do **Sistema de Gestão de Sessões de Cinema**.

## Visão Geral

O sistema é uma aplicação Single Page Application (SPA) construída com Vue 3, TypeScript e Vite, seguindo as melhores práticas modernas de desenvolvimento frontend.

### Stack Tecnológico

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Vue 3** | 3.5+ | Framework principal |
| **TypeScript** | 5.6+ | Tipagem estática |
| **Vite** | 8.0+ | Build tool e dev server |
| **Pinia** | 2.3+ | Gerenciamento de estado |
| **Vue Router** | 4.5+ | Roteamento |
| **Axios** | 1.7+ | Cliente HTTP |
| **Vitest** | 4.1+ | Framework de testes |
| **Lucide Vue Next** | 0.469+ | Biblioteca de ícones |

## Arquitetura de Componentes

### Atomic Design

O projeto segue a metodologia **Atomic Design** para organização de componentes:

```
components/
├── atoms/          # Componentes básicos e indivisíveis
│   ├── Button.vue
│   ├── Input.vue
│   ├── Select.vue
│   ├── Card.vue
│   └── Spinner.vue
│
├── molecules/      # Combinações simples de atoms
│   ├── FormField.vue
│   ├── Modal.vue
│   ├── Toast.vue
│   └── ConfirmDialog.vue
│
└── organisms/      # Componentes complexos de negócio
    ├── MovieForm.vue
    ├── MoviesTable.vue
    ├── SessionForm.vue
    └── ErrorBoundary.vue
```

**Benefícios:**
- Reutilização máxima de código
- Hierarquia clara de dependências
- Facilita testes isolados
- Manutenção simplificada

## Gerenciamento de Estado (Pinia)

### Estrutura das Stores

```typescript
stores/
├── movies.ts      # Gerencia filmes
├── rooms.ts       # Gerencia salas
├── sessions.ts    # Gerencia sessões
└── ui.ts          # Estado global da UI (toasts, loading, modals)
```

### Padrão de Store

Cada store segue um padrão consistente:

```typescript
export const useMoviesStore = defineStore('movies', () => {
  // Estado
  const items = ref<Movie[]>([])
  const loading = ref(false)
  
  // Getters (computed)
  const sortedItems = computed(() => [...])
  const itemById = (id: string) => items.value.find(...)
  
  // Actions (funções)
  async function fetchItems() { ... }
  async function createItem(data: CreateDTO) { ... }
  async function updateItem(id: string, data: UpdateDTO) { ... }
  async function deleteItem(id: string) { ... }
  
  return {
    items,
    loading,
    sortedItems,
    itemById,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  }
})
```

**Decisões de Design:**
- **Composition API** para melhor organização e type inference
- Estado local mínimo nos componentes
- Stores como única fonte de verdade
- Getters computados para dados derivados

## Camada de API

### Cliente HTTP Configurado

```typescript
// api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' }
})

// Interceptors para logging e tratamento de erros
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Tratamento centralizado de erros
    if (error.response?.status === 422) {
      throw new ValidationError(error.response.data.errors)
    }
    // ... outros casos
  }
)
```

### Módulos de API

Cada entidade possui seu módulo de API:

```typescript
// api/movies.ts
export const moviesApi = {
  getAll: () => apiClient.get<Movie[]>('/movies'),
  getById: (id: string) => apiClient.get<Movie>(`/movies/${id}`),
  create: (data: CreateMovieDTO) => apiClient.post<Movie>('/movies', data),
  update: (id: string, data: UpdateMovieDTO) => 
    apiClient.put<Movie>(`/movies/${id}`, data),
  delete: (id: string) => apiClient.delete(`/movies/${id}`)
}
```

**Benefícios:**
- Encapsulamento da lógica de requisições
- Tipagem forte com TypeScript
- Reutilização fácil
- Testabilidade

## Sistema de Roteamento

### Configuração do Router

```typescript
// router/index.ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { title: 'Dashboard' }
    },
    // ... outras rotas com lazy loading
  ]
})
```

**Características:**
- **Lazy Loading**: Todas as views carregadas sob demanda
- **Meta tags**: Títulos dinâmicos de página
- **Navigation Guards**: Atualização automática de `document.title`
- **404 Handling**: Rota catch-all para páginas não encontradas

## Sistema de Tipos (TypeScript)

### Organização de Tipos

```
types/
├── api.ts          # DTOs e tipos de requisição/resposta
├── models.ts       # Modelos de domínio
└── errors.ts       # Classes de erro customizadas
```

### Hierarquia de Erros

```typescript
ApiError (base)
├── NetworkError
├── ValidationError
├── NotFoundError
└── ServerError
```

**Type Guards:**
```typescript
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}
```

## Sistema de Estilos

### Design System

Variáveis CSS centralizadas em `styles/variables.css`:

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-error: #ef4444;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-md: 1rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-family-sans: -apple-system, BlinkMacSystemFont, ...;
  --text-base: 1rem;
  
  /* Breakpoints, Shadows, Z-index, etc. */
}
```

**Vantagens:**
- Consistência visual
- Tema centralizável
- Fácil manutenção
- Suporte a dark mode (futuro)

## Tratamento de Erros

### Estratégia em Camadas

1. **API Layer**: Interceptors do Axios transformam erros HTTP em classes específicas
2. **Store Layer**: Catches erros e atualiza estado de loading/erro
3. **Component Layer**: Exibe feedback visual (toasts, mensagens inline)
4. **Error Boundary**: Captura erros não tratados do Vue

### Tradução de Erros

```typescript
// utils/errorTranslation.ts
export function translateFieldError(
  field: string, 
  messages: string | string[]
): string {
  // Mapeia mensagens do backend (inglês) para português
  const errorTranslations = {
    'starts_at': {
      'cannot be in the past': 'não pode estar no passado',
      // ... mais traduções
    }
  }
}
```

**Decisão de Design:**
- Backend permanece em inglês (padrão)
- Frontend traduz para UX em português
- Mantém RESTful API principles

## Acessibilidade (a11y)

### Implementações

1. **ARIA Labels**: Todos os botões e controles interativos
2. **Semantic HTML**: `<main>`, `<nav>`, `<header>`, `<aside>`
3. **Keyboard Navigation**: Tab, Enter, Escape funcionam em toda aplicação
4. **Focus Management**: Auto-focus em formulários, estilos visíveis
5. **Skip Links**: "Pular para conteúdo principal"
6. **Screen Reader**: Textos alternativos e anúncios adequados

### Padrão WCAG AA

- Contraste de cores mínimo de 4.5:1
- Tamanhos de fonte legíveis
- Áreas clicáveis mínimas de 44x44px

## Performance

### Otimizações Implementadas

1. **Code Splitting**
   - Lazy loading de rotas
   - Dynamic imports para componentes pesados

2. **Bundle Optimization**
   - Tree-shaking automático (Vite)
   - Minificação e compressão

3. **Caching**
   - HTTP caching headers respeitados
   - Store state persistente quando necessário

4. **Reactive Updates**
   - Computed properties para evitar re-cálculos
   - `v-memo` para listas grandes (futuro)

## Testes

### Estratégia de Testes

```
tests/
├── unit/               # Testes unitários (Vitest)
│   ├── components/    # Componentes isolados
│   ├── stores/        # Lógica de stores
│   ├── api/           # Módulos de API
│   └── utils/         # Funções utilitárias
│
└── e2e/               # Testes E2E (futuro: Playwright)
```

**Cobertura Atual:**
- Statements: 83.57%
- Lines: 83.56%
- Functions: 79.05%
- 187 testes unitários

### Padrões de Teste

```typescript
describe('Component', () => {
  beforeEach(() => {
    // Setup
  })
  
  it('should render correctly', () => {
    const wrapper = mount(Component, { props })
    expect(wrapper.html()).toMatchSnapshot()
  })
  
  it('should handle user interaction', async () => {
    const wrapper = mount(Component)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('action')).toBeTruthy()
  })
})
```

## Padrões e Convenções

### Nomenclatura

- **Componentes**: PascalCase (`MovieForm.vue`)
- **Stores**: camelCase com `use` prefix (`useMoviesStore`)
- **Funções**: camelCase (`fetchMovies`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: kebab-case com BEM (`movie-form__title`)

### Organização de Imports

```typescript
// 1. Vue core
import { ref, computed, onMounted } from 'vue'

// 2. Libraries
import { useRouter } from 'vue-router'

// 3. Types
import type { Movie } from '@/types/models'

// 4. Stores
import { useMoviesStore } from '@/stores/movies'

// 5. Components
import Button from '@/components/atoms/Button.vue'

// 6. Utils
import { formatDate } from '@/utils/date'
```

## Decisões Arquiteturais Importantes

### 1. Composition API vs Options API
**Decisão**: Composition API  
**Razão**: Melhor organização, reutilização de lógica, type inference superior

### 2. Pinia vs Vuex
**Decisão**: Pinia  
**Razão**: API mais simples, TypeScript nativo, melhor DevTools, recomendação oficial do Vue 3

### 3. Axios vs Fetch
**Decisão**: Axios  
**Razão**: Interceptors, transformações automáticas, timeout, melhor tratamento de erros

### 4. UUID vs Auto-increment IDs
**Decisão**: UUID (seguindo backend)  
**Razão**: Distribuição, segurança, padrão do backend Rails com pgcrypto

### 5. CSS Modules vs Scoped CSS
**Decisão**: Scoped CSS  
**Razão**: Simplicidade, integração nativa do Vue, suficiente para o escopo do projeto

### 6. Component Library vs Custom Components
**Decisão**: Custom Components (Atomic Design)  
**Razão**: Controle total, learning experience, sem overhead de biblioteca

## Extensibilidade Futura

### Pontos de Extensão Preparados

1. **Autenticação**: Interceptors já configurados para tokens
2. **Internacionalização**: Sistema de tradução preparado (Vue I18n pode ser adicionado)
3. **Temas**: CSS variables prontas para dark mode
4. **Websockets**: Estrutura de stores permite easy integration
5. **Offline Mode**: Service Worker pode ser adicionado via Vite PWA

## Referências

- [Vue 3 Style Guide](https://vuejs.org/style-guide/)
- [Pinia Best Practices](https://pinia.vuejs.org/cookbook/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
