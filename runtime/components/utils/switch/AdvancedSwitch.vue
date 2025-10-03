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
    case 'off': return 'cmp-adv-switch-thumb-off'
    case 'half': return 'cmp-adv-switch-thumb-half'
    case 'full': return 'cmp-adv-switch-thumb-full'
    default: return 'cmp-adv-switch-thumb-off'
  }
})

const backgroundColor = computed(() => {
  switch (internalValue.value) {
    case 'off': return 'cmp-adv-switch-bg-off'
    case 'half': return `cmp-adv-switch-bg-half cmp-adv-switch-${props.color}`
    case 'full': return `cmp-adv-switch-bg-full cmp-adv-switch-${props.color}`
    default: return 'cmp-adv-switch-bg-off'
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
  const classes = ['cmp-adv-switch', backgroundColor.value]
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.filter(Boolean).join(' ')
})

const thumbClasses = computed(() => {
  return ['cmp-adv-switch-thumb', thumbPosition.value].join(' ')
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
    <div v-if="props.showIndicators" class="cmp-adv-switch-indicators">
      <div class="cmp-adv-switch-indicator" />
      <div class="cmp-adv-switch-indicator" />
      <div class="cmp-adv-switch-indicator" />
    </div>
  </button>
</template>
