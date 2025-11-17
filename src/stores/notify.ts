import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotifyType = 'success' | 'error'
export type NotifyTarget = 'home' | 'admin'

export const useNotifyStore = defineStore('notify', () => {
  const message = ref<string | null>(null)
  const type = ref<NotifyType | null>(null)
  const target = ref<NotifyTarget>('home')

  const notify = (msg: string, notifyType: NotifyType, notifyTarget: NotifyTarget = 'home') => {
    message.value = msg
    type.value = notifyType
    target.value = notifyTarget

    setTimeout(() => {
      message.value = null
      type.value = null
    }, 3000)
  }

  const clear = () => {
    message.value = null
    type.value = null
  }

  return { message, type, target, notify, clear }
})
