import type { Todo } from '../types'
import TodoItem from './TodoItem'

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, text: string) => void
  emptyText: string
  editLabel: string
  deleteLabel: string
  saveLabel: string
  cancelLabel: string
  darkMode?: boolean
}

function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  emptyText,
  editLabel,
  deleteLabel,
  saveLabel,
  cancelLabel,
  darkMode = false,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className={`mt-4 text-lg ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
        {emptyText}
      </p>
    )
  }

  return (
    <ul
      className={`mt-4 divide-y rounded-md shadow ${
        darkMode ? 'divide-slate-700 bg-slate-800 shadow-slate-950/50' : 'divide-gray-200 bg-white shadow-slate-200'
      }`}
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          editLabel={editLabel}
          deleteLabel={deleteLabel}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
          darkMode={darkMode}
        />
      ))}
    </ul>
  )
}

export default TodoList
