<script setup lang="ts">
import { reactive } from 'vue'
import AdvancedSwitch from "./switch/AdvancedSwitch.vue"
import Switch from "./switch/Switch.vue"
import { type PreferencesModalConfig } from "../../types"
import { type Purpose, type Service } from "../../types"

interface props {
  config: PreferencesModalConfig
  servicePreferences: any
  declineAll: () => void
  savePreferences: () => void
  getLinkClasses: (color: string) => string
  getButtonClasses: (color: string) => string
  acceptAll: () => void
  color: string
  showAllServicesSwitch: boolean
}

const props = withDefaults(defineProps<props>(), {
  config: {},
  servicePreferences: {},
  declineAll: () => {},
  savePreferences: () => {},
  getLinkClasses: () => '',
  getButtonClasses: () => '',
  acceptAll: () => {},
  color: '',
  showAllServicesSwitch: true,
})

const expandedPurposes = reactive<Record<string, boolean>>({})

const togglePurpose = (purpose: Purpose, newState: 'off' | 'half' | 'full') => {
  const services = purpose.services ?? []
  
  if (newState === 'full') {
    // Switch went to FULL - set all non-required services ON
    services.forEach((service: Service) => {
      if (!service.required) {
        props.servicePreferences[service.id] = true
      }
    })
  } else {
    // Switch went to OFF - set all non-required services OFF
    services.forEach((service: Service) => {
      if (!service.required) {
        props.servicePreferences[service.id] = false
      }
    })
  }
}

const toggleService = (serviceId: string, enabled: boolean) => {
  props.servicePreferences[serviceId] = enabled
}

const purposeCheckedStatus = (purpose: Purpose) => {
  const services = purpose.services ?? []
  if (services.length === 0) return 'off'
  
  let enabledCount = 0
  for (const service of services) {
    if (props.servicePreferences[service.id]) {
      enabledCount++
    }
  }
  
  if (enabledCount === services.length) {
    return 'full'
  } else if (enabledCount > 0) {
    return 'half'
  } else {
    return 'off'
  }
}

const allServicesCheckedStatus = () => {
  
  const enabledCount = props.config.purposes?.filter((purpose: Purpose) => purpose.services?.every((service: Service) => props.servicePreferences[service.id])).length
  
  if (enabledCount === props.config.purposes?.length) {
    return 'full'
  } else if (enabledCount > 0) {
    return 'half'
  } else {
    return 'off'
  }
}

const toggleAllServices = (newState: 'full' | 'off') => {
  const allServices = props.config.purposes?.flatMap(purpose => purpose.services?.filter((service: Service) => !service.required) || []) || []
  allServices.forEach((service: Service) => {
    props.servicePreferences[service.id] = newState === 'full' ? true : false
  })
}

const purposeRequired = (purpose: Purpose) => {
  return purpose.services?.every((service: Service) => service.required)
}

const togglePurposeExpansion = (purposeId: string) => {
  expandedPurposes[purposeId] = !expandedPurposes[purposeId]
}


</script>


<template>
  <div class="max-h-[80vh] flex flex-col">
    <!-- Header -->
    <div class="flex-shrink-0 border-b border-gray-200 pb-4">
      <div class="flex items-center justify-between">
        <h3 class="text-3xl font-semibold text-gray-900">{{ config.title }}</h3>
        <img v-if="config.bannerImage" :src="config.bannerImage" :alt="config.title" class="w-10">
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ config.description }}</p>
    </div>
    
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto py-4">
      <!-- Purposes -->
      <div 
        v-for="purpose in config.purposes" 
        :key="purpose.id"
        class="border-b border-gray-200 p-4"
      >
        <div class="flex items-start space-x-3">
          <div class="flex items-center">
            <AdvancedSwitch
                :id="purpose.id"
                :model-value="purposeCheckedStatus(purpose)"
                :disabled="purposeRequired(purpose)"
                @update:model-value="(state) => togglePurpose(purpose, state)"
                :disable-off="purpose.services?.some((service: any) => service.required)"
                :show-indicators="purpose.services?.length > 1"
                :color="color"
            />
          </div>
          
          <div class="flex-1 min-w-0">
            <label 
              :for="purpose.id" 
              class="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
              :class="{ 'cursor-not-allowed opacity-50': purposeRequired(purpose) }"
            >
              {{ purpose.title }}
              <span v-if="purposeRequired(purpose)" class="text-xs text-gray-500 ml-1">(Required)</span>
            </label>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ purpose.description }}
            </p>
            
            <div v-if="purpose.services?.length" class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <button 
                @click="togglePurposeExpansion(purpose.id)"
                class="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                <i :class="expandedPurposes[purpose.id] ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'" class="text-sm"></i>
                {{ purpose.services.length }} service{{ purpose.services.length !== 1 ? 's' : '' }}
              </button>
            </div>
          </div>
        </div>
        
      <!-- Services -->
        <div 
          v-if="purpose.services && purpose.services.length > 0 && expandedPurposes[purpose.id]" 
          class="ml-8 mt-4 space-y-3 border-l-2 border-gray-100 pl-4 overflow-hidden"
        >
          <div 
            v-for="service in purpose.services" 
            :key="service.id"
            class="flex items-start space-x-3"
          >
            <div class="flex items-center">
              <Switch
                  :id="service.id"
                  :model-value="servicePreferences[service.id]"
                  :disabled="service.required"
                  @update:model-value="toggleService(service.id, !props.servicePreferences[service.id])"
                  :color="color"
              />
            </div>
            
            <div class="flex-1 min-w-0">
              <label 
                :for="service.id" 
                class="block text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
                :class="{ 'cursor-not-allowed opacity-50': service.required }"
              >
                {{ service.title }}
                <span v-if="service.required" class="text-xs text-gray-500 ml-1">(Required)</span>
              </label>
              
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Services Switch -->
    <div v-if="showAllServicesSwitch" class="flex items-center space-x-3 mx-4 pb-4">
      <AdvancedSwitch
          :model-value="allServicesCheckedStatus()"
          @update:model-value="(state) => toggleAllServices(state)"
          :disable-off="config.purposes?.some((purpose: any) => purpose.services?.some((service: any) => service.required))"
          :color="color"
      />
      <label class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
        All Services
      </label>
    </div>

    <!-- Fixed bottom section -->
    <div class="flex-shrink-0 mx-4 pt-4" :class="{ 'border-t border-gray-200': showAllServicesSwitch }">
      <!-- Footer buttons -->
      <div class="w-full flex justify-between items-center">
        <button 
          @click="savePreferences"
          :class="getButtonClasses('gray')"
        >
          Accept Selected
        </button>
        
        <button 
          :class="getButtonClasses(color)"
          @click="acceptAll"
        >
          Accept All
        </button>
      </div>
    </div>
  </div>
</template>