<script setup lang="ts">
import { ref, computed } from 'vue'

export interface SwitchProps {
  modelValue?: boolean
  disabled?: boolean
  id?: string
  name?: string
  class?: string
  color?: string
}

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
  color: 'blue'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isChecked = computed(() => props.modelValue)

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    toggle()
  }
}


const switchClasses = computed(() => {
  const baseClasses = 'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-gray-600 dark:focus-visible:ring-offset-gray-900'
  
  const stateClasses = isChecked.value 
    ? `bg-${props.color}-600 dark:bg-${props.color}-500` 
    : 'bg-gray-200 dark:bg-gray-700'
  
  const disabledClasses = props.disabled 
    ? 'cursor-not-allowed opacity-50' 
    : ''
  
  return `${baseClasses} ${stateClasses} ${disabledClasses} ${props.class || ''}`
})

const thumbClasses = computed(() => {
  const baseClasses = 'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform'
  
  const transformClasses = isChecked.value 
    ? 'translate-x-4' 
    : 'translate-x-0'
  
  return `${baseClasses} ${transformClasses}`
})
</script>

<template>
  <button
    :id="id"
    :name="name"
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :disabled="disabled"
    :class="switchClasses"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <span :class="thumbClasses" />
  </button>
</template>
