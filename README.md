# TechChat

A WhatsApp-style real-time chat app built as a learning/portfolio project. The UI and core flow are inspired by WhatsApp; the backend runs on Firebase.

## What it does

- **Google sign-in** — authenticate with Firebase Auth
- **Public rooms** — create, join, and delete chat rooms
- **Real-time messaging** — text messages synced via Firestore
- **Media** — send images (with preview + compression) and voice notes
- **Search** — find users or rooms by exact name
- **Responsive layout** — sidebar + chat on desktop, mobile-friendly navigation

## Tech stack

- React 17
- React Router
- Material UI
- Firebase (Auth, Firestore, Storage)
- Netlify (hosting)

## Run locally

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example and add your Firebase web app config:

```bash
cp .env.example .env
```

Get values from **Firebase Console → Project settings → Your apps → Web app**.

3. In Firebase, enable **Google Auth**, **Firestore**, and **Storage** (Blaze plan required for Storage). Set security rules for authenticated users.

4. Start the dev server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** This project uses `react-scripts` 4 with Node 18+. The start script includes `NODE_OPTIONS=--openssl-legacy-provider` for compatibility.

## Deploy (Netlify)

The app is deployed on Netlify. Pushes to the connected branch trigger a new build.

Add the same `REACT_APP_*` environment variables in **Netlify → Site settings → Environment variables** so the production build can reach your Firebase project.

## Project structure

```
src/
  components/   # UI (Chat, Sidebar, Login, etc.)
  hooks/        # Firestore & auth hooks
  utils/        # Avatars, image preview, time formatting
  firebase.js   # Firebase initialization
```

## About this project

This started from an open-source WhatsApp clone tutorial and was extended with my own Firebase project, auth/storage fixes, image upload improvements, and UI polish. It is a clone used to demonstrate full-stack React + Firebase skills, not a production messaging product.
