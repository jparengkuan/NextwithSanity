# Personal website

Portfolio and blog for Jim Parengkuan, built with [Next.js](https://nextjs.org/) and [Sanity](https://www.sanity.io/). The design is a dark, minimal portfolio: a home page with a short bio, a projects list, a blog, a contact form, and a resume link. All copy is edited in Sanity Studio.

| | URL |
|---|---|
| Website | https://jim-blog-wine.vercel.app |
| Studio (Sanity hosted) | https://jim-blog.sanity.studio |
| Studio (Vercel) | https://personalwebsite-six-bice.vercel.app |

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) in `frontend/`
- **Sanity Studio** in `studio/`, with live preview through the Presentation tool
- **DDEV** for local development: runs both apps as background daemons
- **Vercel** for hosting; `main` deploys automatically
- **Gmail SMTP** (via nodemailer) for the contact form, protected by a **reCAPTCHA Enterprise** checkbox

## Running locally

Requires [DDEV](https://ddev.com/) and Docker Desktop.

```shell
ddev start
```

That starts both apps:

- Website: https://website.ddev.site
- Studio: https://website.ddev.site:3333
- Mailpit (catches mail when SMTP isn't configured): https://website.ddev.site:8026

After changing `.env.local` or `.ddev/config*.yaml`, run `ddev restart`.

Without DDEV, `npm install` and `npm run dev` from the repo root start the site on http://localhost:3000 and the Studio on http://localhost:3333.

## Environment variables

Copy `frontend/.env.example` to `frontend/.env.local` and `studio/.env.example` to `studio/.env`. Both are git-ignored. Set the same frontend values in Vercel for production, then redeploy: Vercel only reads them at build time.

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity connection |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Links from the site to the Studio (visual editing) |
| `SANITY_API_READ_TOKEN` | Drafts and live preview |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Contact form mail. For Gmail: `smtp.gmail.com`, `465`, your address, and a [Google app password](https://myaccount.google.com/apppasswords) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA Enterprise key of the **checkbox** type |
| `RECAPTCHA_PROJECT_ID`, `RECAPTCHA_API_KEY` | Server-side check of the checkbox (Google Cloud project ID and an API key restricted to the reCAPTCHA Enterprise API) |

The reCAPTCHA check is skipped when its variables are missing, so local development works without Google credentials. The reCAPTCHA key's allowed domains must include each domain the site runs on (`website.ddev.site`, the Vercel domain).

## Editing content

Everything is in the Studio sidebar:

- **Pages**
  - **Home**: name, handle (shown on hover), tagline, bio (with links), socials
  - **Projects**, **Blogs**, **Contact**: the eyebrow, heading and intro at the top of each page; Contact also has the message shown after sending
  - **Other pages**: the starter's page-builder pages, served at `/<slug>`
- **Blogs**: blog posts. Set **External URL** to list an article hosted elsewhere; it then links out instead of getting a page here.
- **Projects**: shown on `/projects`, newest first by date
- **People**: post authors
- **Site Settings**: description and share image for SEO, the **Resume** PDF (adds a "Resume" link to the nav), and the contact form's **deliver to** address

Publish changes for them to appear on the live site. The browser tab title comes from the Name on Home.

## Project structure

```
frontend/
  app/
    (portfolio)/            Dark portfolio pages sharing one layout and portfolio.css
      page.tsx              Home
      projects/             Projects list (ProjectRow)
      blogs/                Blog list (BlogRow) and articles (blogs/[slug])
      contact/              Form, server action, validation, SMTP mailer, reCAPTCHA check
    (site)/                 Starter page-builder pages at /<slug>
    components/portfolio/   Shared pieces: nav, mobile menu, links, socials, rich text, page intro
  sanity/lib/queries.ts     GROQ queries (types generated into sanity.types.ts)
studio/
  src/schemaTypes/          Content model; fields.ts holds shared field helpers
  src/structure/index.ts    Sidebar layout
.ddev/config.website.yaml   Runs both dev servers inside DDEV
```

After changing the Studio schema or a query, regenerate the types:

```shell
npm run sanity:typegen --workspace=frontend
```

## Deploying

- **Website:** push to `main`; Vercel builds and deploys it. Old `/posts/<slug>` URLs redirect to `/blogs/<slug>`.
- **Studio on Vercel:** deploys from the same push.
- **Studio on sanity.studio:** run `npx sanity deploy` in `studio/`.

## Useful commands

| Command | What it does |
|---|---|
| `npm run lint` | ESLint for the frontend |
| `npm run type-check` | TypeScript checks for both workspaces |
| `npm run format` | Prettier over the repo |
| `npm run import-sample-data` | Imports the starter's sample content (replaces the dataset) |

Built on the [Sanity + Next.js clean template](https://github.com/sanity-io/sanity-template-nextjs-clean).
