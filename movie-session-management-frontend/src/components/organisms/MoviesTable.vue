<template>
  <Table
    :columns="columns"
    :data="movies"
    :empty-message="emptyMessage"
    @row-click="handleRowClick"
  >
    <template #row="{ row }">
      <td>{{ row.title }}</td>
      <td>{{ row.director }}</td>
      <td>{{ formatDuration(row.duration) }}</td>
      <td>{{ truncateSynopsis(row.synopsis) }}</td>
      <td class="movies-table__actions">
        <div class="movies-table__action-buttons">
          <Button
            variant="ghost"
            size="sm"
            @click.stop="handleEdit(row)"
            aria-label="Editar filme"
          >
            <PencilIcon :size="16" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click.stop="handleDelete(row)"
            aria-label="Excluir filme"
          >
            <Trash2Icon :size="16" />
          </Button>
        </div>
      </td>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { PencilIcon, Trash2Icon } from 'lucide-vue-next'
import Table, { type TableColumn } from './Table.vue'
import Button from '@/components/atoms/Button.vue'
import type { Movie } from '@/types/models'

interface Props {
  movies: Movie[]
  emptyMessage?: string
}

interface Emits {
  (e: 'edit', movie: Movie): void
  (e: 'delete', movie: Movie): void
  (e: 'row-click', movie: Movie): void
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'Nenhum filme encontrado. Crie seu primeiro filme para começar.'
})

const emit = defineEmits<Emits>()

const columns: TableColumn[] = [
  { key: 'title', label: 'Título', sortable: true },
  { key: 'director', label: 'Diretor', sortable: true },
  { key: 'duration', label: 'Duração', sortable: true },
  { key: 'synopsis', label: 'Sinopse', sortable: false },
  { key: 'actions', label: 'Ações', sortable: false }
]

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) {
    return `${mins}min`
  }
  
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`
}

function truncateSynopsis(synopsis: string | null): string {
  if (!synopsis) return '-'
  return synopsis.length > 50 ? `${synopsis.substring(0, 50)}...` : synopsis
}

function handleEdit(movie: Movie) {
  emit('edit', movie)
}

function handleDelete(movie: Movie) {
  emit('delete', movie)
}

function handleRowClick(movie: Movie) {
  emit('row-click', movie)
}
</script>

<style scoped>
.movies-table__actions {
  text-align: right;
  white-space: nowrap;
}

.movies-table__action-buttons {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
  align-items: center;
}
</style>

<style scoped>
.movies-table__actions {
  text-align: right;
  white-space: nowrap;
}

.movies-table__action-buttons {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
  align-items: center;
}
</style>
