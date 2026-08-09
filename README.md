# Vault — a private password manager

A simple web app for storing logins: owner, name, password, notes. Each person who signs in only ever sees their own entries. Works in any browser, on your iPhone or your computer.

**Note on security:** you chose the simpler option — Supabase login only, no extra client-side encryption. That means passwords sit in the database as plain text, protected by Supabase's own encryption-at-rest and by the login wall (Row Level Security, set up below, makes sure no one but you can query your rows even through the API). It's private, but it's not zero-knowledge — anyone with admin access to your Supabase project could read the table directly. That's the trade-off for simplicity.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account/project.
2. Once it's created, open **SQL Editor** in the left sidebar, paste in the contents of `supabase_schema.sql` (included in this project), and click **Run**. This creates the `passwords` table and locks it down so users can only see their own rows.
3. Go to **Project Settings -> API**. You'll need two values from this page in a minute: the **Project URL** and the **anon public** key.
4. Still in Project Settings, under **Authentication -> Providers**, email/password sign-in is on by default — nothing to change there.
5. Optional but recommended: under **Authentication -> Settings**, turn off "Confirm email" if you don't want to deal with confirmation emails for an account only you'll use.

## 2. Run it locally first (optional but a good check)

You'll need [Node.js](https://nodejs.org) installed.

```bash
cd password-vault
npm install
cp .env.example .env
```

Open `.env` and paste in your Project URL and anon key from step 1.3:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then:

```bash
npm run dev
```

Open the local address it prints, create your account, and confirm you can add an entry.

## 3. Put it on GitHub

```bash
cd password-vault
git init
git add .
git commit -m "Initial vault app"
```

Create a new empty repository on [github.com](https://github.com/new) (keep it **private** — no need for anyone else to see this code), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

Your `.env` file is excluded automatically (see `.gitignore`), so your keys never get pushed. That's fine — the anon key is meant to be public-facing anyway (Row Level Security is what actually protects your data), but there's no reason to publish it.

## 4. Deploy so it's live on your iPhone and computer

The easiest option is [Vercel](https://vercel.com) (free for this kind of use):

1. Sign in to Vercel with your GitHub account.
2. Click **Add New -> Project**, and pick the repo you just pushed.
3. It will auto-detect Vite. Before deploying, open **Environment Variables** and add the same two values from your `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**. In about a minute you'll get a live URL like `vault-yourname.vercel.app`.

## 5. Add it to your iPhone home screen

1. Open your Vercel URL in **Safari** on your iPhone.
2. Tap the **Share** icon, then **Add to Home Screen**.
3. It'll sit on your home screen with an icon like a normal app, and open full-screen without Safari's address bar.

On your computer, just bookmark the same URL.

## Using it

- Sign up once (email + password) — that's the only account with access.
- **Add entry** to store a new login: owner, name, password, and optional notes.
- Passwords are hidden by default — tap **Show** to reveal, **Copy** to copy.
- **Search** filters by name, owner, or notes.
- **Edit** and **Delete** are on each entry.
