<template>
  <tr class="table-row">
    <slot />
    <td v-if="hasActions" class="table-row__actions">
      <div class="table-row__action-buttons">
        <Button
          v-if="showEdit"
          variant="ghost"
          size="sm"
          @click="handleEdit"
          aria-label="Edit"
        >
          ✏️
        </Button>
        <Button
          v-if="showDelete"
          variant="ghost"
          size="sm"
          @click="handleDelete"
          aria-label="Delete"
        >
          🗑️
        </Button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue'
import { computed } from 'vue'

interface Props {
  showEdit?: boolean
  showDelete?: boolean
}

interface Emits {
  (e: 'edit'): void
  (e: 'delete'): void
}

const props = withDefaults(defineProps<Props>(), {
  showEdit: true,
  showDelete: true
})

const emit = defineEmits<Emits>()

const hasActions = computed(() => props.showEdit || props.showDelete)

function handleEdit() {
  emit('edit')
}

function handleDelete() {
  emit('delete')
}
</script>

<style scoped>
.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: var(--color-muted);
}

.table-row__actions {
  text-align: right;
  padding: var(--spacing-sm) var(--spacing-md);
  white-space: nowrap;
}

.table-row__action-buttons {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
  align-items: center;
}
</style>
