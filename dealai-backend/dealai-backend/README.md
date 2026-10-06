# Deal AI — Backend (v1)

Spring Boot backend for the AI-powered e-commerce deal comparison platform.

## What's in this pass

- User auth (register/login) with JWT + Spring Security, roles `USER`/`ADMIN`
- Product + Category browsing
- **Deal Comparison Engine** (`DealComparisonService`) — the core AI feature
- Pluggable `ExternalOfferProvider` interface, with a `MockOfferProvider`
  backed by the `external_product_offers` table (see note below on why
  live scraping isn't wired up yet)
- Cart, checkout, order history, wishlist, and admin management APIs
- Global exception handling, CORS configured for `localhost:3000`
- Demo seed data (`data.sql`) so the deal engine has something to score
  the moment you start the app

## Why offers are seeded, not scraped

Amazon/Flipkart/Meesho have no public product-price API, and scraping them
live breaks their ToS and is fragile (anti-bot, layout drift, IP bans) —
not something you want failing mid-demo. `ExternalOfferProvider` is the
seam: implement it against a real data source (an affiliate API, a
licensed price-comparison feed, or your own scraper service) later without
touching the scoring logic at all.

## Run it

1. Install MySQL locally (or point `application.yml` at a remote instance),
   and create/allow a database called `dealai` (auto-created on first run
   via `createDatabaseIfNotExist=true`).
2. Update `src/main/resources/application.yml` — set your MySQL username/
   password, and **replace `app.jwt.secret`** with your own long random
   string before this goes anywhere near production.
3. `mvn spring-boot:run` (requires Maven + JDK 17; this container's network
   couldn't reach Maven Central to build it for you, so run this locally).

The app starts on `http://localhost:8080`.

## Try the deal engine immediately

With the seed data loaded, product id `1` (the demo headphones) already has
three competing offers — one clearly better, one cheaper-but-worse, one
near-tied on price:

```bash
curl http://localhost:8080/api/products/1

curl http://localhost:8080/api/deals/products/1/recommendation
```

You should get back Flipkart as the winner (cheaper AND better rated AND
faster), with a human-readable `message` field ready to hand straight to
the frontend's AI bot bubble.

## Auth quick test

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'

curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Both return a JWT — send it as `Authorization: Bearer <token>` on any
endpoint under `/api/**` other than `/api/auth/**` and public GETs on
`/api/products` and `/api/categories`.

## Current status

The backend is complete for the current MVP and frontend integration phase.
The implemented flows are:

1. **Authentication** — register/login with JWT and user/admin roles.
2. **Catalog** — public product/category browsing and product search.
3. **Shopping** — authenticated cart management and transactional checkout.
4. **Orders** — order history plus admin status updates.
5. **Wishlist** — authenticated add, list, and remove operations.
6. **Admin management** — protected product and category CRUD endpoints.
7. **DealBot engine** — weighted deal scoring with seeded marketplace offers.

## Optional future enhancements

1. **Purchase-intent tracking endpoint** — a lightweight `POST
   /api/events` the frontend calls on meaningful shopping events, so the
   *threshold logic* (when to trigger the bot) lives in one place instead
   of scattered frontend heuristics.
2. Swap `MockOfferProvider` for a real data source once you've picked one.

Say the word and I'll build Cart/Order next, or start on the React
frontend + AI DealBot widget instead — your call.
