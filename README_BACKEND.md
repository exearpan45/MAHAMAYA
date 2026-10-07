# MAHAMAYA Cloudflare backend setup

The website remains a Vite React app. Cloudflare Pages Functions under `functions/` provide same-origin API routes; D1 stores account/session metadata and shared site content; R2 stores uploaded image bytes. No external/paid API or AI service is used.

## Cloudflare setup

1. Create a D1 database named `mahamaya` and an R2 bucket named `mahamaya-gallery` in the same Cloudflare account as the Pages project.
2. Replace the placeholder `database_id` in `wrangler.toml` with the D1 database ID. Keep the `DB` and `GALLERY_BUCKET` binding names unchanged, or update the function environment types and bindings together.
3. Apply the schema with `npx wrangler d1 migrations apply mahamaya --remote` (after setting the real database ID). The initial temple content is inserted once by the API on its first successful request. The original seeded admin accounts are deliberately not copied.
4. Add `BOOTSTRAP_SECRET` as a **secret** in the Cloudflare Pages project settings. Use at least 32 cryptographically random characters and keep the value outside frontend variables/source. `APP_ORIGIN` is optional; omit it to enforce the request’s exact same origin, or set it to the canonical site origin.
5. Configure the same D1 and R2 bindings for both production and preview environments. Deploy the Pages project through its normal Cloudflare deployment workflow; this repository has not been deployed.

For local Pages development, create an ignored `.dev.vars` file containing `BOOTSTRAP_SECRET="<local random value of 32+ characters>"`, then run `npm run dev:pages`. Wrangler uses local D1/R2 emulation; apply migrations locally with `npx wrangler d1 migrations apply mahamaya --local` if they have not been applied automatically. Plain `npm run dev` runs Vite only and does not execute Pages Functions.

## First Super Admin

1. Register the trusted committee account through the site. Normal registration always creates a `USER`.
2. Sign in to that account and open its profile.
3. Enter the server-configured bootstrap secret in the one-time first Super Admin form.
4. The server performs a conditional database promotion only if no `SUPER_ADMIN` exists. Afterward the endpoint cannot create another Super Admin. Keep the secret private and remove/rotate it in Cloudflare after bootstrap.

The Super Admin role cannot be assigned through the role-management API or backup import. The role-management endpoint is Super Admin only, disallows self-role changes, and protects the existing Super Admin account. Do not manually edit role values in the database except through a separately reviewed recovery procedure.

## Authorization boundaries

- Anonymous visitors can read public content only.
- Registration and login are server handled; browser code receives only a safe user profile. Passwords are PBKDF2-SHA-256 hashes with per-user random salts; sessions use random opaque tokens whose hashes are stored in D1 and are sent in `HttpOnly`, `SameSite=Strict` cookies (`Secure` on HTTPS).
- Every write checks the request origin, session, and role on the server. The client role is display state only.
- `CONTENT_MANAGER` can manage site content; `GALLERY_MODERATOR` can approve, feature, and remove gallery submissions; `ADMIN` can manage content and gallery; `SUPER_ADMIN` can also manage roles, import backups, and reset site content.
- Gallery submissions are stored in R2 and remain pending until an authorized moderator approves them. Image size, declared MIME type, and JPEG/PNG/WebP signatures are checked server-side.
- Authentication requests are rate limited by source IP. Cloudflare D1’s free plan has finite storage and daily read/write limits; requests can fail until the daily quota resets when those limits are exceeded. R2’s free monthly allowance is also finite. Monitor the account usage before relying on the free tier for large traffic or archives.

## Operational limitations

There is no email delivery service in this project, so email verification and password recovery are not implemented. The first Super Admin identity must be verified out-of-band before bootstrap. Plan a separately secured recovery/rotation procedure before using this for a committee that needs reliable account recovery. Keep periodic D1 backups and R2 object backups outside the website; the old browser export is not a database backup.

Existing localStorage content from old browser sessions is intentionally not trusted or imported automatically. The initial repository content is seeded to D1 once. Gallery images uploaded by the new flow are shared through R2; existing bundled Maa Durga and temple assets remain in the project.
