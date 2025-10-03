<script setup lang="ts">
import { type InitialModalConfig } from "../../types"

interface props {
  config: InitialModalConfig
  parsePurposes: (text: string) => string
  declineAll: () => void
  savePreferences: () => void
  getLinkClasses: (color: string) => string
  getButtonClasses: (color: string) => string
  showMore: () => void
  acceptAll: () => void
}

const props = withDefaults(defineProps<props>(), {
  config: () => ({}),
  parsePurposes: () => '',
  declineAll: () => {},
  savePreferences: () => {},
  getLinkClasses: () => '',
  getButtonClasses: () => '',
  showMore: () => {},
  acceptAll: () => {},
})

onMounted(() => {
  console.log('config', props.config)
})

</script>

<template>
  <div>
    <!-- Header -->
    <div class="cmp-modal-header">
      <h3 class="cmp-modal-title">{{ config.title }}</h3>
      <img v-if="config.logoImage" :src="config.logoImage" :alt="config.title" class="cmp-logo">
    </div>
    
    <!-- Description -->
    <div class="cmp-modal-description">
      <p class="cmp-text">
        {{ parsePurposes(config.description) }}
        <span v-if="config.decline.type === 'inline'">{{ config.decline.inline.text }} <a @click.stop.prevent="declineAll" :class="getLinkClasses(config.decline.color)">{{ config.decline.inline.link }}</a>.</span>
        <span v-if="config.more.type === 'inline'"> {{ config.more.inline.text }} <a @click.stop.prevent="showMore()" :class="getLinkClasses(config.more.color)">{{ config.more.inline.link }}</a>.</span>
        <span v-if="config.privacyPolicy.type === 'inline'"> {{ config.privacyPolicy.inline.text }} <a @click.stop.prevent="showMore()" :class="getLinkClasses(config.privacyPolicy.color)">{{ config.privacyPolicy.inline.link }}</a>.</span>
      </p>
    </div>
    
    <!-- Actions -->
    <div class="cmp-modal-actions">
      <div class="cmp-modal-actions-container">
        <div class="cmp-modal-actions-left">
          <button v-if="config.privacyPolicy.type === 'button'" :class="getButtonClasses(config.privacyPolicy.color)" @click="savePreferences">
            {{ config.privacyPolicy.text }}
          </button>
          <span v-if="config.privacyPolicy.type === 'link'" @click.stop.prevent="showMore()" :class="getLinkClasses(config.privacyPolicy.color)">{{ config.privacyPolicy.text }}</span>
            <button v-if="config.more.type === 'button'" :class="getButtonClasses(config.more.color)" @click.stop.prevent="showMore()">
            {{ config.more.text }}
          </button>
          <span v-if="config.more.type === 'link'"  @click.stop.prevent="showMore()"  :class="getLinkClasses(config.more.color)">{{ config.more.text }}</span>
        </div>

        <div class="cmp-modal-actions-right">
          <button v-if="config.decline.type === 'button'" :class="getButtonClasses(config.decline.color)" @click="declineAll">
            {{ config.decline.text }}
          </button>
          <span v-if="config.decline.type === 'link'" @click.stop.prevent="declineAll" :class="getLinkClasses(config.decline.color)">{{ config.decline.text }}</span>
          <button v-if="config.accept.type === 'button'" :class="getButtonClasses(config.accept.color)" @click="acceptAll">
            {{ config.accept.text }}
          </button>
          <span v-if="config.accept.type === 'link'" @click.stop.prevent="acceptAll" :class="getLinkClasses(config.accept.color)">{{ config.accept.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>