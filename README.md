# FESBhub

FESBhub is a full-stack web application for student community content at FESB, with:

- News/posts with moderation flow
- Professor and subject browsing with comments/ratings
- Materials folder tree and files
- JWT auth with refresh token cookies
- Email verification flow

This repository contains NestJS backend and React + Vite frontend.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, React Router, Axios
- Backend: NestJS 11, TypeScript, Prisma, PostgreSQL, JWT, Argon2, Nodemailer
- Database: PostgreSQL 17 (Docker compose provided)

## Quick Start

### 1. Start PostgreSQL

From `be/`:

```bash
docker compose up -d
```

The compose file exposes PostgreSQL on `localhost:5432` and expects `POSTGRES_PASSWORD` from environment.

### 2. Configure backend environment

Create `be/.env`:

```env
# App
PORT=3000
JWT_SECRET=replace_me
HASHING_SECRET=replace_me

# Database
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/fesb_db

# SMTP (email verification)
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_user
EMAIL_PASS=your_password
EMAIL_FROM=no-reply@example.com

# Used by docker compose
POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD
```

### 3. Install and run backend

From `be/`:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Backend runs on `http://localhost:3000` by default.

### 4. Install and run frontend

From `fe/`:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Important Runtime Notes

- Backend CORS is configured for `http://localhost:5173`.
- Frontend API base URL is hardcoded to `http://localhost:3000` in service files.
- Auth uses short-lived access tokens and refresh token cookies.

## Backend Modules

Main modules registered in the Nest app:

- `auth`
- `user`
- `posts`
- `prof`
- `subj`
- `comment-prof`
- `comment-subj`
- `email`
- `mats` (materials/folders)
- `prisma`

### API Route Prefixes (high-level)

- `/auth`
- `/user`
- `/posts`
- `/prof`
- `/subj`
- `/comment-prof`
- `/comment-subj`
- `/email`
- `/mats`

## Frontend Routes

Defined app routes include:

- `/` (login)
- `/register`
- `/verify-email`
- `/news`
- `/material`
- `/subject` and `/subject/:subjectId`
- `/professor` and `/professor/:professorId`
- `/admin/settings`
- `/user/settings`

## Database (Prisma)

The schema includes core entities such as:

- `User`
- `Post` and `PostImage`
- `Professor`
- `Subject`
- `CommentOnProffessor`
- `CommentOnSubject`
- `Folder` and `File`
- `RefreshToken`
- `EmailVerificationToken`

Migrations are tracked in `be/prisma/migrations/`.

## Scripts

### Backend (`be/package.json`)

- `npm run start:dev` - start API in watch mode
- `npm run build` - build Nest app
- `npm run start:prod` - run built API
- `npm run test` - unit tests
- `npm run test:e2e` - end-to-end tests
- `npm run lint` - lint and autofix

### Frontend (`fe/package.json`)

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build
- `npm run preview` - preview production build
- `npm run lint` - lint frontend code

## Seeding

Seed script exists at `be/prisma/seed.ts`.

Current seed logic expects an existing admin user and then creates a nested materials folder tree. If you want to run seeding from a clean database, ensure an admin user exists first.


## Demo video

This link will lead you to Google Drive folder with demo of the app.

https://drive.google.com/drive/folders/15N94_KK3Lyu-yzB3U6uUFUiaRBrIxudN?usp=sharing

