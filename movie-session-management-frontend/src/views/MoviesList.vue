<template>
  <div class="movies-list">
    <div class="movies-list__header">
      <h1 class="movies-list__title">Filmes</h1>
      <Button
        variant="primary"
        @click="handleCreate"
      >
        + Criar Filme
      </Button>
    </div>

    <Card>
      <div v-if="moviesStore.isLoading" class="movies-list__loading">
        <Spinner size="lg" />
        <p>Carregando filmes...</p>
      </div>

      <MoviesTable
        v-else
        :movies="moviesStore.allMovies"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />
    </Card>

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Excluir Filme"
      :message="`Tem certeza que deseja excluir '${movieToDelete?.title}'? Esta ação não pode ser desfeita.`"
      confirm-text="Excluir"
      cancel-text="Cancelar"
      confirm-variant="danger"
      :loading="deleteLoading"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Spinner from '@/components/atoms/Spinner.vue'
import MoviesTable from '@/components/organisms/MoviesTable.vue'
import ConfirmDialog from '@/components/molecules/ConfirmDialog.vue'
import { useMoviesStore } from '@/stores/movies'
import type { Movie } from '@/types/models'

const router = useRouter()
const moviesStore = useMoviesStore()

const showDeleteDialog = ref(false)
const movieToDelete = ref<Movie | null>(null)
const deleteLoading = ref(false)

onMounted(async () => {
  await moviesStore.fetchMovies()
})

function handleCreate() {
  router.push({ name: 'movies-new' })
}

function handleEdit(movie: Movie) {
  router.push({ name: 'movies-edit', params: { id: movie.id } })
}

function handleDeleteClick(movie: Movie) {
  movieToDelete.value = movie
  showDeleteDialog.value = true
}

async function handleDeleteConfirm() {
  if (!movieToDelete.value) return

  deleteLoading.value = true
  try {
    await moviesStore.deleteMovie(movieToDelete.value.id)
    showDeleteDialog.value = false
    movieToDelete.value = null
  } catch (error) {
    console.error('Failed to delete movie:', error)
  } finally {
    deleteLoading.value = false
  }
}

function handleDeleteCancel() {
  movieToDelete.value = null
  showDeleteDialog.value = false
}
</script>

<style scoped>
.movies-list {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.movies-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.movies-list__title {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
}

.movies-list__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  color: var(--color-text-light);
}
</style>
