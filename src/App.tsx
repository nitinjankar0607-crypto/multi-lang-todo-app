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
type FilterMode = 'all' | 'active' | 'completed'

const DEFAULT_THEME: ThemeMode = 'light'
const PAGE_SIZE_OPTIONS = [5, 10, 20, 30]

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
      return DEFAULT_THEME
    }

    const storedTheme = window.localStorage.getItem('multi-lang-todo-app.theme')
    return storedTheme === 'dark' ? 'dark' : DEFAULT_THEME
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return 10
    }

    const storedPageSize = Number(window.localStorage.getItem('multi-lang-todo-app.pageSize'))
    return PAGE_SIZE_OPTIONS.includes(storedPageSize) ? storedPageSize : 10
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterMode>('all')

  useEffect(() => {
    window.localStorage.setItem('multi-lang-todo-app.language', language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem('multi-lang-todo-app.theme', theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('multi-lang-todo-app.pageSize', String(pageSize))
  }, [pageSize])

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
      (todo) => todo.isSample && (todo.translations?.[language] ?? todo.text) !== nextSampleText,
    )

    if (needsSampleRefresh) {
      syncSampleTodo(nextSampleText, language)
    }
  }, [language, syncSampleTodo, t, todos])

  useEffect(() => {
    setPage(1)
  }, [language, searchTerm, filter])

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredTodos = todos.filter((todo) => {
    const todoText = todo.translations?.[language] ?? todo.text
    const matchesSearch =
      normalizedSearchTerm.length === 0 || todoText.toLowerCase().includes(normalizedSearchTerm)

    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed)

    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredTodos.length / pageSize))
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [filteredTodos.length, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginatedTodos = filteredTodos.slice((safePage - 1) * pageSize, safePage * pageSize)
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
            onAddTodo={(value) => addTodo(value, language)}
            darkMode={isDarkTheme}
          />

          <TodoList
            todos={paginatedTodos}
            language={language}
            totalItems={filteredTodos.length}
            page={safePage}
            pageSize={pageSize}
            totalPages={totalPages}
            searchValue={searchTerm}
            filterValue={filter}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilter}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize)
              setPage(1)
            }}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={(id, value) => editTodo(id, value, language)}
            emptyText={t('emptyState')}
            searchPlaceholder={t('searchPlaceholder')}
            filterAllLabel={t('filterAll')}
            filterActiveLabel={t('filterActive')}
            filterCompletedLabel={t('filterCompleted')}
            pageLabel={t('page')}
            ofLabel={t('of')}
            prevLabel={t('prev')}
            nextLabel={t('next')}
            rowsLabel={t('rows')}
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
