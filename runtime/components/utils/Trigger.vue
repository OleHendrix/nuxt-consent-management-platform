<script setup lang="ts">

interface props {
  onClick: () => void
  icon: string
}

const props = withDefaults(defineProps<props>(), {
  onClick: () => {},
})

</script>

<template>
  <button 
    class="cmp-trigger"
    @click="onClick"
  >
    <i :class="icon" class="cmp-trigger-icon"></i>
  </button>
</template>