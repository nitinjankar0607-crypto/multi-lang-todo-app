import { useState } from 'react'

type InputFieldProps = {
  placeholder: string
  buttonText: string
  onAddTodo: (value: string) => void
  darkMode?: boolean
}

function InputField({ placeholder, buttonText, onAddTodo, darkMode = false }: InputFieldProps) {
  const [value, setValue] = useState('')

  const handleAddTodo = () => {
    const nextValue = value.trim()
    if (!nextValue) return
    onAddTodo(nextValue)
    setValue('')
  }

  const isAddDisabled = value.trim().length === 0

  return (
    <form
      className="mt-4 flex items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (isAddDisabled) return
        handleAddTodo()
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`flex-1 rounded-md border px-3 py-3 shadow-sm outline-none transition focus:ring-2 ${
          darkMode
            ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:ring-blue-400'
            : 'border-gray-200 bg-white text-slate-900 placeholder:text-slate-500 focus:ring-blue-400'
        }`}
      />
      <button
        type="submit"
        disabled={isAddDisabled}
        className={`shrink-0 rounded-md px-4 py-3 text-white transition ${
          isAddDisabled
            ? darkMode
              ? 'cursor-not-allowed bg-slate-600 opacity-60'
              : 'cursor-not-allowed bg-gray-400 opacity-60'
            : darkMode
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {buttonText}
      </button>
    </form>
  )
}

export default InputField
