# Work Pulse

Work Pulse is a productivity web app for tracking work time and daily tasks. It provides authentication, clock in/out tracking, task management, and a simple productivity dashboard.

## Features

- Email/password authentication with Supabase
- User registration and login flow
- Clock in / clock out time tracking
- Task CRUD (create, read, update completion, delete)
- Profile API and active clock-in status API
- Route protection and auth redirects via Next.js middleware

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Radix UI
- **Auth:** Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Database ORM:** Drizzle ORM + Drizzle Kit
- **Database:** PostgreSQL
- **Validation:** Zod
- **Server Actions:** next-safe-action

## Project Structure

```text
app/
	(auth)/
		login/page.tsx
		register/page.tsx
	actions/
		auth.ts
		task.ts
		time-records.ts
	api/
		user/profile/route.ts
		time-records/status/route.ts
	home/page.tsx
	page.tsx
db/
	schema.ts
	migrations/
utils/supabase/
	client.ts
	middleware.ts
	server.ts
```

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm, pnpm, yarn, or bun
- PostgreSQL database
- Supabase project (for authentication)

## Environment Variables

Create a `.env.local` file at the project root:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Variable Notes

- `DATABASE_URL` is used by Drizzle and runtime DB access (`lib/db.ts`).
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used by Supabase client/server/middleware auth helpers.

## Local Development

1. Install dependencies:

	 ```bash
	 npm install
	 ```

2. Apply database schema/migrations:

	 ```bash
	 npm run push
	 ```

	 Or use generated migrations:

	 ```bash
	 npm run generate
	 npm run migrate
	 ```

3. Start the dev server:

	 ```bash
	 npm run dev
	 ```

4. Open:

	 ```text
	 http://localhost:3000
	 ```

## Available Scripts

- `npm run dev` — Start Next.js dev server (Turbopack)
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run generate` — Generate Drizzle migration files from schema
- `npm run migrate` — Run Drizzle migrations
- `npm run push` — Push schema changes directly to the DB

## Auth & Routing Behavior

Middleware (`middleware.ts`) handles session updates and route guards:

- Authenticated users visiting `/` are redirected to `/home`
- Authenticated users cannot access `/login` or `/register`
- Unauthenticated users are redirected to `/login` for protected routes

## Database Schema (Summary)

Defined in `db/schema.ts`:

- `profiles` (user account profile metadata)
- `tasks` (task items tied to a user)
- `check_ins` (clock-in/clock-out records)
- `user_role` enum (`user`, `admin`, `superadmin`)

## API Endpoints

- `GET /api/user/profile` — Returns authenticated user profile
- `GET /api/time-records/status` — Returns active clock-in status

## Notes

- Authentication is handled by Supabase Auth.
- App-side data access is implemented with Drizzle ORM and server actions.
- Toast notifications are powered by Sonner.
