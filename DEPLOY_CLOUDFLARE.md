# Cloudflare deployment — runtime manifest fix

The uploaded runtime log shows `Unexpected loadManifest(/.next/server/preview-props.json) call!`.
OpenNext 1.20.10's manifest glob does not include Next.js 16.4's preview-props.json.
The build script now applies a small idempotent adapter fix that includes the real generated manifest in the Worker bundle.

## Upload to the existing repository

Extract this ZIP and copy its contents into the repository root, beside package.json.
Commit the source files, including scripts/fix-opennext-manifest.mjs, package-lock.json, wrangler.jsonc and open-next.config.ts.
Do not upload node_modules or generated .next/.open-next folders.

## Cloudflare Workers build settings

- Worker name: `rakhi-sharma-digital-platform`
- Root directory: the directory containing package.json (blank when this is the repository root)
- Build command: `npm run cf:build`
- Deploy command: `npm run cf:deploy`
- Version upload command, if enabled: `npx opennextjs-cloudflare upload`

Clear the old build cache and trigger a new deployment after updating these settings.
Do not use only `npm run build` as the Cloudflare build command; cf:build applies the manifest fix and produces the Worker bundle.

The Worker name and WORKER_SELF_REFERENCE service both match your actual deployed Worker.
With your existing account subdomain `orchha`, the site remains:
https://rakhi-sharma-digital-platform.orchha.workers.dev/

## Google Apps Script

The current Apps Script URL is already configured as the server route's fallback.
To override it, set `RAKHI_GAS_URL` in the Worker's runtime environment as well as the build environment if needed.
No Apps Script redeployment is required for this manifest fix.

## Local verification

Run `npm ci`, then `npm run preview`.
This version passed TypeScript checking, the OpenNext production build, and local Workers runtime requests:
- `/`: HTTP 200
- `/not-a-page`: HTTP 404

The live Cloudflare redeployment and end-to-end Sheets transactions must still be verified after deployment.
