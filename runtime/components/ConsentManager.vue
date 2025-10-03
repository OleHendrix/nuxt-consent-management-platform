<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useCookie, useRuntimeConfig } from 'nuxt/app'

import  DialogNew from "./utils/dialog/Dialog.vue"
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

// Try to load user config, fallback to defaults
let initialModalConfig = {}
let preferencesModalConfig = {}
let purposes = []


const servicePreferences = reactive<Record<string, boolean>>({})
const isInitialized = ref(false)
const isDialogOpen = ref(false)
const showMore = ref(false)
const cookieSet = ref(false)


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
  const runtimeConfig = useRuntimeConfig()
  initialModalConfig = runtimeConfig.public.consentManagement.initialModal
  preferencesModalConfig = runtimeConfig.public.consentManagement.preferencesModal
  purposes = preferencesModalConfig.purposes
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

const colorClasses = {
  red: {
    button: 'text-sm px-3 py-1 text-white rounded-md transition-colors bg-red-600 hover:bg-red-500 cursor-pointer',
    link: 'text-sm text-red-500 hover:text-red-600 cursor-pointer underline'
  },
  green: {
    button: 'text-sm px-3 py-1 text-white rounded-md transition-colors bg-green-600 hover:bg-green-500 cursor-pointer',
    link: 'text-sm text-green-500 hover:text-green-600 cursor-pointer underline'
  },
  blue: {
    button: 'text-sm px-3 py-1 text-white rounded-md transition-colors bg-blue-600 hover:bg-blue-500 cursor-pointer',
    link: 'text-sm text-blue-500 hover:text-blue-600 cursor-pointer underline'
  },
  yellow: {
    button: 'text-sm px-3 py-1 text-white rounded-md transition-colors bg-yellow-600 hover:bg-yellow-500 cursor-pointer',
    link: 'text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer underline'
  }
}

const getButtonClasses = (color: string) => {
  return colorClasses[color]?.button || colorClasses.blue.button
}

const getLinkClasses = (color: string) => {
  return colorClasses[color]?.link || colorClasses.blue.link
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