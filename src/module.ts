// src/module.ts
import { defineNuxtModule, createResolver, addComponent, addComponentsDir } from '@nuxt/kit'
import type { InitialModalConfig, PreferencesModalConfig } from '../runtime/types'

export interface ModuleOptions {
  /**
   * Custom configuration for initial modal
   */
  initialModal?: Partial<InitialModalConfig>

  /**
   * Custom configuration for preferences modal  
   */
  preferencesModal?: Partial<PreferencesModalConfig>

  /**
   * Cookie name for storing preferences
   * @default 'cookie-preferences'
   */
  cookieName?: string

  /**
   * Cookie max age in seconds
   * @default 31536000 (1 year)
   */
  cookieMaxAge?: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@olehendrix/nuxt-consent-management-platform',
    configKey: 'consentManagement',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },  
  defaults: {
    cookieName: 'cookie-preferences',
    cookieMaxAge: 60 * 60 * 24 * 365, // 1 year
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'ConsentManager',
      filePath: resolve('../runtime/components/ConsentManager.vue')
    })

    // Make module options available in runtime config
    nuxt.options.runtimeConfig.public.consentManagement = options
  }
})

// Export types for TypeScript users
export type { InitialModalConfig, PreferencesModalConfig, Purpose, Service } from '../runtime/types'