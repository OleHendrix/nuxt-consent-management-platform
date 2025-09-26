<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useCookie, useRuntimeConfig } from 'nuxt/app'

import  DialogNew from "./utils/dialog/Dialog.vue"
import { initialModalConfig as defaultInitialConfig, preferencesModalConfig as defaultPreferencesConfig } from "../config"
import { type Purpose, type Service } from "../types"
import Trigger from "./utils/Trigger.vue"
import InitialModal from "./utils/InitialModal.vue"
import PreferencesModal from "./utils/PreferencesModal.vue"

interface props {
  showAllServicesSwitch?: boolean
}

const props = withDefaults(defineProps<props>(), {
  showAllServicesSwitch: true,
})

// Get user configuration from runtime config
const runtimeConfig = useRuntimeConfig()
const moduleConfig = runtimeConfig.public.consentManagement

// Merge default config with user config
const initialModalConfig = computed(() => ({
  ...defaultInitialConfig,
  ...moduleConfig?.initialModal
}))

const preferencesModalConfig = computed(() => ({
  ...defaultPreferencesConfig,
  ...moduleConfig?.preferencesModal
}))

const servicePreferences = reactive<Record<string, boolean>>({})
const isInitialized = ref(false)
const isDialogOpen = ref(false)
const showMore = ref(false)
const cookieSet = ref(false)

const { purposes } = preferencesModalConfig

// Use configured cookie name
const cookieName = moduleConfig?.cookieName || 'cookie-preferences'
const cookieMaxAge = moduleConfig?.cookieMaxAge || (60 * 60 * 24 * 365)

const cookiePrefs = useCookie(cookieName, {
  default: () => ({}),
  maxAge: cookieMaxAge,
  sameSite: 'strict',
  secure: true, // HTTPS
  httpOnly: false // JavaScript can read it
})

onMounted(() => {
  // Load from cookie if available
  const savedPrefs = cookiePrefs.value
  if (savedPrefs.preferences) {
    cookieSet.value = true
    // showMore.value = true
    Object.assign(servicePreferences, savedPrefs.preferences)
  } else {
    // Fallback to default values
    purposes?.forEach(purpose => {
      purpose.services?.forEach(service => {
        servicePreferences[service.id] = service.required ?? false
      })
    })
    isDialogOpen.value = true
  }
  isInitialized.value = true
})


const savePreferences = () => {
  const currentTimestamp = new Date().toISOString()

  cookiePrefs.value = {
    timestamp: currentTimestamp,
    preferences: { ...servicePreferences }
  }
  
  isDialogOpen.value = false
}

const acceptAll = () => {
  purposes?.forEach(purpose => {
    purpose.services?.forEach(service => {
      if (!service.required) {
        servicePreferences[service.id] = true
      }
    })
  })
  savePreferences()
}

const declineAll = () => {
  purposes?.forEach(purpose => {
    purpose.services?.forEach(service => {
      if (!service.required) {
        servicePreferences[service.id] = false
      }
    })
  })
  savePreferences()
}

const parsePurposes = (text: string) => {
  return text.replace('{{ purposes }}', purposes?.filter((purpose: Purpose) => purpose.services?.some((service: Service) => !service.required)).map((purpose: Purpose) => purpose.title).join(' & '))
}

const getButtonClasses = (color: string) => {
  return `text-sm px-3 py-1 text-white rounded-md transition-colors bg-${color}-600 hover:bg-${color}-500 cursor-pointer`
}

const getLinkClasses = (color: string) => {
  return `text-sm text-${color}-500 hover:text-${color}-600 cursor-pointer underline`
}

</script>

<template>
  <Trigger
      :onClick="() => isDialogOpen = true" 
      :icon="initialModalConfig.triggerIcon ?? 'ri-settings-5-line'"
  />

  <DialogNew 
      v-if="isInitialized" 
      :open="isDialogOpen" 
      :close-on-backdrop="cookieSet" 
      @close="isDialogOpen = false"
  >

     <InitialModal
        v-if="!showMore"
        :config="initialModalConfig" 
        :parsePurposes="parsePurposes" 
        :declineAll="declineAll" 
        :savePreferences="savePreferences" 
        :getLinkClasses="getLinkClasses" 
        :getButtonClasses="getButtonClasses" 
        :showMore="() => showMore = true" 
        :acceptAll="acceptAll" 
    />

    <PreferencesModal
        v-if="showMore"
        :config="preferencesModalConfig" 
        :servicePreferences="servicePreferences" 
        :declineAll="declineAll" 
        :savePreferences="savePreferences" 
        :getLinkClasses="getLinkClasses" 
        :getButtonClasses="getButtonClasses" 
        :acceptAll="acceptAll"
        :color="initialModalConfig.accept.color"
        :showAllServicesSwitch="showAllServicesSwitch"
    />

  </DialogNew>
</template>