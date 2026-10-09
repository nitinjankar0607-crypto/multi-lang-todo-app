# Multi Language Todo App

A responsive React + TypeScript + Vite todo application with dynamic language switching, local persistence, theme toggle, and polished UI styling.

## Features

- Add, edit, delete, and complete todo items
- Multi-language interface with English, French, German, Japanese, Spanish, and Arabic
- Selected language saved in localStorage across refreshes
- Light/dark background toggle with matching header and form styles
- Responsive layout for desktop and smaller screens
- Todo items persisted in localStorage
- Browser document title and custom favicon updated for the app
- Empty submissions, duplicate entries, and unchanged edits are prevented

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- i18next / react-i18next

## Project Structure

```bash
src/
  App.tsx
  components/
    Header.tsx
    InputField.tsx
    TodoItem.tsx
    TodoList.tsx
  hooks/
    useTodos.ts
  i18n.ts
  types.ts
public/
  favicon.svg
  locales/
    en_US_translation.json
    fr_FR_translation.json
    de_DE_translation.json
    ja_JP_translation.json
    es_CO_translation.json
    ar_AR_translation.json
```

## Getting Started

```bash
pnpm install
pnpm run dev
```

## Production Build

```bash
pnpm run build
```

## Notes

- LocalStorage is used to persist both the selected language and the theme mode.
- Translation files are loaded dynamically from the public/locales directory.
- The interface keeps the layout compact and aligned to match the provided mockup design.
- Empty fields and duplicate entries are ignored to keep the todo list clean.
