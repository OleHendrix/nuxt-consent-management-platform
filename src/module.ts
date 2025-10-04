// src/module.ts
import { defineNuxtModule, createResolver, addComponent } from '@nuxt/kit'
import type { InitialModalConfig, PreferencesModalConfig } from '../runtime/types'

export interface ModuleOptions {
  initialModal?: Partial<InitialModalConfig>
  preferencesModal?: Partial<PreferencesModalConfig>
  cookieName?: string
  cookieMaxAge?: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@olehendrix/nuxt-consent-management-platform',
    configKey: 'consentManagementPlatform',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },  
  defaults: {
    cookieName: 'consent',
    cookieMaxAge: 60 * 60 * 24 * 365, // 1 year
    initialModal: {},
    preferencesModal: {},
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'ConsentManager',
      filePath: resolve('../runtime/components/ConsentManager.vue')
    })

    nuxt.hook('app:resolve', (app) => {
      app.plugins.push({
        src: resolve('../runtime/composables/useConsent.ts'),
        mode: 'all'
      })
    })

    nuxt.options.runtimeConfig.public.consentManagementPlatform = {
      ...options,
      initialModal: options.initialModal || {},
      preferencesModal: options.preferencesModal || {}
    }
  }
})

export type { InitialModalConfig, PreferencesModalConfig, Purpose, Service } from '../runtime/types'