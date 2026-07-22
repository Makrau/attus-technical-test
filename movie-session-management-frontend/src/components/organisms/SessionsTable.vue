<template>
  <Table
    :columns="columns"
    :data="sessions"
    :empty-message="emptyMessage"
    @row-click="handleRowClick"
  >
    <template #row="{ row }">
      <td>
        <span v-if="row.movie" class="sessions-table__movie-title">
          {{ row.movie.title }}
        </span>
        <span v-else class="sessions-table__missing">Unknown Movie</span>
      </td>
      <td>
        <span v-if="row.room" class="sessions-table__room-number">
          Room {{ row.room.number }}
        </span>
        <span v-else class="sessions-table__missing">Unknown Room</span>
      </td>
      <td>{{ formatDateTime(row.starts_at) }}</td>
      <td>{{ formatDateTime(row.ends_at) }}</td>
      <td>
        <span v-if="row.movie" class="sessions-table__duration">
          {{ formatDuration(row.movie.duration) }}
        </span>
        <span v-else>-</span>
      </td>
      <td class="sessions-table__actions">
        <div class="sessions-table__action-buttons">
          <Button
            variant="ghost"
            size="sm"
            @click.stop="handleEdit(row)"
            aria-label="Edit session"
          >
            ✏️
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click.stop="handleDelete(row)"
            aria-label="Delete session"
          >
            🗑️
          </Button>
        </div>
      </td>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table, { type TableColumn } from './Table.vue'
import Button from '@/components/atoms/Button.vue'
import type { SessionWithDetails } from '@/types/models'

interface Props {
  sessions: SessionWithDetails[]
  emptyMessage?: string
}

interface Emits {
  (e: 'edit', session: SessionWithDetails): void
  (e: 'delete', session: SessionWithDetails): void
  (e: 'row-click', session: SessionWithDetails): void
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'No sessions found. Create your first session to get started.'
})

const emit = defineEmits<Emits>()

const columns: TableColumn[] = [
  { key: 'movie', label: 'Movie', sortable: false },
  { key: 'room', label: 'Room', sortable: false },
  { key: 'starts_at', label: 'Start Time', sortable: true },
  { key: 'ends_at', label: 'End Time', sortable: true },
  { key: 'duration', label: 'Duration', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false }
]

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) {
    return `${mins}min`
  }
  
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`
}

function handleEdit(session: SessionWithDetails) {
  emit('edit', session)
}

function handleDelete(session: SessionWithDetails) {
  emit('delete', session)
}

function handleRowClick(session: SessionWithDetails) {
  emit('row-click', session)
}
</script>

<style scoped>
.sessions-table__movie-title {
  font-weight: 500;
  color: var(--color-text);
}

.sessions-table__room-number {
  font-weight: 500;
  color: var(--color-primary);
}

.sessions-table__duration {
  color: var(--color-text-light);
  font-size: var(--text-sm);
}

.sessions-table__missing {
  color: var(--color-danger);
  font-style: italic;
}

.sessions-table__actions {
  text-align: right;
  white-space: nowrap;
}

.sessions-table__action-buttons {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
  align-items: center;
}
</style>
