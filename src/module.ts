// src/module.ts
import { defineNuxtModule, createResolver, addComponent, addComponentsDir } from '@nuxt/kit'
import type { InitialModalConfig, PreferencesModalConfig } from '../runtime/types'

export interface ModuleOptions {
  configFilePath?: string
  cookieName?: string
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
    configFilePath: 'consent.config.ts',
    cookieName: 'cookie-preferences',
    cookieMaxAge: 60 * 60 * 24 * 365, // 1 year
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'ConsentManager',
      filePath: resolve('../runtime/components/ConsentManager.vue')
    })

    // Add the config file to the project
    nuxt.hook('prepare:types', async () => {
      const configPath = resolve(nuxt.options.rootDir, options.configFilePath!)

      // Create config file if it doesn't exist
      const fs = await import('fs')
      if (!fs.existsSync(configPath)) {
        const configTemplate = `import { type InitialModalConfig, type PreferencesModalConfig } from '@olehendrix/nuxt-consent-management-platform'

export const initialModalConfig: Partial<InitialModalConfig> = {
  title: "Hmmmm Cookies...",
  logoImage: null,
  description: "Welcome, would you be bothered if we use cookies for {{ purposes }} to make your experience better?",
  triggerIcon: null,
  decline: {
    type: 'button',
    text: "Decline",
    color: 'red',
    inline: {
      text: 'You can also',
      link: 'decline',
    },
  },
  more: {
    type: 'button',
    text: "More",
    color: 'green',
    inline: {
      text: ' You can also control your cookies ',
      link: 'here',
    },
  },
  privacyPolicy: {
    type: 'button',
    text: "Privacy Policy",
    color: 'yellow',
    inline: {
      text: ' For more information, check out our ',
      link: 'privacy policy',
    },
  },
  accept: {
    type: 'button',
    text: "Accept",
    color: 'blue',
  }
}

export const preferencesModalConfig: Partial<PreferencesModalConfig> = {
  title: "Hmmmm Cookies...",
  description: "Manage your privacy preferences and cookie settings",
  bannerImage: null,
  updatedAt: new Date().toISOString(),
  purposes: [
    {
      id: "services",
      title: "Services",
      description: "These services are essential for the proper functioning of this website.",
      services: [
        {
          id: "session",
          title: "Session",
          description: "Remembers your preferences during your session.",
          required: true
        },
        {
          id: "consent-management",
          title: "Consent-management",
          description: "Manages your cookie preferences.",
          required: true
        }
      ]
    }
  ]
}
`
        fs.writeFileSync(configPath, configTemplate)
        console.log(`✅ Created consent config file: ${options.configFilePath}`)
      }
    })

    // Make module options available in runtime config
    nuxt.options.runtimeConfig.public.consentManagement = options
  }
})

// Export types for TypeScript users
export type { InitialModalConfig, PreferencesModalConfig, Purpose, Service } from '../runtime/types'