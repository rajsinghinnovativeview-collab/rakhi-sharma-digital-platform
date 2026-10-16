# Rak.Hi Arts — Resend OTP setup

The Google Apps Script in `apps-script/Code.gs` uses Resend to send registration verification and password-reset OTPs from **Rak.Hi Arts <noreply@rakhiart.in>**.

## Setup

1. Verify `rakhiart.in` for sending in Resend (completed by account owner).
2. In the **same Google Apps Script project** currently deployed as the website backend, open **Project Settings → Script Properties → Add script property**.
3. Set the name to `RESEND_API_KEY` and paste the Resend **Sending access** API key as its value. Never add the key to GitHub, Google Sheets, frontend code, or chat.
4. Copy the updated `apps-script/Code.gs` into the Apps Script editor. Preserve any production-only changes by reviewing differences before replacing it.
5. Save, then **Deploy → Manage deployments → Edit → New version → Deploy**. Confirm the website's `RAKHI_GAS_URL` points to the correct deployment.
6. Test registering a new account and receiving/verifying the OTP, then request and complete a password reset. Check Resend logs for delivery and errors. Confirm existing sign-in and data flows still work.

## Security / behavior

- No SMTP/IMAP service or paid NevTan plan is needed.
- Google Sheets remains the database and Google Apps Script still generates/checks the ten-minute OTP.
- API key remains server-side in Apps Script Properties.
- Resend API failures are rejected (HTTP status checked); no successful delivery is claimed just because a request was made.
- Never share raw API keys or OTP values in logs or screenshots.

The GitHub branch does **not** itself update the live Apps Script deployment. Do not merge or deploy before credentials and tests are ready.
