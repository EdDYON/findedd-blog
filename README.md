# Doorway

A private mobile-first entry built with Next.js. The public `/` route renders only the key gate. The protected `/void` route renders the private experience only after the server verifies an HttpOnly access cookie.

## Setup

Generate hashes for both keys:

```bash
node scripts/hash-key.mjs "your owner key"
node scripts/hash-key.mjs "her key"
```

Add the results to `.env.local` or Vercel environment variables:

```bash
OWNER_KEY_HASH=scrypt.salt.hash
HER_KEY_HASH=scrypt.salt.hash
ACCESS_COOKIE_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_SITE_URL=https://findedd.cn
```

`OWNER_KEY_HASH` unlocks owner mode. `HER_KEY_HASH` unlocks the normal private experience. The real keys are never shipped to the browser.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
