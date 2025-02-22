import { ref } from 'vue'

export function useScrollLock() {
  const originalPosition = ref(0)

  const lockScroll = () => {
    originalPosition.value = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${originalPosition.value}px`
    document.body.style.width = '100%'
  }

  const unlockScroll = () => {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, originalPosition.value)
  }

  return {
    lockScroll,
    unlockScroll
  }
}
