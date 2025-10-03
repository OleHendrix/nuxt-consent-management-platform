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
  <div class="cmp-preferences-modal">
    <!-- Header -->
    <div class="cmp-preferences-header">
      <div class="cmp-preferences-header-content">
        <h3 class="cmp-preferences-title">{{ config.title }}</h3>
        <img v-if="config.bannerImage" :src="config.bannerImage" :alt="config.title" class="cmp-logo">
      </div>
      <p class="cmp-preferences-description">{{ config.description }}</p>
    </div>
    
    <!-- Scrollable Content -->
    <div class="cmp-preferences-content">
      <!-- Purposes -->
      <div 
        v-for="purpose in config.purposes" 
        :key="purpose.id"
        class="cmp-purpose-item"
      >
        <div class="cmp-purpose-row">
          <div class="cmp-purpose-switch">
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
          
          <div class="cmp-purpose-details">
            <label 
              :for="purpose.id" 
              class="cmp-purpose-label"
              :class="{ 'cmp-label-disabled': purposeRequired(purpose) }"
            >
              {{ purpose.title }}
              <span v-if="purposeRequired(purpose)" class="cmp-required-badge">(Required)</span>
            </label>
            
            <p class="cmp-purpose-text">
              {{ purpose.description }}
            </p>
            
            <div v-if="purpose.services?.length" class="cmp-services-toggle">
              <button 
                @click="togglePurposeExpansion(purpose.id)"
                class="cmp-expand-button"
              >
                <i :class="expandedPurposes[purpose.id] ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'" class="cmp-expand-icon"></i>
                {{ purpose.services.length }} service{{ purpose.services.length !== 1 ? 's' : '' }}
              </button>
            </div>
          </div>
        </div>
        
      <!-- Services -->
        <div 
          v-if="purpose.services && purpose.services.length > 0 && expandedPurposes[purpose.id]" 
          class="cmp-services-list"
        >
          <div 
            v-for="service in purpose.services" 
            :key="service.id"
            class="cmp-service-item"
          >
            <div class="cmp-service-switch">
              <Switch
                  :id="service.id"
                  :model-value="servicePreferences[service.id]"
                  :disabled="service.required"
                  @update:model-value="toggleService(service.id, !props.servicePreferences[service.id])"
                  :color="color"
              />
            </div>
            
            <div class="cmp-service-details">
              <label 
                :for="service.id" 
                class="cmp-service-label"
                :class="{ 'cmp-label-disabled': service.required }"
              >
                {{ service.title }}
                <span v-if="service.required" class="cmp-required-badge">(Required)</span>
              </label>
              
              <p class="cmp-service-text">
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Services Switch -->
    <div v-if="showAllServicesSwitch" class="cmp-all-services">
      <AdvancedSwitch
          :model-value="allServicesCheckedStatus()"
          @update:model-value="(state) => toggleAllServices(state)"
          :disable-off="config.purposes?.some((purpose: any) => purpose.services?.some((service: any) => service.required))"
          :color="color"
      />
      <label class="cmp-all-services-label">
        All Services
      </label>
    </div>

    <!-- Fixed bottom section -->
    <div class="cmp-preferences-footer" :class="{ 'cmp-footer-border': showAllServicesSwitch }">
      <!-- Footer buttons -->
      <div class="cmp-preferences-actions">
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