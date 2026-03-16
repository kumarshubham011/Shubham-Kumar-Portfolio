# 🌿 Minimal Portfolio — Static Website

This repo now ships a static version of the portfolio in `static-site/` to eliminate backend cold starts and improve first-load speed.

## Why static
- No Python runtime needed for production.
- No server cold start.
- CDN edge delivery for faster global loading.
- Easy content updates via JSON files.

## What is included
- Multi-page site: Home, About, Projects, Blog, Post detail, Contact.
- Focus Mode (`Shift + F`) with localStorage persistence.
- Mobile navigation.
- Projects filtering and blog searching.
- JSON-based content source.

## Project structure

```text
static-site/
├── index.html
├── about.html
├── projects.html
├── blog.html
├── post.html
├── contact.html
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── main.js
│       └── site-data.js
└── data/
    ├── projects.json
    └── posts.json
```

## Update content
- Projects: `static-site/data/projects.json`
- Blog posts: `static-site/data/posts.json`

## Local preview
```bash
cd static-site
python3 -m http.server 8080
# open http://localhost:8080
```

---

## Recommended free deployment

### ✅ Cloudflare Pages (best free + fast option)
Cloudflare Pages is recommended because it is free for this use case, globally cached, and has no cold start.

### Step-by-step deployment guide

1. Push your branch to GitHub:
   ```bash
   git push -u origin <your-branch>
   ```
2. Open Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages**.
3. Choose **Connect to Git** and select your GitHub repo.
4. Configure build settings:
   - Framework preset: `None`
   - Build command: *(leave empty)*
   - Build output directory: `static-site`
5. Click **Save and Deploy**.
6. After deploy completes, open your `*.pages.dev` URL.
7. (Optional) Add custom domain in Pages project → **Custom domains**.

### Recommended production settings
- Enable Cloudflare caching defaults (already on for static assets).
- Keep asset paths relative (already done) so previews and production both work.
- Add a custom domain for better branding.

---

## Notes
If you want admin editing while staying static, the next step is adding a Git-based CMS (like Decap CMS) that writes to JSON/Markdown and triggers auto-deploy.
