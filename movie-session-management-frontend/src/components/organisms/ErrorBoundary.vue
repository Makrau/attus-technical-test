<template>
  <div v-if="hasError" class="error-boundary">
    <Card>
      <div class="error-boundary__content">
        <AlertCircle :size="48" class="error-boundary__icon" />
        <h2 class="error-boundary__title">Algo deu errado</h2>
        <p class="error-boundary__message">
          Ocorreu um erro inesperado. Por favor, tente recarregar a página.
        </p>
        <div class="error-boundary__actions">
          <Button @click="handleReload" variant="primary">
            Recarregar Página
          </Button>
          <Button @click="handleReset" variant="secondary">
            Tentar Novamente
          </Button>
        </div>
        <details v-if="errorDetails" class="error-boundary__details">
          <summary>Detalhes do erro</summary>
          <pre>{{ errorDetails }}</pre>
        </details>
      </div>
    </Card>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'

const hasError = ref(false)
const errorDetails = ref<string | null>(null)

onErrorCaptured((error: unknown) => {
  hasError.value = true
  
  if (error instanceof Error) {
    errorDetails.value = `${error.name}: ${error.message}\n\n${error.stack || ''}`
  } else {
    errorDetails.value = String(error)
  }
  
  console.error('Error boundary caught:', error)
  
  // Impede propagação do erro
  return false
})

function handleReload() {
  window.location.reload()
}

function handleReset() {
  hasError.value = false
  errorDetails.value = null
}
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.error-boundary__content {
  text-align: center;
  max-width: 500px;
}

.error-boundary__icon {
  color: var(--color-error);
  margin: 0 auto var(--spacing-lg);
}

.error-boundary__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md);
}

.error-boundary__message {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  margin: 0 0 var(--spacing-xl);
  line-height: var(--line-height-relaxed);
}

.error-boundary__actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.error-boundary__details {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  text-align: left;
}

.error-boundary__details summary {
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.error-boundary__details pre {
  margin: var(--spacing-sm) 0 0;
  padding: var(--spacing-sm);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-size: var(--text-sm);
  font-family: var(--font-family-mono);
  color: var(--color-text-primary);
}

@media (max-width: 640px) {
  .error-boundary__actions {
    flex-direction: column;
  }
}
</style>
