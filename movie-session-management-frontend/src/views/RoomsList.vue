<template>
  <div class="rooms-list">
    <div class="rooms-list__header">
      <h1 class="rooms-list__title">Salas</h1>
      <Button
        variant="primary"
        @click="handleCreate"
      >
        <PlusIcon :size="18" />
        Criar Sala
      </Button>
    </div>

    <Card>
      <div v-if="roomsStore.isLoading" class="rooms-list__loading">
        <Spinner size="lg" />
        <p>Carregando salas...</p>
      </div>

      <RoomsTable
        v-else
        :rooms="roomsStore.allRooms"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />
    </Card>

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Excluir Sala"
      :message="`Tem certeza que deseja excluir a sala ${roomToDelete?.number}? Esta ação não pode ser desfeita.`"
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
import { PlusIcon } from 'lucide-vue-next'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Spinner from '@/components/atoms/Spinner.vue'
import RoomsTable from '@/components/organisms/RoomsTable.vue'
import ConfirmDialog from '@/components/molecules/ConfirmDialog.vue'
import { useRoomsStore } from '@/stores/rooms'
import { useUIStore } from '@/stores/ui'
import type { Room } from '@/types/models'

const router = useRouter()
const roomsStore = useRoomsStore()
const uiStore = useUIStore()

const showDeleteDialog = ref(false)
const roomToDelete = ref<Room | null>(null)
const deleteLoading = ref(false)

onMounted(async () => {
  await roomsStore.fetchRooms()
})

function handleCreate() {
  router.push({ name: 'rooms-new' })
}

function handleEdit(room: Room) {
  router.push({ name: 'rooms-edit', params: { id: room.id } })
}

function handleDeleteClick(room: Room) {
  roomToDelete.value = room
  showDeleteDialog.value = true
}

async function handleDeleteConfirm() {
  if (!roomToDelete.value) return

  deleteLoading.value = true
  try {
    await roomsStore.deleteRoom(roomToDelete.value.id)
    uiStore.showToast('Sala excluída com sucesso!', 'success')
    showDeleteDialog.value = false
    roomToDelete.value = null
  } catch (error) {
    console.error('Erro ao excluir sala:', error)
    uiStore.showToast('Erro ao excluir sala. Tente novamente.', 'error')
  } finally {
    deleteLoading.value = false
  }
}

function handleDeleteCancel() {
  roomToDelete.value = null
  showDeleteDialog.value = false
}
</script>

<style scoped>
.rooms-list {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.rooms-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.rooms-list__title {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
}

.rooms-list__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  color: var(--color-text-light);
}
</style>
