import type { SupportedLocale, Todo } from '../types'
import TodoItem from './TodoItem'

type FilterMode = 'all' | 'active' | 'completed'

type TodoListProps = {
  todos: Todo[]
  language: SupportedLocale
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
  searchValue: string
  filterValue: FilterMode
  onSearchChange: (nextValue: string) => void
  onFilterChange: (nextFilter: FilterMode) => void
  onPageChange: (nextPage: number) => void
  onPageSizeChange: (nextPageSize: number) => void
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, text: string, language: SupportedLocale) => void
  emptyText: string
  searchPlaceholder: string
  filterAllLabel: string
  filterActiveLabel: string
  filterCompletedLabel: string
  pageLabel: string
  ofLabel: string
  prevLabel: string
  nextLabel: string
  rowsLabel: string
  editLabel: string
  deleteLabel: string
  saveLabel: string
  cancelLabel: string
  darkMode?: boolean
}

const PAGE_SIZES = [5, 10, 20, 30]

function TodoList({
  todos,
  language,
  totalItems,
  page,
  pageSize,
  totalPages,
  searchValue,
  filterValue,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onToggle,
  onDelete,
  onEdit,
  emptyText,
  searchPlaceholder,
  filterAllLabel,
  filterActiveLabel,
  filterCompletedLabel,
  pageLabel,
  ofLabel,
  prevLabel,
  nextLabel,
  rowsLabel,
  editLabel,
  deleteLabel,
  saveLabel,
  cancelLabel,
  darkMode = false,
}: TodoListProps) {
  if (totalItems === 0) {
    return (
      <div className="mt-4">
        <div
          className={`mb-4 flex flex-col gap-2 rounded-md border p-2 sm:flex-row ${
            darkMode
              ? 'border-slate-700 bg-slate-800'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className={`flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              darkMode
                ? 'border-slate-600 bg-slate-900 text-slate-100 placeholder:text-slate-400 focus:ring-sky-500'
                : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:ring-sky-500'
            }`}
          />

          <select
            value={filterValue}
            onChange={(event) => onFilterChange(event.target.value as FilterMode)}
            className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              darkMode
                ? 'border-slate-600 bg-slate-900 text-slate-100 focus:ring-sky-500'
                : 'border-slate-300 bg-white text-slate-800 focus:ring-sky-500'
            }`}
          >
            <option value="all">{filterAllLabel}</option>
            <option value="active">{filterActiveLabel}</option>
            <option value="completed">{filterCompletedLabel}</option>
          </select>
        </div>

        <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{emptyText}</p>
      </div>
    )
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <>
      <div
        className={`mt-4 flex flex-col gap-2 rounded-md border p-2 sm:flex-row ${
          darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className={`flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
            darkMode
              ? 'border-slate-600 bg-slate-900 text-slate-100 placeholder:text-slate-400 focus:ring-sky-500'
              : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:ring-sky-500'
          }`}
        />

        <select
          value={filterValue}
          onChange={(event) => onFilterChange(event.target.value as FilterMode)}
          className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
            darkMode
              ? 'border-slate-600 bg-slate-900 text-slate-100 focus:ring-sky-500'
              : 'border-slate-300 bg-white text-slate-800 focus:ring-sky-500'
          }`}
        >
          <option value="all">{filterAllLabel}</option>
          <option value="active">{filterActiveLabel}</option>
          <option value="completed">{filterCompletedLabel}</option>
        </select>
      </div>

      <ul
        className={`mt-4 divide-y rounded-md shadow ${
          darkMode ? 'divide-slate-700 bg-slate-800 shadow-slate-950/50' : 'divide-gray-200 bg-white shadow-slate-200'
        }`}
      >
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            language={language}
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
            {rowsLabel}
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

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-end">
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
              {prevLabel}
            </button>

            <span className="text-sm font-medium whitespace-nowrap">
              {pageLabel} {page} {ofLabel} {totalPages}
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
              {nextLabel}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`h-8 min-w-8 rounded-md px-2 text-sm font-medium transition-colors ${
                  pageNumber === page
                    ? darkMode
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-500 text-white'
                    : darkMode
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default TodoList
