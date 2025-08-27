# VALUE STOCKE — Final Build

This is the **final Next.js project** ready to deploy.
- Brand name: **VALUE STOCKE**
- Exact logo image with site name: `public/logo-value-stocke-withname.png`
- Colors: magenta (from logo) + black/white, no yellow
- AR/EN with `next-intl`
- Dark/Light theme toggle
- Professional icons and features section
- Hosting ready: `vercel.json` and `netlify.toml` included

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel
```bash
npm i -g vercel
vercel
vercel --prod
```

If you want `/` to open Arabic by default, add the rewrite in `vercel.json`:
```json
{
  "version": 2,
  "framework": "nextjs",
  "rewrites": [{ "source": "/", "destination": "/ar" }],
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```
