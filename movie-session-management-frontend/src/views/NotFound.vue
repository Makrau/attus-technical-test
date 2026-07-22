<template>
  <div class="not-found">
    <div class="not-found__content">
      <h1 class="not-found__title">404</h1>
      <h2 class="not-found__subtitle">Página Não Encontrada</h2>
      <p class="not-found__message">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button variant="primary" @click="goHome">
        Voltar para o Dashboard
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/atoms/Button.vue'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
}

.not-found__content {
  text-align: center;
  max-width: 500px;
}

.not-found__title {
  margin: 0 0 var(--spacing-md);
  font-size: 120px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.not-found__subtitle {
  margin: 0 0 var(--spacing-md);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text);
}

.not-found__message {
  margin: 0 0 var(--spacing-xl);
  font-size: var(--text-lg);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}
</style>
