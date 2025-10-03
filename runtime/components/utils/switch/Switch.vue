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
  const classes = ['cmp-switch']
  
  if (isChecked.value) {
    classes.push('cmp-switch-checked')
    classes.push(`cmp-switch-${props.color}`)
  } else {
    classes.push('cmp-switch-unchecked')
  }
  
  if (props.disabled) {
    classes.push('cmp-switch-disabled')
  }
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

const thumbClasses = computed(() => {
  const classes = ['cmp-switch-thumb']
  
  if (isChecked.value) {
    classes.push('cmp-switch-thumb-checked')
  }
  
  return classes.join(' ')
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
