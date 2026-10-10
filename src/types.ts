export type Todo = {
  id: number
  text: string
  completed: boolean
  isSample?: boolean
  translations?: Partial<Record<SupportedLocale, string>>
}

export type SupportedLocale =
  | 'en_US'
  | 'fr_FR'
  | 'de_DE'
  | 'ja_JP'
  | 'es_CO'
  | 'ar_AR'

export type LanguageOption = {
  code: SupportedLocale
  label: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en_US', label: 'English' },
  { code: 'fr_FR', label: 'Français' },
  { code: 'de_DE', label: 'Deutsch' },
  { code: 'ja_JP', label: '日本語' },
  { code: 'es_CO', label: 'Español' },
  { code: 'ar_AR', label: 'العربية' },
]
