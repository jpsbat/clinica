import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
      visible: true
    }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  const info = (message, duration) => addToast(message, 'info', duration)
  
  const clearAll = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  }
}