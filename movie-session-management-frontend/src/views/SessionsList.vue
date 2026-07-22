<template>
  <div class="sessions-list">
    <div class="sessions-list__header">
      <h1 class="sessions-list__title">Sessões</h1>
      <Button
        variant="primary"
        @click="handleCreate"
      >
        <PlusIcon :size="18" />
        Criar Sessão
      </Button>
    </div>

    <Card>
      <div v-if="isLoading" class="sessions-list__loading">
        <Spinner size="lg" />
        <p>Carregando sessões...</p>
      </div>

      <SessionsTable
        v-else
        :sessions="sessionsWithDetails"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />
    </Card>

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Excluir Sessão"
      message="Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita."
      confirm-text="Excluir"
      cancel-text="Cancelar"
      confirm-variant="danger"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon } from 'lucide-vue-next'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Spinner from '@/components/atoms/Spinner.vue'
import SessionsTable from '@/components/organisms/SessionsTable.vue'
import ConfirmDialog from '@/components/molecules/ConfirmDialog.vue'
import { useSessionsStore } from '@/stores/sessions'
import { useUIStore } from '@/stores/ui'
import { useMoviesStore } from '@/stores/movies'
import { useRoomsStore } from '@/stores/rooms'
import type { SessionWithDetails } from '@/types/models'

const router = useRouter()
const sessionsStore = useSessionsStore()
const uiStore = useUIStore()
const moviesStore = useMoviesStore()
const roomsStore = useRoomsStore()

const showDeleteDialog = ref(false)
const sessionToDelete = ref<SessionWithDetails | null>(null)

const sessionsWithDetails = computed(() => sessionsStore.sessionsWithDetails)
const isLoading = computed(() => sessionsStore.isLoading || moviesStore.isLoading || roomsStore.isLoading)

onMounted(async () => {
  await Promise.all([
    sessionsStore.fetchSessions(),
    moviesStore.fetchMovies(),
    roomsStore.fetchRooms()
  ])
})

function handleCreate() {
  router.push({ name: 'sessions-new' })
}

function handleEdit(session: SessionWithDetails) {
  router.push({ name: 'sessions-edit', params: { id: session.id } })
}

function handleDeleteClick(session: SessionWithDetails) {
  sessionToDelete.value = session
  showDeleteDialog.value = true
}

async function handleDeleteConfirm() {
  if (!sessionToDelete.value) return

  try {
    await sessionsStore.deleteSession(sessionToDelete.value.id)
    uiStore.showToast('Sessão excluída com sucesso!', 'success')
    showDeleteDialog.value = false
    sessionToDelete.value = null
  } catch (error) {
    console.error('Failed to delete session:', error)
    uiStore.showToast('Erro ao excluir sessão. Tente novamente.', 'error')
  }
}

function handleDeleteCancel() {
  sessionToDelete.value = null
  showDeleteDialog.value = false
}
</script>

<style scoped>
.sessions-list {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.sessions-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.sessions-list__title {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
}

.sessions-list__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  color: var(--color-text-light);
}
</style>
