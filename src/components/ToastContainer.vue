<template>
  <v-snackbar
    v-for="toast in toasts"
    :key="toast.id"
    v-model="toast.visible"
    :color="getToastColor(toast.type)"
    location="top right"
    class="toast-item"
    :timeout="-1"
    @update:model-value="!$event && removeToast(toast.id)"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">{{ getToastIcon(toast.type) }}</v-icon>
      {{ toast.message }}
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="removeToast(toast.id)"
        class="ml-2"
      ></v-btn>
    </div>
  </v-snackbar>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const getToastColor = (type) => {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return colors[type] || 'info'
}

const getToastIcon = (type) => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  }
  return icons[type] || 'mdi-information'
}
</script>

<style scoped>
.toast-item {
  position: fixed;
  z-index: 9999;
}
</style>