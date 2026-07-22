<template>
  <div class="table-container">
    <table class="table">
      <thead class="table__header">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'table__header-cell',
              { 'table__header-cell--sortable': column.sortable }
            ]"
            @click="column.sortable ? handleSort(column.key) : null"
          >
            <div class="table__header-content">
              <span>{{ column.label }}</span>
              <span v-if="column.sortable" class="table__sort-icon">
                <template v-if="sortKey === column.key">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </template>
                <template v-else>
                  ⇅
                </template>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="table__body">
        <template v-if="sortedData.length > 0">
          <tr
            v-for="(row, index) in sortedData"
            :key="getRowKey(row, index)"
            class="table__row"
            @click="handleRowClick(row)"
          >
            <slot name="row" :row="row" :index="index" />
          </tr>
        </template>
        <tr v-else class="table__empty">
          <td :colspan="columns.length" class="table__empty-cell">
            <div class="table__empty-state">
              <p class="table__empty-message">{{ emptyMessage }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
}

interface Props {
  columns: TableColumn[]
  data: any[]
  emptyMessage?: string
  rowKey?: string
}

interface Emits {
  (e: 'row-click', row: any): void
  (e: 'sort', key: string, order: 'asc' | 'desc'): void
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: 'No data available',
  rowKey: 'id'
})

const emit = defineEmits<Emits>()

const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedData = computed(() => {
  if (!sortKey.value) {
    return props.data
  }

  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value!]
    const bVal = b[sortKey.value!]

    if (aVal === bVal) return 0

    const comparison = aVal > bVal ? 1 : -1
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

function handleSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  
  emit('sort', key, sortOrder.value)
}

function handleRowClick(row: any) {
  emit('row-click', row)
}

function getRowKey(row: any, index: number) {
  return row[props.rowKey] ?? index
}
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-base);
}

.table__header {
  background-color: var(--color-muted);
  border-bottom: 2px solid var(--color-border);
}

.table__header-cell {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  user-select: none;
}

.table__header-cell--sortable {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.table__header-cell--sortable:hover {
  background-color: var(--color-border);
}

.table__header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.table__sort-icon {
  color: var(--color-text-light);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
}

.table__body {
  background-color: var(--color-surface);
}

.table__row {
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.table__row:hover {
  background-color: var(--color-muted);
}

.table__row:last-child {
  border-bottom: none;
}

.table__row :deep(td) {
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text);
}

.table__empty {
  border-bottom: none;
}

.table__empty-cell {
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
}

.table__empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.table__empty-message {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--color-text-light);
}
</style>
