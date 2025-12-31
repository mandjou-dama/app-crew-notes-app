# React Native Notes App (Supabase)

## Project Overview

This project is a React Native mobile application built as a technical assignment. It provides a secure, user-isolated note-taking environment where users can sign up, log in, manage their notes, and synchronize data with a Supabase backend.

The application demonstrates production-grade architectural patterns, including strict type safety, separation of concerns (Auth/App stacks), secure authentication state management, and robust error handling. It focuses on correctness, security, and stability rather than visual styling.

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Backend / Auth**: Supabase
- **Server State Management**: TanStack React Query
- **Client State Management**: Zustand
- **Storage**: react-native-mmkv (for secure session persistence)
- **Navigation**: React Navigation (Native Stack)
- **Input**: react-native-enriched, react-native-keyboard-controller

## Project Setup

### Prerequisites

- Node.js (LTS recommended)
- package manager (pnpm recommended)
- iOS Simulator (Mac only) or Android Emulator / Device

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd app-crew-notes-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```
   _Note: Never include service role keys in the client application._

## Supabase Configuration

### Database Schema

The application requires a `notes` table with the following schema:

- `id` (uuid, primary key)
- `title` (text)
- `content` (text)
- `user_id` (uuid, references auth.users)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Security (RLS)

Row Level Security (RLS) is enabled on the `notes` table. Access is strictly limited to the data owner.

**Policies:**

1.  **SELECT**: Users can only read rows where `auth.uid() = user_id`.
2.  **INSERT**: Users can only insert rows where `auth.uid() = user_id`.
3.  **UPDATE**: Users can only update rows where `auth.uid() = user_id`.
4.  **DELETE**: Users can only delete rows where `auth.uid() = user_id`.

No cross-user data access is possible at the database level.

## Authentication Flow

- **Method**: Email and Password (Supabase Auth).
- **Persistence**: Sessions are persisted securely using `MMKV` via a custom Supabase storage adapter.
- **State Management**:
  - `Zustand` mirrors the current auth state (Session/User) to drive UI logic.
  - A singleton auth bucket (`auth.store.ts`) ensures the UI reflects the backend state instantly.
  - The app determines the initial navigation stack (Auth vs App) using a hydration check to prevent login flicker.

## Notes CRUD Flow

- **Create**: Uses `useCreateNote` mutation. Invalidates list cache on success.
- **Read**: Uses `useNotes` query. Fetches data respecting RLS policies.
- **Update**: Uses `useUpdateNote` mutation. Updates title and/or content.
- **Delete**: Uses `useDeleteNote` mutation. Requires user confirmation.

All data interactions occur directly with Supabase, secured by the anonymous key and user JWT tokens.

## Offline Handling

The application implements a "Graceful Offline" strategy:

- **Safety**: The app does not crash if network requests fail.
- **Feedback**: Specialized error UI indicates when notes cannot be loaded due to connectivity issues.
- **Retry**: Users can manually retry failed queries via UI actions.
- **Persistence**: Auth sessions survive app restarts even without network.

## Search Functionality

- Client-side search filters notes by title/content.
- Case-insensitive and real-time as the user types.

## Running the App

1. Start the development server:

   ```bash
   pnpm start
   ```

2. Run on Android:

   ```bash
   pnpm android
   ```

3. Run on iOS:
   ```bash
   pnpm ios
   ```

## Assumptions & Trade-offs

- **Minimal UI**: The visual design is intentionally minimal to prioritize architectural correctness and logic.
- **No Local Note Caching**: The app relies on React Query's in-memory cache and Supabase as the source of truth. Robust offline _creation/editing_ (queueing system) was out of scope for this iteration.
- **Strict Separation**: Logic is strictly separated from UI components to ensure testability and maintainability.

## Security Notes

- **RLS Enforced**: Security is not handled by the frontend filters; it is enforced by potential database policies.
- **No Service Keys**: The client only contains the `SUPABASE_ANON_KEY`.
- **User Isolation**: Notes are strictly isolated by `user_id`.
