import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 5000
const translationCache = new Map()

app.use(cors())
app.use(express.json())

const defaultTranslationMap = {
  en_US: 'en_US',
  fr_FR: 'fr_FR',
  de_DE: 'de_DE',
  ja_JP: 'ja_JP',
  es_CO: 'es_CO',
  ar_AR: 'ar_AR',
}

const translateWithDeepL = async (text, targetLocales) => {
  const trimmedText = text.trim()
  const cacheKey = `${trimmedText}::${targetLocales.join(',')}`

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  const apiKey = process.env.DEEPL_API_KEY

  if (!apiKey) {
    const fallback = Object.fromEntries(targetLocales.map((locale) => [locale, trimmedText]))
    translationCache.set(cacheKey, fallback)
    return fallback
  }

  const translations = {}

  for (const locale of targetLocales) {
    const targetLang = locale.split('_')[0].toUpperCase()

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: trimmedText,
        target_lang: targetLang,
      }),
    })

    if (!response.ok) {
      translations[locale] = trimmedText
      continue
    }

    const data = await response.json()
    translations[locale] = data.translations?.[0]?.text ?? trimmedText
  }

  translationCache.set(cacheKey, translations)
  return translations
}

app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLocales } = req.body ?? {}

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Missing text payload' })
    }

    const locales = Array.isArray(targetLocales) && targetLocales.length
      ? targetLocales
      : Object.keys(defaultTranslationMap)

    const translations = await translateWithDeepL(text, locales)

    return res.json({ translations })
  } catch (error) {
    console.error('Translation API error:', error)
    return res.status(500).json({ message: 'Translation failed' })
  }
})

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'Backend is running' })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
