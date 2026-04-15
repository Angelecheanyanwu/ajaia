# Ajaia Docs

A lightweight, collaborative document editor inspired by Google Docs, built for fast-moving teams.

## Features

- **Rich-Text Editing**: Bold, Italic, Underline, Headings, and Lists.
- **Simulated Auth**: Instant account creation - just enter an email to start.
- **Document Sharing**: Share documents with teammates via email.
- **File Import**: Import `.txt` and `.md` files directly.
- **Auto-save**: Real-time content persistence.
- **Premium Design**: Modern, glassmorphic UI with responsive layouts.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, Lucide Icons.
- **Editor**: Tiptap Rich-Text Framework.
- **Backend**: Next.js API Routes, NextAuth.js (Beta).
- **Persistence**: Prisma ORM with SQLite.

## Setup Instructions

### Prerequisites
- Node.js >= 20.9.0
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. Set up environment variables:
   Create a `.env` file (if not present) and add:
   ```env
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET="your-secret-key"
   AUTH_URL="http://localhost:3000"
   ```

### Running Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

## Testing

Run the logic verification script:
```bash
npx ts-node lib/sharing.test.ts
```
(Or use your preferred test runner)
