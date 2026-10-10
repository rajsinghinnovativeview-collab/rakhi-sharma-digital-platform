# Google Sheets + Apps Script connection

The Next.js app calls the Apps Script Web App from `app/api/sheets/route.ts`. This is a server-side proxy; visitors' browsers never call Apps Script directly.

The endpoint is configured in `.env.example`. In production, set the environment variable `RAKHI_GAS_URL` to the Web App URL and redeploy the Next.js site. The web app must be deployed with access that permits the site's server to read and write the required spreadsheet. Keep the spreadsheet itself private.

The matching API is included in `apps-script/Code.gs`. Its public GET actions include `bootstrap` and its POST actions cover customer accounts, art order requests, custom art enquiries, TFC enquiries and staff updates. If the deployed script is an older version, update it from this file and deploy a new version before testing.

No Supabase or payment gateway is used. Passwords are saved as salted HMAC hashes by the Apps Script; payments are arranged directly with Rakhi.
