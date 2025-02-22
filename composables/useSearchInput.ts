import { ref, nextTick, onMounted, onUnmounted } from 'vue'

export function useSearchInput(onHandleFocus?: () => void) {
  const input = ref<HTMLInputElement | null>(null)
  const cursorPosition = ref(0)
  const searchContainer = ref<HTMLDivElement | null>(null)
  const containerWidth = ref(0)
  const dropdownPosition = ref({ left: 0, top: 0 })
  const isInputFocused = ref(false)

  const updateCursorPosition = () => {
    nextTick(() => {
      if (input.value) {
        const inputElement = input.value
        cursorPosition.value = inputElement.selectionStart || 0
        const container = inputElement.parentElement

        if (container) {
          const measureElement = document.createElement('span')
          measureElement.style.font = window.getComputedStyle(inputElement).font
          measureElement.style.visibility = 'hidden'
          measureElement.style.position = 'absolute'
          measureElement.style.whiteSpace = 'pre'
          measureElement.textContent = inputElement.value.substring(0, inputElement.selectionStart || 0)
          document.body.appendChild(measureElement)
          
          const cursorOffset = measureElement.offsetWidth
          const containerWidth = container.offsetWidth
          const scrollLeft = container.scrollLeft
          
          document.body.removeChild(measureElement)

          if (cursorOffset > scrollLeft + containerWidth - 80) {
            container.scrollLeft = cursorOffset - containerWidth + 80
          }
          else if (cursorOffset < scrollLeft + 80) {
            container.scrollLeft = Math.max(0, cursorOffset - 80)
          }
        }
      }
    })
  }

  const handleInputScroll = (event: Event) => {
    const input = event.target as HTMLElement
    const mirror = input.previousElementSibling as HTMLElement
    if (mirror) {
      mirror.scrollLeft = input.scrollLeft
    }
  }

  const updateContainerWidth = () => {
    if (searchContainer.value) {
      containerWidth.value = searchContainer.value.offsetWidth
    }
  }

  const updateDropdownPosition = () => {
    if (searchContainer.value) {
      containerWidth.value = searchContainer.value.offsetWidth
    }
  }

  const handleGlobalShortcut = (event: KeyboardEvent) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
      event.preventDefault()
      isInputFocused.value = true
      onHandleFocus?.()
      nextTick(() => {
        input.value?.focus()
      })
    }
  }

  onMounted(() => {
    updateContainerWidth()
    window.addEventListener('resize', updateContainerWidth)
    window.addEventListener('keydown', handleGlobalShortcut)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateContainerWidth)
    window.removeEventListener('keydown', handleGlobalShortcut)
  })

  return {
    input,
    cursorPosition,
    searchContainer,
    containerWidth,
    dropdownPosition,
    isInputFocused,
    updateCursorPosition,
    handleInputScroll,
    updateContainerWidth,
    updateDropdownPosition,
    handleGlobalShortcut
  }
}
