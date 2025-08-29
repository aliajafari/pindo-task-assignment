# Pindo Tree (Frontend Task)

A small React + Vite + TypeScript app that manages a simple file/folder tree with Redux Toolkit. State is persisted to `localStorage`.

---

## Stack

* **React 18** + **Vite**
* **TypeScript**
* **Redux Toolkit** (RTK)
* **CSS Modules** for styling

---

## Quick start

```bash
# install
npm i 

# dev
npm run dev # http://localhost:5173

# build
npm run build

# preview build
npm run preview
```

## Features

* Create folder/file (two-step for files: **name → extension**)
* Rename folder/file (modal, validated)
* Delete folder/file (confirm modal)
* **Case-insensitive uniqueness** (e.g., `Ali.txt` ≡ `ali.txt`; `Docs` ≡ `docs`)
* Persist state in `localStorage`

## AI usage (concise)

Used AI as a speed-up for boilerplate, TypeScript/RTK compatibility checks, and improving Redux implementation.  
Core data model and logic were designed and implemented by myself.

**Sample prompts**

* "Give me an example of persisting data in Redux Toolkit to localStorage"  
* "Tree data structure concept in JavaScript"  
* "Generate a clean README.md"

---