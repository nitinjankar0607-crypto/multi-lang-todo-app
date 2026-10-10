import { useEffect, useState } from 'react'
import type { SupportedLocale, Todo } from '../types'

type TodoItemProps = {
  todo: Todo
  language: SupportedLocale
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, text: string, language: SupportedLocale) => void
  editLabel: string
  deleteLabel: string
  saveLabel: string
  cancelLabel: string
  darkMode?: boolean
}

function TodoItem({
  todo,
  language,
  onToggle,
  onDelete,
  onEdit,
  editLabel,
  deleteLabel,
  saveLabel,
  cancelLabel,
  darkMode = false,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const displayText = todo.translations?.[language] ?? todo.text
  const [draft, setDraft] = useState(displayText)

  useEffect(() => {
    setDraft(displayText)
  }, [displayText])

  const handleSave = () => {
    const trimmedDraft = draft.trim()

    if (!trimmedDraft || trimmedDraft === displayText) {
      return
    }

    onEdit(todo.id, trimmedDraft, language)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(displayText)
    setIsEditing(false)
  }

  const toggleLabel = `${todo.completed ? 'Mark as incomplete' : 'Mark as complete'}: ${displayText}`

  return (
    <li
      className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${
        todo.completed
          ? darkMode
            ? 'text-slate-500 line-through'
            : 'text-gray-400 line-through'
          : darkMode
            ? 'text-slate-100'
            : 'text-black'
      } ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={toggleLabel}
          className="h-4 w-4 shrink-0"
        />

        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleSave()
                }

                if (event.key === 'Escape') {
                  event.preventDefault()
                  handleCancel()
                }
              }}
              aria-label={editLabel}
              className={`flex-1 rounded-md border px-2 py-1.5 text-sm ${
                darkMode
                  ? 'border-slate-600 bg-slate-800 text-slate-100'
                  : 'border-gray-200 bg-white text-slate-900'
              }`}
            />
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-blue-700 px-2.5 py-1.5 text-sm text-white shadow-sm hover:bg-blue-800"
            >
              {saveLabel}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`rounded-md px-2.5 py-1.5 text-sm shadow-sm ${
                darkMode
                  ? 'bg-slate-600 text-slate-100 hover:bg-slate-500'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              {cancelLabel}
            </button>
          </div>
        ) : (
          <span className="text-left text-sm sm:text-base">{displayText}</span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`rounded-md px-2.5 py-1.5 text-sm shadow-sm ${
              darkMode
                ? 'bg-slate-600 text-slate-100 hover:bg-slate-500'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
            }`}
          >
            {editLabel}
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            className="rounded-md bg-red-500 px-2.5 py-1.5 text-sm text-white shadow-sm hover:bg-red-600"
          >
            {deleteLabel}
          </button>
        </div>
      )}
    </li>
  )
}

export default TodoItem
