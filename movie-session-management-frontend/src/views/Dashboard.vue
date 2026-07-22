<template>
  <div class="dashboard">
    <h1 class="dashboard__title">Dashboard</h1>

    <div class="dashboard__stats">
      <StatCard
        title="Filmes"
        :value="moviesStore.allMovies.length"
        icon="film"
        color="primary"
        @click="navigateTo('/movies')"
      />
      
      <StatCard
        title="Salas"
        :value="roomsStore.allRooms.length"
        icon="door"
        color="success"
        @click="navigateTo('/rooms')"
      />
      
      <StatCard
        title="Sessões"
        :value="sessionsStore.allSessions.length"
        icon="calendar"
        color="warning"
        @click="navigateTo('/sessions')"
      />
    </div>

    <div v-if="isLoading" class="dashboard__loading">
      <Spinner size="lg" />
      <p>Carregando dados...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
import { useRoomsStore } from '@/stores/rooms'
import { useSessionsStore } from '@/stores/sessions'
import StatCard from '@/components/molecules/StatCard.vue'
import Spinner from '@/components/atoms/Spinner.vue'

const router = useRouter()
const moviesStore = useMoviesStore()
const roomsStore = useRoomsStore()
const sessionsStore = useSessionsStore()

const isLoading = computed(() => 
  moviesStore.isLoading || roomsStore.isLoading || sessionsStore.isLoading
)

onMounted(async () => {
  await Promise.all([
    moviesStore.fetchMovies(),
    roomsStore.fetchRooms(),
    sessionsStore.fetchSessions()
  ])
})

function navigateTo(path: string) {
  router.push(path)
}
</script>

<style scoped>
.dashboard {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard__title {
  margin: 0 0 var(--spacing-xl);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.dashboard__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  color: var(--color-text-light);
}
</style>
