import type { SupportedLocale } from '../types.js'

const translationCache = new Map<string, Partial<Record<SupportedLocale, string>>>()

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en_US', 'fr_FR', 'de_DE', 'ja_JP', 'es_CO', 'ar_AR']

export const TASK_TRANSLATIONS: Record<string, Partial<Record<SupportedLocale, string>>> = {
  'make coffee': {
    en_US: 'make coffee',
    fr_FR: 'faire du café',
    de_DE: 'Kaffee machen',
    ja_JP: 'コーヒーを作る',
    es_CO: 'hacer café',
    ar_AR: 'اصنع القهوة',
  },
  school: {
    en_US: 'school',
    fr_FR: 'école',
    de_DE: 'Schule',
    ja_JP: '学校',
    es_CO: 'escuela',
    ar_AR: 'مدرسة',
  },
  dog: {
    en_US: 'dog',
    fr_FR: 'chien',
    de_DE: 'Hund',
    ja_JP: '犬',
    es_CO: 'perro',
    ar_AR: 'كلب',
  },
  book: {
    en_US: 'book',
    fr_FR: 'livre',
    de_DE: 'Buch',
    ja_JP: '本',
    es_CO: 'libro',
    ar_AR: 'كتاب',
  },
  nice: {
    en_US: 'nice',
    fr_FR: 'beau',
    de_DE: 'nett',
    ja_JP: 'いい',
    es_CO: 'bonito',
    ar_AR: 'جميل',
  },
  coffee: {
    en_US: 'coffee',
    fr_FR: 'café',
    de_DE: 'Kaffee',
    ja_JP: 'コーヒー',
    es_CO: 'café',
    ar_AR: 'قهوة',
  },
  home: {
    en_US: 'home',
    fr_FR: 'maison',
    de_DE: 'Zuhause',
    ja_JP: '家',
    es_CO: 'hogar',
    ar_AR: 'المنزل',
  },
  study: {
    en_US: 'study',
    fr_FR: 'étudier',
    de_DE: 'lernen',
    ja_JP: '勉強',
    es_CO: 'estudiar',
    ar_AR: 'دراسة',
  },
  'read book': {
    en_US: 'read book',
    fr_FR: 'lire un livre',
    de_DE: 'Buch lesen',
    ja_JP: '本を読む',
    es_CO: 'leer un libro',
    ar_AR: 'اقرأ كتابًا',
  },
  'dog book': {
    en_US: 'dog book',
    fr_FR: 'livre de chien',
    de_DE: 'Hund Buch',
    ja_JP: '犬の本',
    es_CO: 'libro del perro',
    ar_AR: 'كتاب الكلب',
  },
  'book buy funny': {
    en_US: 'book buy funny',
    fr_FR: 'acheter un livre drôle',
    de_DE: 'lustiges Buch kaufen',
    ja_JP: 'おもしろい本を買う',
    es_CO: 'comprar un libro divertido',
    ar_AR: 'شراء كتاب مضحك',
  },
}

export const normalizeTaskText = (value: string) => value.trim().toLowerCase()

export const getCanonicalTaskKey = (value: string) => {
  const normalizedValue = normalizeTaskText(value)

  const directKey = Object.keys(TASK_TRANSLATIONS).find(
    (key) => normalizeTaskText(key) === normalizedValue,
  )

  if (directKey) {
    return directKey
  }

  for (const [key, translations] of Object.entries(TASK_TRANSLATIONS)) {
    const matchesTranslation = Object.values(translations ?? {}).some(
      (translation) => normalizeTaskText(translation ?? '') === normalizedValue,
    )

    if (matchesTranslation) {
      return key
    }
  }

  return normalizedValue
}

export const fetchTranslationsFromAPI = async (
  text: string,
  targetLocales: SupportedLocale[],
): Promise<Partial<Record<SupportedLocale, string>>> => {
  const trimmedText = text.trim()

  if (!trimmedText) {
    return {}
  }

  const cacheKey = `${trimmedText}::${targetLocales.join(',')}`
  const cached = translationCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const viteMeta = import.meta as ImportMeta & {
    env?: Record<string, string | undefined>
  }
  const proxyUrl =
    viteMeta.env?.VITE_TRANSLATION_PROXY_URL ?? 'http://localhost:5000/api/translate'

  if (!proxyUrl) {
    return {}
  }

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: trimmedText,
        targetLocales,
      }),
    })

    if (!response.ok) {
      return {}
    }

    const data = (await response.json()) as {
      translations?: Partial<Record<SupportedLocale, string>>
    }

    const nextTranslations = data.translations ?? {}
    translationCache.set(cacheKey, nextTranslations)

    return nextTranslations
  } catch {
    return {}
  }
}

export const getDictionaryTranslations = (
  key: string,
  language: SupportedLocale,
): Partial<Record<SupportedLocale, string>> => {
  const translations = TASK_TRANSLATIONS[key]

  if (translations) {
    return {
      ...translations,
      [language]: translations[language] ?? key,
    }
  }

  return {
    [language]: key,
  }
}

export const buildFallbackTranslations = (
  text: string,
  targetLocales: SupportedLocale[],
): Partial<Record<SupportedLocale, string>> => {
  const normalizedText = text.trim()

  if (!normalizedText) {
    return {}
  }

  return Object.fromEntries(
    targetLocales.map((locale) => [locale, normalizedText]),
  ) as Partial<Record<SupportedLocale, string>>
}

export const buildTaskTranslations = async (
  key: string,
  language: SupportedLocale,
): Promise<Partial<Record<SupportedLocale, string>>> => {
  const dictionaryTranslations = TASK_TRANSLATIONS[key]

  if (dictionaryTranslations) {
    return {
      ...dictionaryTranslations,
      [language]: dictionaryTranslations[language] ?? key,
    }
  }

  const apiTranslations = await fetchTranslationsFromAPI(key, SUPPORTED_LOCALES)

  if (Object.keys(apiTranslations).length > 0) {
    return {
      ...apiTranslations,
      [language]: apiTranslations[language] ?? key,
    }
  }

  return getDictionaryTranslations(key, language)
}
