# GEMINI Project Rules: Polling App

This document outlines the structure, conventions, and expectations for the Polling App project to ensure smooth collaboration with the Gemini AI assistant.

## Project Overview

The Polling App is a Next.js application that allows users to create, share, and vote on polls. It uses Supabase for user authentication and database storage.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components in `@/components` and `@/components/ui`
- **Authentication:** Supabase
- **Database:** Supabase

## Project Structure

```
.
├── app
│   ├── (auth)          # Authentication pages (login, signup)
│   ├── components      # Reusable components
│   ├── contexts        # React contexts (e.g., AuthContext)
│   ├── lib             # Library files (e.g., Supabase client)
│   ├── polls           # Poll-related pages
│   └── ...
├── public              # Static assets
└── ...
```

## Component Library

The project uses a combination of custom components located in `app/components` and UI components from a library in `app/components/ui`. When creating new components, please follow the existing structure and conventions.

## State Management

Application state is managed using React Context. The `AuthContext` in `app/contexts/AuthContext.tsx` is used to manage the user's session and provide user data to the application.

## Authentication

User authentication is handled by Supabase. The Supabase client is initialized in `app/lib/supabase.ts`. The login and signup pages in `app/(auth)` use the Supabase client to authenticate users.

Protected routes are handled using the `withAuth` Higher-Order Component (HOC) located in `app/components/withAuth.tsx`.

## Styling

Styling is done using Tailwind CSS. Please use the utility classes provided by Tailwind CSS and follow the existing styling conventions.

## Linting and Formatting

Please adhere to the ESLint and Prettier rules configured for the project.

## Commit Conventions

Please follow the Conventional Commits specification for commit messages. For example:

- `feat: Add new feature`
- `fix: Fix a bug`
- `docs: Update documentation`
- `style: Make styling changes`
- `refactor: Refactor code`
- `test: Add or update tests`
- `chore: Update build process or dependencies`
