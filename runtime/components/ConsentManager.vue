<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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
const moduleConfig = runtimeConfig.public.consentManagementPlatform

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
const cookieName = moduleConfig?.cookieName || 'consent'
const cookieMaxAge = moduleConfig?.cookieMaxAge || (60 * 60 * 24 * 365)

const cookiePrefs = useCookie(cookieName, {
  default: () => ({}),
  watch: true,
  maxAge: cookieMaxAge,
  sameSite: 'strict',
  secure: true, // HTTPS
  httpOnly: false // JavaScript can read it
})

onMounted(() => {
  // Load from cookie if available
  // document.documentElement.classList.toggle('dark', true);
  const runtimeConfig = useRuntimeConfig()
  initialModalConfig = runtimeConfig.public.consentManagementPlatform.initialModal
  preferencesModalConfig = runtimeConfig.public.consentManagementPlatform.preferencesModal
  purposes = preferencesModalConfig.purposes
  const savedPrefs = cookiePrefs.value
  if (savedPrefs.preferences) {
    cookieSet.value = true
    showMore.value = true
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


const savePreferences = async () => {
  const currentTimestamp = new Date().toISOString()

  cookiePrefs.value = {
    timestamp: currentTimestamp,
    preferences: { ...servicePreferences }
  }

  cookieSet.value = true
  isDialogOpen.value = false
  await new Promise(resolve => setTimeout(resolve, 1000))
  showMore.value = true
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

const linkColors = {
  slate: 'text-slate-500 hover:text-slate-600',
  gray: 'text-gray-500 hover:text-gray-600',
  zinc: 'text-zinc-500 hover:text-zinc-600',
  neutral: 'text-neutral-500 hover:text-neutral-600',
  stone: 'text-stone-500 hover:text-stone-600',
  red: 'text-red-500 hover:text-red-600',
  orange: 'text-orange-500 hover:text-orange-600',
  amber: 'text-amber-500 hover:text-amber-600',
  yellow: 'text-yellow-500 hover:text-yellow-600',
  lime: 'text-lime-500 hover:text-lime-600',
  green: 'text-green-500 hover:text-green-600',
  emerald: 'text-emerald-500 hover:text-emerald-600',
  teal: 'text-teal-500 hover:text-teal-600',
  cyan: 'text-cyan-500 hover:text-cyan-600',
  sky: 'text-sky-500 hover:text-sky-600',
  blue: 'text-blue-500 hover:text-blue-600',
  indigo: 'text-indigo-500 hover:text-indigo-600',
  violet: 'text-violet-500 hover:text-violet-600',
  purple: 'text-purple-500 hover:text-purple-600',
  fuchsia: 'text-fuchsia-500 hover:text-fuchsia-600',
  pink: 'text-pink-500 hover:text-pink-600',
  rose: 'text-rose-500 hover:text-rose-600'
}

const buttonColors = {
  slate: 'bg-slate-600 hover:bg-slate-500',
  gray: 'bg-gray-600 hover:bg-gray-500',
  zinc: 'bg-zinc-600 hover:bg-zinc-500',
  neutral: 'bg-neutral-600 hover:bg-neutral-500',
  stone: 'bg-stone-600 hover:bg-stone-500',
  red: 'bg-red-600 hover:bg-red-500',
  orange: 'bg-orange-600 hover:bg-orange-500',
  amber: 'bg-amber-600 hover:bg-amber-500',
  yellow: 'bg-yellow-600 hover:bg-yellow-500',
  lime: 'bg-lime-600 hover:bg-lime-500',
  green: 'bg-green-600 hover:bg-green-500',
  emerald: 'bg-emerald-600 hover:bg-emerald-500',
  teal: 'bg-teal-600 hover:bg-teal-500',
  cyan: 'bg-cyan-600 hover:bg-cyan-500',
  sky: 'bg-sky-600 hover:bg-sky-500',
  blue: 'bg-blue-600 hover:bg-blue-500',
  indigo: 'bg-indigo-600 hover:bg-indigo-500',
  violet: 'bg-violet-600 hover:bg-violet-500',
  purple: 'bg-purple-600 hover:bg-purple-500',
  fuchsia: 'bg-fuchsia-600 hover:bg-fuchsia-500',
  pink: 'bg-pink-600 hover:bg-pink-500',
  rose: 'bg-rose-600 hover:bg-rose-500'
}

</script>

<template>
  <Trigger
      :onClick="() => isDialogOpen = true" 
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
        :linkColors="linkColors"
        :buttonColors="buttonColors"
        :showMore="() => showMore = true" 
        :acceptAll="acceptAll" 
    />

    <PreferencesModal
        v-if="showMore"
        :config="preferencesModalConfig" 
        :servicePreferences="servicePreferences" 
        :declineAll="declineAll" 
        :savePreferences="savePreferences" 
        :linkColors="linkColors"
        :buttonColors="buttonColors"
        :acceptAll="acceptAll"
        :color="initialModalConfig.accept.color"
        :showAllServicesSwitch="showAllServicesSwitch"
    />

  </DialogNew>
</template>