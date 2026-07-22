<template>
  <div class="movie-form-view">
    <div class="movie-form-view__header">
      <h1 class="movie-form-view__title">
        {{ isEditMode ? 'Editar Filme' : 'Criar Novo Filme' }}
      </h1>
    </div>

    <Card>
      <MovieForm
        :movie-id="movieId"
        @success="handleSuccess"
        @cancel="handleCancel"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/atoms/Card.vue'
import MovieForm from '@/components/organisms/MovieForm.vue'
import type { Movie } from '@/types/models'

const route = useRoute()
const router = useRouter()

const movieId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : undefined
})

const isEditMode = computed(() => !!movieId.value)

function handleSuccess(movie: Movie) {
  router.push({ name: 'movies' })
}

function handleCancel() {
  router.push({ name: 'movies' })
}
</script>

<style scoped>
.movie-form-view {
  padding: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.movie-form-view__header {
  margin-bottom: var(--spacing-xl);
}

.movie-form-view__title {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
}
</style>
