# VALUE STOCKE – Hosting Ready

This project is pre-configured for **Vercel** and **Netlify**.

## Quick Deploy – Vercel (Recommended)
1) Create an account at vercel.com and install **Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel login
   ```
2) From this folder, run:
   ```bash
   vercel
   # then deploy production:
   vercel --prod
   ```
Vercel will auto-detect Next.js and build with `npm run build`.

## Quick Deploy – Netlify
1) Create an account at netlify.com.
2) From the dashboard, click **Add new site > Import an existing project** and connect the repo,
   or use the Netlify CLI:
   ```bash
   npm i -g netlify-cli
   netlify login
   netlify init
   netlify deploy --build --prod
   ```
The included `netlify.toml` uses `@netlify/plugin-nextjs`.

## Local Development
```bash
npm install
npm run dev
# open http://localhost:3000
```

> Note: If your runtime needs env variables (auth, DB, etc.), set them in the provider dashboard (Vercel/Netlify) before deploying.
