# good.finds storefront

React + Vite shopping experience for the DealAI project.

## Run locally

1. Start MySQL and the backend from the `backend` folder. See `backend/README.md` for Gemini setup.
2. From this `frontend` folder, run:

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). Requests under `/api` are proxied to Spring Boot on port 8080.

## Included

- 35 curated preview products in nine categories, alongside products returned by the backend
- Search, category filters, sorting, details, wishlist, and a local browsing bag
- Account registration/sign-in, backend cart synchronization, checkout, and order history
- My Coupons drawer with four copyable demo codes
- Floating DealBot chat backed by Gemini when `GEMINI_API_KEY` is configured server-side
- Deterministic backend deal score displayed with the Gemini chat context

Preview products and coupon codes are storefront demonstration content. Only live backend products can be checked out, and coupon discounts are not yet applied by the backend checkout API. Marketplace offers in the seed database are demonstration data, not live prices.
