// runtime/composables/useConsent.ts
import { useCookie, useRuntimeConfig } from 'nuxt/app'

export const useConsent = () => {
  const runtimeConfig = useRuntimeConfig()
  const cookieName = runtimeConfig.public.consentManagementPlatform?.cookieName || 'consent'

  const cookiePrefs = useCookie(cookieName, {
    default: () => ({}),
    watch: true
  })

  const isServiceEnabled = (serviceId: string): boolean => {
    return cookiePrefs.value?.preferences?.[serviceId] === true
  }

  const hasConsent = (): boolean => {
    return !!cookiePrefs.value?.preferences
  }

  const getAllPreferences = () => {
    return cookiePrefs.value?.preferences || {}
  }

  return {
    isServiceEnabled,
    hasConsent,
    getAllPreferences
  }
}