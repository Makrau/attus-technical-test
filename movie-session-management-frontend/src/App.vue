<script setup lang="ts">
import AppLayout from './components/layout/AppLayout.vue'
import ErrorBoundary from './components/organisms/ErrorBoundary.vue'
</script>

<template>
  <ErrorBoundary>
    <AppLayout>
      <RouterView />
    </AppLayout>
  </ErrorBoundary>
</template>

<style>
@import './styles/variables.css';
@import './styles/base.css';
</style>
