import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { LanguageOption, SupportedLocale } from '../types'

type HeaderProps = {
  language: SupportedLocale
  languages: LanguageOption[]
  theme: 'light' | 'dark'
  onLanguageChange: (language: SupportedLocale) => void
  onThemeChange: () => void
}

function Header({ language, languages, theme, onLanguageChange, onThemeChange }: HeaderProps) {
  const { t } = useTranslation()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(event.target.value as SupportedLocale)
  }

  const isDarkTheme = theme === 'dark'

  return (
    <header
      className={`flex items-center justify-between gap-3 rounded-t-lg px-4 py-3 shadow-md transition-colors duration-200 sm:px-6 ${
        isDarkTheme ? 'bg-sky-700 text-slate-100' : 'bg-blue-600 text-white'
      }`}
    >
      <h2 className="text-xl font-bold sm:text-2xl">{t('title')}</h2>

      <div className="flex items-center justify-end gap-3 flex-wrap">
        <label className="flex items-center gap-2 text-sm font-medium">
          <span className="whitespace-nowrap">{t('language')}</span>
          <select
            value={language}
            onChange={handleChange}
            className={`rounded-md px-3 py-1 shadow-sm outline-none ${
              isDarkTheme ? 'bg-slate-800 text-slate-100' : 'bg-white text-black'
            }`}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          onClick={onThemeChange}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xl shadow-sm transition ${
            isDarkTheme ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700' : 'bg-white/15 text-white hover:bg-white/25'
          }`}
        >
          {theme === 'light' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

export default Header
