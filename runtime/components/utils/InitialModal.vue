<script setup lang="ts">
import { type InitialModalConfig } from "../../types"

interface props {
  config: InitialModalConfig
  parsePurposes: (text: string) => string
  declineAll: () => void
  savePreferences: () => void
  linkColors: {[key: string]: string}
  buttonColors: {[key: string]: string}
  showMore: () => void
  acceptAll: () => void
}

const props = withDefaults(defineProps<props>(), {
  config: () => ({}),
  parsePurposes: () => '',
  declineAll: () => {},
  savePreferences: () => {},
  linkColors: () => {},
  buttonColors: () => {},
  showMore: () => {},
  acceptAll: () => {},
})

</script>

<template>
  <div class="bg-white dark:bg-gray-800">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ config.title }}</h3>
      <img v-if="config.logo" :src="config.logo" :alt="config.title" class="w-10">
    </div>
    
    <!-- Description -->
    <div class="py-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ parsePurposes(config.description) }}
        <span v-if="config.decline.type === 'inline'">{{ config.decline.inline.text }} <a @click.stop.prevent="declineAll" class="text-sm cursor-pointer underline" :class="linkColors[config.decline.color]">{{ config.decline.inline.link }}</a>.</span>
        <span v-if="config.more.type === 'inline'"> {{ config.more.inline.text }} <a @click.stop.prevent="showMore()" class="text-sm cursor-pointer underline" :class="linkColors[config.more.color]">{{ config.more.inline.link }}</a>.</span>
        <span v-if="config.privacyPolicy.type === 'inline'"> {{ config.privacyPolicy.inline.text }} <a @click.stop.prevent="showMore()" class="text-sm cursor-pointer underline" :class="linkColors[config.privacyPolicy.color]">{{ config.privacyPolicy.inline.link }}</a>.</span>
      </p>
    </div>
    
    <!-- Actions -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div class="w-full flex justify-between items-center">
        <div class="flex gap-2 justify-center items-center">
          <button v-if="config.privacyPolicy.type === 'button'" class="text-sm px-3 py-1 text-white rounded-md transition-colors cursor-pointer" :class="buttonColors[config.privacyPolicy.color]" @click="savePreferences" tabindex="-1">
            {{ config.privacyPolicy.text }}
          </button>
          <span v-if="config.privacyPolicy.type === 'link'" class="text-sm cursor-pointer underline" :class="linkColors[config.privacyPolicy.color]" @click.stop.prevent="showMore()">{{ config.privacyPolicy.text }}</span>
            <button v-if="config.more.type === 'button'" class="text-sm px-3 py-1 text-white rounded-md transition-colors cursor-pointer" :class="buttonColors[config.more.color]" @click.stop.prevent="showMore()" tabindex="-1">
            {{ config.more.text }}
          </button>
          <span v-if="config.more.type === 'link'" class="text-sm cursor-pointer underline" :class="linkColors[config.more.color]" @click.stop.prevent="showMore()">{{ config.more.text }}</span>
        </div>

        <div class="flex gap-2 justify-center items-center">
          <button v-if="config.decline.type === 'button'" class="text-sm px-3 py-1 text-white rounded-md transition-colors cursor-pointer" :class="buttonColors[config.decline.color]" @click="declineAll" tabindex="-1">
            {{ config.decline.text }}
          </button>
          <span v-if="config.decline.type === 'link'" class="text-sm cursor-pointer underline" :class="linkColors[config.decline.color]" @click.stop.prevent="declineAll">{{ config.decline.text }}</span>
          <button v-if="config.accept.type === 'button'" class="text-sm px-3 py-1 text-white rounded-md transition-colors cursor-pointer" :class="buttonColors[config.accept.color]" @click="acceptAll" tabindex="-1">
            {{ config.accept.text }}
          </button>
          <span v-if="config.accept.type === 'link'" class="text-sm cursor-pointer underline" :class="linkColors[config.accept.color]" @click.stop.prevent="acceptAll">{{ config.accept.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>