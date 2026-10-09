import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { SupportedLocale } from './types'

export const defaultLanguage: SupportedLocale = 'en_US'

export const supportedLanguages: SupportedLocale[] = [
  'en_US',
  'fr_FR',
  'de_DE',
  'ja_JP',
  'es_CO',
  'ar_AR',
]

export const i18n = i18next.createInstance()

i18n.use(initReactI18next).init({
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
  resources: {},
})

export async function loadLanguage(language: SupportedLocale) {
  const response = await fetch(`/locales/${language}_translation.json`)

  if (!response.ok) {
    throw new Error(`Unable to load translation for ${language}`)
  }

  const data = await response.json()
  i18n.addResourceBundle(language, 'translation', data, true, true)
  await i18n.changeLanguage(language)
}

export default i18n
