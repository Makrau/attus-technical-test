<template>
  <Card>
    <div class="stat-card" :class="`stat-card--${color}`" @click="$emit('click')">
      <div class="stat-card__icon">
        <FilmIcon v-if="icon === 'film'" :size="32" />
        <DoorOpenIcon v-else-if="icon === 'door'" :size="32" />
        <CalendarIcon v-else-if="icon === 'calendar'" :size="32" />
      </div>
      <div class="stat-card__content">
        <h3 class="stat-card__title">{{ title }}</h3>
        <p class="stat-card__value">{{ value }}</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { FilmIcon, DoorOpenIcon, CalendarIcon } from 'lucide-vue-next'
import Card from '@/components/atoms/Card.vue'

interface Props {
  title: string
  value: number
  icon: 'film' | 'door' | 'calendar'
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

interface Emits {
  (e: 'click'): void
}

withDefaults(defineProps<Props>(), {
  color: 'primary'
})

defineEmits<Emits>()
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-card__icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-secondary);
}

.stat-card--primary .stat-card__icon {
  background-color: var(--color-primary);
  color: white;
}

.stat-card--success .stat-card__icon {
  background-color: var(--color-success);
  color: white;
}

.stat-card--warning .stat-card__icon {
  background-color: var(--color-warning);
  color: white;
}

.stat-card--danger .stat-card__icon {
  background-color: var(--color-error);
  color: white;
}

.stat-card__content {
  flex: 1;
}

.stat-card__title {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card__value {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
}
</style>
