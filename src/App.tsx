import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import InputField from './components/InputField'
import TodoList from './components/TodoList'
import { defaultLanguage, loadLanguage } from './i18n'
import { useTodos } from './hooks/useTodos'
import type { SupportedLocale } from './types'
import { LANGUAGES } from './types'

type ThemeMode = 'light' | 'dark'

function App() {
  const { t } = useTranslation()
  const { todos, addTodo, deleteTodo, toggleTodo, editTodo, syncSampleTodo } = useTodos()
  const [language, setLanguage] = useState<SupportedLocale>(() => {
    if (typeof window === 'undefined') {
      return defaultLanguage
    }

    const storedLanguage = window.localStorage.getItem('multi-lang-todo-app.language')

    if (storedLanguage && LANGUAGES.some((item) => item.code === storedLanguage)) {
      return storedLanguage as SupportedLocale
    }

    return defaultLanguage
  })
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const storedTheme = window.localStorage.getItem('multi-lang-todo-app.theme')
    return storedTheme === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    window.localStorage.setItem('multi-lang-todo-app.language', language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem('multi-lang-todo-app.theme', theme)
  }, [theme])

  useEffect(() => {
    void loadLanguage(language).catch((error) => {
      console.error('Failed to load language:', error)
    })
  }, [language])

  useEffect(() => {
    const nextTitle = t('title')
    document.title = nextTitle && nextTitle !== 'title' ? nextTitle : 'Todo App'
  }, [t])

  useEffect(() => {
    const nextSampleText = t('demoTask')
    const needsSampleRefresh = todos.some(
      (todo) => todo.isSample && todo.text !== nextSampleText,
    )

    if (needsSampleRefresh) {
      syncSampleTodo(nextSampleText)
    }
  }, [syncSampleTodo, t, todos])

  const isDarkTheme = theme === 'dark'

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-200 ${
        isDarkTheme ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-2xl">
        <Header
          language={language}
          languages={LANGUAGES}
          theme={theme}
          onLanguageChange={setLanguage}
          onThemeChange={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
        />

        <main
          className={`mt-6 rounded-lg border p-4 shadow-md transition-colors duration-200 ${
            isDarkTheme
              ? 'border-slate-700 bg-slate-800 shadow-slate-950/50'
              : 'border-slate-200 bg-white shadow-slate-200'
          }`}
        >
          <InputField
            placeholder={t('placeholder')}
            buttonText={t('add')}
            onAddTodo={addTodo}
            darkMode={isDarkTheme}
          />

          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            emptyText={t('emptyState')}
            editLabel={t('edit')}
            deleteLabel={t('delete')}
            saveLabel={t('save')}
            cancelLabel={t('cancel')}
            darkMode={isDarkTheme}
          />
        </main>
      </div>
    </div>
  )
}

export default App
