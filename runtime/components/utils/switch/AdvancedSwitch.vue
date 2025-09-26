<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type SwitchState = 'off' | 'half' | 'full'

interface Props {
  modelValue?: SwitchState
  class?: string
  disabled?: boolean
  color?: string
  disableOff?: boolean
  showIndicators?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: SwitchState): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'off',
  disabled: false,
  color: 'blue',
  disableOff: false,
  showIndicators: true
})

const emits = defineEmits<Emits>()

const internalValue = ref<SwitchState>(props.modelValue)

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  internalValue.value = newVal
})

const thumbPosition = computed(() => {
  switch (internalValue.value) {
    case 'off': return 'translate-x-0'
    case 'half': return 'translate-x-3'
    case 'full': return 'translate-x-6'
    default: return 'translate-x-0'
  }
})

const backgroundColor = computed(() => {
  switch (internalValue.value) {
    case 'off': return `bg-gray-200`
    case 'half': return `bg-${props.color}-500`
    case 'full': return `bg-${props.color}-600`
    default: return `bg-${props.color}-200`
  }
})

const nextState = (): SwitchState => {
  switch (internalValue.value) {
    case 'off': return 'full'
    case 'half': return 'full'
    case 'full': return props.disableOff ? 'half' : 'off'
    default: return 'off'
  }
}

const handleClick = () => {
  if (props.disabled) return
  
  const newState = nextState()
  internalValue.value = newState
  emits('update:modelValue', newState)
}

const buttonClasses = computed(() => {
  const baseClasses = 'relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'
  
  return [
    baseClasses,
    backgroundColor.value,
    props.class
  ].filter(Boolean).join(' ')
})

const thumbClasses = computed(() => {
  const baseClasses = 'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out'
  
  return [
    baseClasses,
    thumbPosition.value
  ].join(' ')
})
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span
      :class="thumbClasses"
    />
    
    <!-- Visual indicators for the three positions -->
    <div v-if="props.showIndicators" class="absolute inset-0 flex items-center justify-between px-1">
      <div class="w-1 h-1 rounded-full bg-white/25" />
      <div class="w-1 h-1 rounded-full bg-white/25" />
      <div class="w-1 h-1 rounded-full bg-white/25" />
    </div>
  </button>
</template>
