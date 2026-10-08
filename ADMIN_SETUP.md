# Mahamaya Admin Publishing Setup

The website now has a real committee admin panel with persistent publishing through GitHub and Cloudflare Pages.

## Cloudflare Pages variables

In the Cloudflare Pages project, open **Settings → Variables and Secrets** and add these as **Production** secrets:

- `ADMIN_EMAIL` — the committee admin login email.
- `ADMIN_PASSWORD` — a strong password chosen by the committee.
- `SESSION_SECRET` — a long random secret, at least 32 characters.
- `GITHUB_TOKEN` — a GitHub fine-grained personal access token with **Contents: Read and write** access only to `exearpan45/MAHAMAYA`.
- `ADMIN_NAME` — optional display name, for example `MAHAMAYA Committee Admin`.

Optional variables, only if the repository changes:
- `GITHUB_OWNER` = `exearpan45`
- `GITHUB_REPO` = `MAHAMAYA`
- `GITHUB_BRANCH` = `main`

Never put the GitHub token or admin password in frontend code, GitHub source files, or chat messages.

## Publishing flow

1. Admin signs in at `#/admin`.
2. Admin edits Puja years, dates, events, Bhog, notices, gallery, history, cultural programs, site settings, and editable website copy.
3. **Publish Changes** sends the complete content snapshot to a Cloudflare Pages Function.
4. The Function verifies the HttpOnly admin session.
5. The Function writes the content JSON and new gallery/deity images to the GitHub repository in a single Git commit.
6. Cloudflare Pages detects the GitHub commit and rebuilds the website.
7. The new content becomes the public website content.

No D1, R2, OpenAI API, or paid API is required.

## Important

The admin password is only an access gate for this website-management console. Do not reuse an important personal password.

Gallery images should be kept below 6 MB each. The browser converts new uploads to data before publishing; the Cloudflare Function stores them under `public/uploads/`.
