<template>
  <div class="session-form-view">
    <SessionForm :session-id="sessionId" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SessionForm from '@/components/organisms/SessionForm.vue'

const route = useRoute()
const sessionId = computed(() => route.params.id as string | undefined)
</script>

<style scoped>
.session-form-view {
  padding: var(--spacing-6);
  max-width: 600px;
  margin: 0 auto;
}
</style>
