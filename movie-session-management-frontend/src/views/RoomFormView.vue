<template>
  <div class="room-form-view">
    <div class="room-form-view__header">
      <h1 class="room-form-view__title">
        {{ isEditMode ? 'Editar Sala' : 'Criar Nova Sala' }}
      </h1>
    </div>

    <Card>
      <RoomForm
        :room-id="roomId"
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
import RoomForm from '@/components/organisms/RoomForm.vue'
import type { Room } from '@/types/models'

const route = useRoute()
const router = useRouter()

const roomId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : undefined
})

const isEditMode = computed(() => !!roomId.value)

function handleSuccess(room: Room) {
  router.push({ name: 'rooms' })
}

function handleCancel() {
  router.push({ name: 'rooms' })
}
</script>

<style scoped>
.room-form-view {
  padding: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.room-form-view__header {
  margin-bottom: var(--spacing-xl);
}

.room-form-view__title {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
}
</style>
