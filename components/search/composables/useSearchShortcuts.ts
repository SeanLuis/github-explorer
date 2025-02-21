import { onMounted, onUnmounted } from 'vue'

export function useSearchShortcuts(
  handleFocus: () => void,
  input: () => HTMLInputElement | null
) {
  const handleGlobalShortcut = (event: KeyboardEvent) => {
    if (
      event.key === '/' && 
      !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)
    ) {
      event.preventDefault()
      handleFocus()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleGlobalShortcut)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalShortcut)
  })

  return {
    handleGlobalShortcut
  }
}
