import { useEffect, useState } from 'react'
import i18n from '../i18n'
import type { Todo } from '../types'

const STORAGE_KEY = 'multi-lang-todo-app.todos'

const createSampleTodo = (): Todo => ({
  id: Date.now() + Math.random(),
  text: i18n.t('demoTask'),
  completed: false,
  isSample: true,
})

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const storedTodos = window.localStorage.getItem(STORAGE_KEY)

      if (!storedTodos) {
        return [createSampleTodo()]
      }

      return JSON.parse(storedTodos) as Todo[]
    } catch {
      return [createSampleTodo()]
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const syncSampleTodo = (text: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.isSample ? { ...todo, text } : todo,
      ),
    )
  }

  const addTodo = (text: string) => {
    const trimmed = text.trim()

    if (!trimmed) {
      return
    }

    setTodos((currentTodos) => {
      const alreadyExists = currentTodos.some(
        (todo) => todo.text.trim().toLowerCase() === trimmed.toLowerCase(),
      )

      if (alreadyExists) {
        return currentTodos
      }

      return [
        {
          id: Date.now() + Math.random(),
          text: trimmed,
          completed: false,
        },
        ...currentTodos,
      ]
    })
  }

  const deleteTodo = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const editTodo = (id: number, text: string) => {
    const trimmed = text.trim()

    if (!trimmed) {
      return
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo,
      ),
    )
  }

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    syncSampleTodo,
  }
}
