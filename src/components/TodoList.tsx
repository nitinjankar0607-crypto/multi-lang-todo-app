import type { Todo } from '../types'
import TodoItem from './TodoItem'

type TodoListProps = {
  todos: Todo[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
  onPageChange: (nextPage: number) => void
  onPageSizeChange: (nextPageSize: number) => void
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

const PAGE_SIZES = [5, 10, 20, 30]

function TodoList({
  todos,
  totalItems,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
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
  if (totalItems === 0) {
    return (
      <p className={`mt-4 text-lg ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
        {emptyText}
      </p>
    )
  }

  return (
    <>
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

      <div
        className={`mt-4 flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between ${
          darkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm font-medium">
            Rows
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className={`rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 ${
              darkMode
                ? 'border-slate-600 bg-slate-900 text-slate-100 focus:ring-sky-500'
                : 'border-slate-300 bg-white text-slate-800 focus:ring-sky-500'
            }`}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              page <= 1
                ? darkMode
                  ? 'cursor-not-allowed bg-slate-700 text-slate-500'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
                : darkMode
                  ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            Prev
          </button>

          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              page >= totalPages
                ? darkMode
                  ? 'cursor-not-allowed bg-slate-700 text-slate-500'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
                : darkMode
                  ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}

export default TodoList
