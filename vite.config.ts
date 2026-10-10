import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import { SUPPORTED_LOCALES, TASK_TRANSLATIONS, buildFallbackTranslations } from './src/utils/taskTranslations.js'

const translationProxyPlugin = (): PluginOption => ({
  name: 'translation-proxy',
  configureServer(server) {
    server.middlewares.use('/api/translate', (req, res, next) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.end(JSON.stringify({ message: 'Method not allowed' }))
        return
      }

      let body = ''

      req.on('data', (chunk) => {
        body += chunk.toString()
      })

      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}') as {
            text?: string
            targetLocales?: string[]
          }

          const text = payload.text ?? ''
          const targetLocales = (payload.targetLocales ?? SUPPORTED_LOCALES) as string[]

          const normalizedText = text.trim()
          const dictionaryMatches = Object.entries(TASK_TRANSLATIONS).find(
            ([key, translations]) =>
              key.toLowerCase() === normalizedText.toLowerCase() ||
              Object.values(translations ?? {}).some((value) => value?.toLowerCase() === normalizedText.toLowerCase()),
          )

          const translations = dictionaryMatches?.[1] ?? buildFallbackTranslations(text, targetLocales as typeof SUPPORTED_LOCALES)

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ translations }))
        } catch {
          res.statusCode = 400
          res.end(JSON.stringify({ message: 'Invalid translation payload' }))
        }
      })

      req.on('error', () => {
        res.statusCode = 500
        res.end(JSON.stringify({ message: 'Translation proxy failed' }))
      })

      next()
    })
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), translationProxyPlugin()],
})
