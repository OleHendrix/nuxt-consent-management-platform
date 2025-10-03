<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

export interface DialogProps {
  open?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
  open: false,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'close': []
}>()

const closeDialog = () => {
  emit('close')
}
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="cmp-dialog-wrapper" @close="props.closeOnBackdrop ? closeDialog() : null">
      <TransitionChild 
        as="template" 
        enter="cmp-fade-enter" 
        enter-from="cmp-fade-enter-from" 
        enter-to="cmp-fade-enter-to" 
        leave="cmp-fade-leave" 
        leave-from="cmp-fade-leave-from" 
        leave-to="cmp-fade-leave-to"
      >
        <div class="cmp-dialog-backdrop" />
      </TransitionChild>

      <div class="cmp-dialog-container">
        <div class="cmp-dialog-content-wrapper">
          <TransitionChild 
            as="template" 
            enter="cmp-dialog-enter" 
            enter-from="cmp-dialog-enter-from" 
            enter-to="cmp-dialog-enter-to" 
            leave="cmp-dialog-leave" 
            leave-from="cmp-dialog-leave-from" 
            leave-to="cmp-dialog-leave-to"
          >
            <DialogPanel class="cmp-dialog-panel">
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>