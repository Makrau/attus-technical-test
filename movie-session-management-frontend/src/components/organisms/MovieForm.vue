<template>
  <form @submit.prevent="handleSubmit" class="movie-form">
    <FormField>
      <Input
        v-model="formData.title"
        label="Título"
        placeholder="Digite o título do filme"
        :error="errors.title"
        :disabled="loading"
        required
      />
    </FormField>

    <FormField>
      <Input
        v-model="formData.director"
        label="Diretor"
        placeholder="Digite o nome do diretor"
        :error="errors.director"
        :disabled="loading"
        required
      />
    </FormField>

    <FormField>
      <NumberInput
        v-model="formData.duration"
        label="Duração (minutos)"
        placeholder="Digite a duração em minutos"
        :error="errors.duration"
        :disabled="loading"
        :min="1"
        required
      />
    </FormField>

    <FormField>
      <Textarea
        v-model="formData.synopsis"
        label="Sinopse"
        placeholder="Digite a sinopse do filme (opcional)"
        :error="errors.synopsis"
        :disabled="loading"
        :rows="5"
      />
    </FormField>

    <div class="movie-form__actions">
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
        {{ isEditMode ? 'Atualizar Filme' : 'Criar Filme' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import Input from '@/components/atoms/Input.vue'
import NumberInput from '@/components/atoms/NumberInput.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import Button from '@/components/atoms/Button.vue'
import FormField from '@/components/molecules/FormField.vue'
import { useMoviesStore } from '@/stores/movies'
import type { Movie } from '@/types/models'
import type { CreateMovieDTO, UpdateMovieDTO } from '@/types/api'
import { ValidationError, isValidationError } from '@/types/errors'
import { translateFieldError } from '@/utils/errorTranslation'
import { useUIStore } from '@/stores/ui'

interface Props {
  movieId?: string
}

interface Emits {
  (e: 'success', movie: Movie): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const moviesStore = useMoviesStore()
const uiStore = useUIStore()

const isEditMode = ref(false)
const loading = ref(false)

const formData = reactive({
  title: '',
  director: '',
  duration: null as number | null,
  synopsis: ''
})

const errors = reactive({
  title: '',
  director: '',
  duration: '',
  synopsis: ''
})

function clearErrors() {
  errors.title = ''
  errors.director = ''
  errors.duration = ''
  errors.synopsis = ''
}

function validateForm(): boolean {
  clearErrors()
  let isValid = true

  if (!formData.title.trim()) {
    errors.title = 'Título é obrigatório'
    isValid = false
  }

  if (!formData.director.trim()) {
    errors.director = 'Diretor é obrigatório'
    isValid = false
  }

  if (!formData.duration || formData.duration <= 0) {
    errors.duration = 'Duração deve ser maior que 0'
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
    let movie: Movie

    if (isEditMode.value && props.movieId) {
      const updateData: UpdateMovieDTO = {
        title: formData.title,
        director: formData.director,
        duration: formData.duration!,
        synopsis: formData.synopsis || null
      }
      movie = await moviesStore.updateMovie(props.movieId, updateData)
      uiStore.showToast('Filme atualizado com sucesso!', 'success')
    } else {
      const createData: CreateMovieDTO = {
        title: formData.title,
        director: formData.director,
        duration: formData.duration!,
        synopsis: formData.synopsis || null
      }
      movie = await moviesStore.createMovie(createData)
      uiStore.showToast('Filme criado com sucesso!', 'success')
    }

    emit('success', movie)
  } catch (error) {
    if (isValidationError(error)) {
      // Traduz e aplica erros do backend
      Object.keys(error.errors).forEach(key => {
        if (key in errors) {
          const translatedMessage = translateFieldError(key, error.errors[key])
          errors[key as keyof typeof errors] = translatedMessage
        }
      })
      uiStore.showToast('Erro de validação. Verifique os campos.', 'error')
    } else {
      console.error('Failed to save movie:', error)
      uiStore.showToast('Erro ao salvar filme. Tente novamente.', 'error')
    }
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('cancel')
}

async function loadMovie() {
  if (!props.movieId) return

  loading.value = true
  try {
    await moviesStore.fetchMovie(props.movieId)
    const movie = moviesStore.selectedMovie

    if (movie) {
      formData.title = movie.title
      formData.director = movie.director
      formData.duration = movie.duration
      formData.synopsis = movie.synopsis || ''
      isEditMode.value = true
    }
  } catch (error) {
    console.error('Failed to load movie:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.movieId, (newId) => {
  if (newId) {
    loadMovie()
  } else {
    isEditMode.value = false
  }
}, { immediate: true })

onMounted(() => {
  if (props.movieId) {
    loadMovie()
  }
  
  // Focus no primeiro input
  nextTick(() => {
    const firstInput = document.querySelector<HTMLInputElement>('.movie-form input')
    firstInput?.focus()
  })
})
</script>

<style scoped>
.movie-form {
  max-width: 600px;
  margin: 0 auto;
}

.movie-form__actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}
</style>
