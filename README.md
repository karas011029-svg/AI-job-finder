# AI Job Finder

A small [Next.js](https://nextjs.org) app for building a **candidate profile**, **manually adding job postings**, and running **Groq-powered match analysis** (score, apply / maybe / skip, matched and missing skills, and suggested resume keywords). Data is stored in **Supabase** (Postgres).

## Tech stack

- **Next.js** (App Router), **React**, **TypeScript**
- **Tailwind CSS** for UI
- **Supabase** for `profiles`, `jobs`, `job_matches`, and `saved_jobs` (see `supabase/schema.sql`)
- **Groq** (`groq-sdk`) for chat completions; client lives in `lib/groq.ts`

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A [Supabase](https://supabase.com/) project
- A [Groq](https://console.groq.com/) API key

## Environment variables

Create a **`.env.local`** file in the project root (Next.js loads it automatically). Do not commit real secrets.

| Variable | Required | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes* | API key from [Groq — API keys](https://console.groq.com/keys). The app will fail at startup if this is missing. |
| `GROQ_MODEL` | No | Model id (e.g. a Llama or Mixtral id from the Groq console). Defaults to `mixtral-8x7b-32768` in `lib/groq.ts`. |
| `SUPABASE_URL` | Yes | Your project URL from the Supabase dashboard. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Service role** key (server-only; bypasses RLS). Used in API routes via `lib/supabaseAdmin.ts`. |
| `NEXT_PUBLIC_APP_URL` | No | Public base URL for the app. Used in job pages; falls back to `http://localhost:3000` if unset. |

\*The Groq client is loaded when the module that uses it is evaluated; for local work you should set this before running the dev server.

## Database

1. In the Supabase SQL editor (or any Postgres client), run the statements in **`supabase/schema.sql`** to create the tables and constraints.

2. The app currently uses a fixed demo user id (`DEMO_USER_ID` in `lib/constants.ts`) instead of real authentication. All profile, matches, and saved-job rows are associated with that id.

## Local development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — run production build locally
- `npm run lint` — ESLint

## Main routes

- `/` — landing page
- `/profile` — edit your profile
- `/jobs` — list and add jobs; trigger AI analysis from a job card
- `/jobs/[id]` — job detail
- `/saved` — jobs you have saved, with status controls
- `/applications` — same underlying data with an applications-focused view and status

## API routes (summary)

- `GET` / `POST` **`/api/jobs`** — list jobs (with matches and saved state for the demo user); create a job
- `POST` **`/api/analyze-job`** — body: `{ "job_id": "<uuid>" }` — run Groq analysis and upsert `job_matches`
- **`/api/profile`**, **`/api/saved-jobs`**, **`/api/application-status`** — profile and application helpers

## Deploying

Set the same environment variables on your host (e.g. [Vercel](https://vercel.com)). For production, prefer the **public** Supabase URL and a **server-only** service role key; never expose the service role in client-side code (this project keeps it in server modules only).

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Supabase — JavaScript client](https://supabase.com/docs/reference/javascript/introduction)
- [Groq API quickstart](https://console.groq.com/docs/quickstart)
