<template>
  <Card>
    <template #header>
      <h2>{{ isEditMode ? 'Editar Sessão' : 'Nova Sessão' }}</h2>
    </template>

    <form @submit.prevent="handleSubmit" class="session-form">
      <FormField>
        <Select
          v-model="formData.movie_id"
          label="Filme"
          placeholder="Selecione um filme"
          :options="movieOptions"
          :error="errors.movie_id"
          required
        />
      </FormField>

      <FormField>
        <Select
          v-model="formData.room_id"
          label="Sala"
          placeholder="Selecione uma sala"
          :options="roomOptions"
          :error="errors.room_id"
          required
        />
      </FormField>

      <FormField>
        <DatetimePicker
          v-model="formData.starts_at"
          label="Data e Hora de Início"
          :error="errors.starts_at"
          required
        />
      </FormField>

      <div v-if="endTimePreview" class="end-time-preview">
        <strong>Horário de término previsto:</strong> {{ endTimePreview }}
      </div>

      <div v-if="errors.time_conflict" class="conflict-error">
        <strong>Conflito de horário:</strong> {{ errors.time_conflict }}
      </div>

      <div v-if="backendError" class="backend-error">
        {{ backendError }}
      </div>

      <div class="form-actions">
        <Button type="button" variant="secondary" @click="handleCancel">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { CreateSessionDTO, UpdateSessionDTO } from '@/types/api'
import { useSessionsStore } from '@/stores/sessions'
import { useMoviesStore } from '@/stores/movies'
import { useRoomsStore } from '@/stores/rooms'
import { isValidationError } from '@/types/errors'
import { translateFieldError } from '@/utils/errorTranslation'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Select from '@/components/atoms/Select.vue'
import DatetimePicker from '@/components/atoms/DatetimePicker.vue'
import FormField from '@/components/molecules/FormField.vue'

interface Props {
  sessionId?: string
}

const props = defineProps<Props>()

const router = useRouter()
const sessionsStore = useSessionsStore()
const moviesStore = useMoviesStore()
const roomsStore = useRoomsStore()

const isEditMode = computed(() => !!props.sessionId)
const isSubmitting = ref(false)
const backendError = ref<string | null>(null)

const formData = ref<CreateSessionDTO>({
  movie_id: '',
  room_id: '',
  starts_at: ''
})

const errors = ref<Record<string, string>>({
  movie_id: '',
  room_id: '',
  starts_at: '',
  time_conflict: ''
})

const movieOptions = computed(() => {
  return moviesStore.allMovies.map(movie => ({
    value: movie.id,
    label: movie.title
  }))
})

const roomOptions = computed(() => {
  return roomsStore.allRooms.map(room => ({
    value: room.id,
    label: `Sala ${room.number}`
  }))
})

const endTimePreview = computed(() => {
  if (!formData.value.starts_at || !formData.value.movie_id) {
    return null
  }

  const movie = moviesStore.movieById(formData.value.movie_id)
  if (!movie) {
    return null
  }

  const startDate = new Date(formData.value.starts_at)
  const endDate = new Date(startDate.getTime() + movie.duration * 60000)

  return endDate.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

onMounted(async () => {
  await Promise.all([
    moviesStore.fetchMovies(),
    roomsStore.fetchRooms()
  ])

  if (isEditMode.value && props.sessionId) {
    try {
      const session = await sessionsStore.fetchSession(props.sessionId)
      formData.value = {
        movie_id: session.movie_id,
        room_id: session.room_id,
        starts_at: session.starts_at
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      backendError.value = 'Erro ao carregar sessão'
    }
  }
})

watch(() => formData.value.movie_id, () => {
  errors.value.movie_id = ''
})

watch(() => formData.value.room_id, () => {
  errors.value.room_id = ''
  errors.value.time_conflict = ''
})

watch(() => formData.value.starts_at, () => {
  errors.value.starts_at = ''
  errors.value.time_conflict = ''
})

function validate(): boolean {
  let isValid = true
  errors.value = {
    movie_id: '',
    room_id: '',
    starts_at: '',
    time_conflict: ''
  }

  if (!formData.value.movie_id) {
    errors.value.movie_id = 'Filme é obrigatório'
    isValid = false
  }

  if (!formData.value.room_id) {
    errors.value.room_id = 'Sala é obrigatória'
    isValid = false
  }

  if (!formData.value.starts_at) {
    errors.value.starts_at = 'Data e hora de início são obrigatórias'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  backendError.value = null

  if (!validate()) {
    return
  }

  isSubmitting.value = true

  try {
    if (isEditMode.value && props.sessionId) {
      await sessionsStore.updateSession(props.sessionId, formData.value as UpdateSessionDTO)
    } else {
      await sessionsStore.createSession(formData.value)
    }

    router.push({ name: 'sessions' })
  } catch (error) {
    if (isValidationError(error)) {
      // Traduz e trata erros do backend
      if (error.errors.starts_at) {
        const startsAtError = error.errors.starts_at[0]
        const translatedError = translateFieldError('starts_at', [startsAtError])
        errors.value.starts_at = translatedError
        
        // Se for um erro de conflito, também exibe na área destacada
        if (startsAtError.includes('conflicts') || startsAtError.includes('conflita')) {
          errors.value.time_conflict = 'Esta sala já possui uma sessão agendada neste horário'
        }
      }
      if (error.errors.room_id) {
        const roomError = error.errors.room_id[0]
        const translatedError = translateFieldError('room_id', [roomError])
        errors.value.room_id = translatedError
        
        // Se for um erro de conflito e ainda não foi definido, exibe na área destacada
        if (!errors.value.time_conflict && (roomError.includes('already has') || roomError.includes('já possui'))) {
          errors.value.time_conflict = 'Esta sala já possui uma sessão agendada neste horário'
        }
      }
      if (error.errors.movie_id) {
        const translatedError = translateFieldError('movie_id', error.errors.movie_id)
        errors.value.movie_id = translatedError
      }
      // Mantém compatibilidade com formato antigo (base)
      if (error.errors.base && !errors.value.time_conflict) {
        const baseError = error.errors.base[0]
        const translatedError = translateFieldError('base', [baseError])
        if (baseError.includes('session') || baseError.includes('sessão')) {
          errors.value.time_conflict = translatedError
        }
      }
    } else {
      backendError.value = error instanceof Error ? error.message : 'Erro ao salvar sessão'
    }
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  router.push({ name: 'sessions' })
}
</script>

<style scoped>
.session-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.end-time-preview {
  padding: var(--spacing-3);
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.conflict-error {
  padding: var(--spacing-4);
  background-color: var(--color-error-bg);
  border-left: 4px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error-text);
  font-size: var(--text-sm);
  line-height: var(--line-height-normal);
}

.conflict-error strong {
  display: block;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-1);
  color: var(--color-error-dark);
}

.backend-error {
  padding: var(--spacing-4);
  background-color: var(--color-error-bg);
  border-left: 4px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error-text);
  font-size: var(--text-sm);
  text-align: center;
  line-height: var(--line-height-normal);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
}
</style>
