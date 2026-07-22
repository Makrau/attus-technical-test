<template>
  <Table
    :columns="columns"
    :data="rooms"
    :empty-message="emptyMessage"
    @row-click="handleRowClick"
  >
    <template #row="{ row }">
      <td>{{ row.number }}</td>
      <td>{{ formatDate(row.created_at) }}</td>
      <td class="rooms-table__actions">
        <div class="rooms-table__action-buttons">
          <Button
            variant="ghost"
            size="sm"
            @click.stop="handleEdit(row)"
            aria-label="Editar sala"
          >
            <PencilIcon :size="16" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click.stop="handleDelete(row)"
            aria-label="Excluir sala"
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
import type { Room } from '@/types/models'

interface Props {
  rooms: Room[]
  emptyMessage?: string
}

interface Emits {
  (e: 'edit', room: Room): void
  (e: 'delete', room: Room): void
  (e: 'row-click', room: Room): void
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'Nenhuma sala encontrada. Crie sua primeira sala para começar.'
})

const emit = defineEmits<Emits>()

const columns: TableColumn[] = [
  { key: 'number', label: 'Número da Sala', sortable: true },
  { key: 'created_at', label: 'Criado em', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false }
]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function handleEdit(room: Room) {
  emit('edit', room)
}

function handleDelete(room: Room) {
  emit('delete', room)
}

function handleRowClick(room: Room) {
  emit('row-click', room)
}
</script>

<style scoped>
.rooms-table__actions {
  text-align: right;
  white-space: nowrap;
}

.rooms-table__action-buttons {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
  align-items: center;
}
</style>
