// src/stores/error.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const message = ref<string | null>(null)

  const setError = (msg: string) => {
    message.value = msg
    setTimeout(() => {
      message.value = null
    }, 3000)
  }

  const clearError = () => {
    message.value = null
  }

  return { message, setError, clearError }
})
