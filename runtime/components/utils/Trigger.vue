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
    class="fixed flex items-center justify-center bottom-4 left-4 w-10 h-10 cursor-pointer bg-gray-100 text-gray-500 hover:text-primary rounded-full p-2 shadow-lg hover:shadow-xl z-50"
    @click="onClick"
  >
    <i :class="icon" class="text-lg"></i>
  </button>
</template>