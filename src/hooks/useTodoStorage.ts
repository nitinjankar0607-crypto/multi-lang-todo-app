import { useCallback, useEffect, useState } from 'react'
import i18n from '../i18n'
import type { SupportedLocale, Todo } from '../types'
import { buildTaskTranslations, getCanonicalTaskKey, normalizeTaskText, TASK_TRANSLATIONS } from '../utils/taskTranslations'

const STORAGE_KEY = 'multi-lang-todo-app.todos'

const migrateStoredTodo = (todo: Todo): Todo => {
  if (todo.translations) {
    return todo
  }

  const canonicalKey = getCanonicalTaskKey(todo.text)
  const translations = TASK_TRANSLATIONS[canonicalKey] ?? {
    en_US: todo.text,
  }

  return {
    ...todo,
    text: translations.en_US ?? todo.text,
    translations,
  }
}

const createSampleTodo = (language: SupportedLocale): Todo => ({
  id: Date.now() + Math.random(),
  text: i18n.t('demoTask'),
  completed: false,
  isSample: true,
  translations: {
    [language]: i18n.t('demoTask'),
  },
})

const resolveTodoText = (todo: Todo, language: SupportedLocale) =>
  todo.translations?.[language] ?? todo.translations?.en_US ?? todo.text

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const storedTodos = window.localStorage.getItem(STORAGE_KEY)

      if (!storedTodos) {
        return [createSampleTodo('en_US')]
      }

      const parsedTodos = JSON.parse(storedTodos) as Todo[]
      return parsedTodos.map((todo) => migrateStoredTodo(todo))
    } catch {
      return [createSampleTodo('en_US')]
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const syncSampleTodo = useCallback(async (text: string, language: SupportedLocale) => {
    const canonicalKey = getCanonicalTaskKey(text)
    const translationSet = await buildTaskTranslations(canonicalKey, language)

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.isSample
          ? {
              ...todo,
              text: translationSet[language] ?? text,
              translations: {
                ...(todo.translations ?? {}),
                ...translationSet,
              },
            }
          : todo,
      ),
    )
  }, [])

  const addTodo = useCallback(async (text: string, language: SupportedLocale) => {
    const trimmed = text.trim()

    if (!trimmed) {
      return
    }

    const canonicalKey = getCanonicalTaskKey(trimmed)
    const translationSet = await buildTaskTranslations(canonicalKey, language)

    setTodos((currentTodos) => {
      const alreadyExists = currentTodos.some((todo) => {
        const displayText = resolveTodoText(todo, language)
        return normalizeTaskText(displayText) === normalizeTaskText(trimmed)
      })

      if (alreadyExists) {
        return currentTodos
      }

      return [
        {
          id: Date.now() + Math.random(),
          text: translationSet[language] ?? trimmed,
          completed: false,
          translations: translationSet,
        },
        ...currentTodos,
      ]
    })
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }, [])

  const toggleTodo = useCallback((id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  const editTodo = useCallback(async (id: number, text: string, language: SupportedLocale) => {
    const trimmed = text.trim()

    if (!trimmed) {
      return
    }

    const canonicalKey = getCanonicalTaskKey(trimmed)
    const translationSet = await buildTaskTranslations(canonicalKey, language)

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: translationSet[language] ?? trimmed,
              translations: {
                ...(todo.translations ?? {}),
                ...translationSet,
              },
            }
          : todo,
      ),
    )
  }, [])

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    syncSampleTodo,
    resolveTodoText,
  }
}

export default useTodos
