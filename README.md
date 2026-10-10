# Multi Language Todo App

A responsive multilingual todo app built with React, TypeScript, and Vite. It supports UI localization, persisted user preferences, todo translation handling, task filtering, pagination, and a backend translation proxy for missing phrase fallback.

## Features

- Add, edit, delete, and complete todo items
- Multi-language interface with English, French, German, Japanese, Spanish, and Arabic
- Language, theme, page size, and todo data persisted in localStorage
- Translation-aware task storage so todo text remains consistent across locale changes
- Search and filter by all, active, and completed tasks
- Pagination with configurable page size
- Responsive layout for desktop and smaller screens
- Empty submissions, duplicates, and invalid edits are prevented
- Translation fallback via a local backend proxy for missing phrases
- Secure env handling with `.env` ignored in git and `.env.example` used as template

## Tech Stack

- React 19
- TypeScript
- Vite
- Node.js
- Express
- i18next / react-i18next
- DeepL API translation support through a backend proxy
- pnpm

## Project Structure

```bash
.
├── public/
│   ├── locales/
│   │   ├── en_US_translation.json
│   │   ├── fr_FR_translation.json
│   │   ├── de_DE_translation.json
│   │   ├── ja_JP_translation.json
│   │   ├── es_CO_translation.json
│   │   └── ar_AR_translation.json
│   └── favicon.svg
├── server/
│   └── index.js
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── InputField.tsx
│   │   ├── TodoItem.tsx
│   │   └── TodoList.tsx
│   ├── hooks/
│   │   ├── useTodos.ts
│   │   └── useTodoStorage.ts
│   ├── i18n.ts
│   ├── types.ts
│   └── utils/
│       └── taskTranslations.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── eslint.config.js
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start the frontend:

```bash
pnpm run dev --host 0.0.0.0 --port 5175
```

3. Start the translation backend:

```bash
cd server
node index.js
```

4. Copy the example env file and add your own local DeepL key if needed:

```bash
copy .env.example .env
```

Important: do not commit the real `.env` file to GitHub. Keep it local only.

## Production Build

```bash
pnpm run build
```

## Notes

- The selected language is stored in localStorage and reloaded after refresh.
- Theme and page size preferences are also persisted.
- Translation files are loaded dynamically from the public locale folder.
- Task text translation is cached to avoid repeated API calls and rate-limit issues.
- The backend proxy protects the frontend from exposing the DeepL API key directly in the browser.
- The project is configured to ignore `.env` files from git for security.
