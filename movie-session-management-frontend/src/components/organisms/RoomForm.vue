<template>
  <form @submit.prevent="handleSubmit" class="room-form">
    <FormField>
      <NumberInput
        v-model="formData.number"
        label="Número da Sala"
        placeholder="Digite o número da sala"
        :error="errors.number"
        :disabled="loading"
        :min="1"
        required
      />
    </FormField>

    <div class="room-form__actions">
      <Button
        type="button"
        variant="secondary"
        :disabled="loading"
        @click="handleCancel"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="primary"
        :loading="loading"
      >
        {{ isEditMode ? 'Atualizar Sala' : 'Criar Sala' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import NumberInput from '@/components/atoms/NumberInput.vue'
import Button from '@/components/atoms/Button.vue'
import FormField from '@/components/molecules/FormField.vue'
import { useRoomsStore } from '@/stores/rooms'
import type { Room } from '@/types/models'
import type { CreateRoomDTO, UpdateRoomDTO } from '@/types/api'
import { isValidationError } from '@/types/errors'

interface Props {
  roomId?: string
}

interface Emits {
  (e: 'success', room: Room): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const roomsStore = useRoomsStore()

const isEditMode = ref(false)
const loading = ref(false)

const formData = reactive({
  number: null as number | null
})

const errors = reactive({
  number: ''
})

function clearErrors() {
  errors.number = ''
}

function validateForm(): boolean {
  clearErrors()
  let isValid = true

  if (!formData.number || formData.number <= 0) {
    errors.number = 'Número da sala deve ser maior que 0'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  clearErrors()

  try {
    let room: Room

    if (isEditMode.value && props.roomId) {
      const updateData: UpdateRoomDTO = {
        number: formData.number!
      }
      room = await roomsStore.updateRoom(props.roomId, updateData)
    } else {
      const createData: CreateRoomDTO = {
        number: formData.number!
      }
      room = await roomsStore.createRoom(createData)
    }

    emit('success', room)
  } catch (error) {
    if (isValidationError(error)) {
      Object.keys(error.errors).forEach(key => {
        if (key in errors) {
          errors[key as keyof typeof errors] = error.errors[key].join(', ')
        }
      })
    } else {
      console.error('Erro ao salvar sala:', error)
    }
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('cancel')
}

async function loadRoom() {
  if (!props.roomId) return

  loading.value = true
  try {
    await roomsStore.fetchRoom(props.roomId)
    const room = roomsStore.selectedRoom

    if (room) {
      formData.number = room.number
      isEditMode.value = true
    }
  } catch (error) {
    console.error('Erro ao carregar sala:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.roomId, (newId) => {
  if (newId) {
    loadRoom()
  } else {
    isEditMode.value = false
  }
}, { immediate: true })

onMounted(() => {
  if (props.roomId) {
    loadRoom()
  }
})
</script>

<style scoped>
.room-form {
  max-width: 600px;
  margin: 0 auto;
}

.room-form__actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}
</style>
