# Rak.Hi Arts · Rakhi Sharma (Next.js / TSX)

Mobile-first art store and Orchha visitor-support app. The app is written in Next.js App Router + TypeScript/TSX. Google Sheets remains the only business datastore; Apps Script is called through the Next.js server route, so the browser never calls the Apps Script API directly and does not hit the cross-origin POST limitation.

## Start locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run typecheck
npm run build
npm start
```

The production build and strict TypeScript check passed in the workspace. `npm run build` runs the typecheck first.

## Deploy

Import this project folder into the hosting project that runs Next.js (for example, the Rakhi Vercel project). Set `RAKHI_GAS_URL` to the Web App URL in `.env.example`, then deploy. Do not put Google credentials in the browser or expose the private Sheet.

## Included sections

- Sheet-backed published art catalogue, search, category filter, cart and order request
- Customer registration, verification, sign-in, order/activity view and password reset request
- Custom art enquiries
- Verified Orchha experiences, visitor information and non-emergency TFC enquiries
- Authorized staff dashboard for order, enquiry and content status updates

Payment and delivery are confirmed directly by Rakhi. No gateway is connected, and an order request does not claim stock reservation or payment. Tourism details only appear when published and verified; the page does not imply government endorsement.

`apps-script/Code.gs` is the matching Sheets API backend. The previous static preview remains in `dist/`, but the TSX app in `app/` is the main product.
