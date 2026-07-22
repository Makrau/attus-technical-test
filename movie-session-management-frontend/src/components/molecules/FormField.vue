<template>
  <div class="form-field">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}
</style>
