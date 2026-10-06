# DealAI — Full Project Build Plan
### AI-Powered E-Commerce Platform with Intelligent Deal Comparison

This document is written to be pasted into GitHub Copilot Chat (or used as
a `.github/copilot-instructions.md` file) so Copilot can build this project
inside VS Code phase by phase. A reference implementation already exists
(ask for the `dealai-backend` and `dealai-frontend` zips) — you can either
point Copilot at that code and ask it to extend it, or hand Copilot this
plan and let it build from scratch. Each phase below is scoped to be a
single Copilot session.

---

## 0. Project Summary

A full-stack e-commerce platform where an animated AI assistant ("DealBot")
watches shopping behavior and **proactively** tells the user when a better
deal exists elsewhere — comparing price, shipping, delivery time, rating,
and review count into one weighted **Deal Score**, rather than just
chasing the lowest price.

**Stack:** React (Vite) frontend · Spring Boot (Java 17) backend · MySQL ·
Spring Security + JWT auth.

**Repo layout (recommended: two folders in one repo, or two repos):**
```
dealai/
├── backend/     (Spring Boot, Maven)
└── frontend/    (React, Vite)
```

---

## 1. Feasibility Note — Read This Before Building

Amazon, Flipkart, and Meesho have **no public product-price API**, and
scraping their live pages breaks their Terms of Service and is fragile
(anti-bot measures, layout changes, IP bans). Do not build live scraping
into this project.

**Design decision:** all external offers come from an
`external_product_offers` table, populated via seed data / an admin form.
Build the offer-fetching logic behind an interface
(`ExternalOfferProvider`) so a real data source (affiliate API, licensed
price-feed, or a scraper microservice) can be swapped in later without
touching the recommendation engine. Tell Copilot this explicitly — it will
otherwise try to write a scraper.

---

## 2. Phase-by-Phase Plan

### Phase 0 — Project Scaffolding
**Goal:** empty-but-runnable skeletons for both apps.

- [ ] `backend/`: Spring Initializr project — Java 17, Maven, dependencies:
      Spring Web, Spring Data JPA, Spring Security, Validation, MySQL
      Driver, Lombok.
- [ ] `frontend/`: `npm create vite@latest frontend -- --template react`,
      then add `axios` and `react-router-dom`.
- [ ] Backend `application.yml`: MySQL connection (`createDatabaseIfNotExist=true`),
      `hibernate.ddl-auto: update`, a placeholder JWT secret.
- [ ] Frontend `vite.config.js`: dev server proxy `/api` → `http://localhost:8080`.
- [ ] Confirm both run: backend on `:8080` (`mvn spring-boot:run`), frontend
      on `:3000` (`npm run dev`).

**Copilot prompt to use:**
> "Set up a Spring Boot 3 project with Java 17, Spring Web, Spring Data JPA,
> Spring Security, Validation, MySQL Driver, and Lombok. Configure
> application.yml for a local MySQL database called `dealai` with
> auto-create enabled."

---

### Phase 1 — Data Model & Entities
**Goal:** every table the app needs, mapped as JPA entities.

Entities to create (`backend/.../entity/`):

| Entity | Key fields |
|---|---|
| `User` | id, email (unique), passwordHash, fullName, role (USER/ADMIN), createdAt |
| `Category` | id, name (unique), description |
| `Product` | id, name, modelIdentifier, description, price, stockQuantity, imageUrl, ratingAverage, reviewCount, category (FK), createdAt |
| `ExternalProductOffer` | id, product (FK), platform (enum: OWN_STORE/AMAZON/FLIPKART/MEESHO), price, shippingCost, estimatedDeliveryDays, rating, reviewCount, sellerName, productUrl, available, fetchedAt |
| `Cart` | id, user (FK, one-to-one), items (one-to-many CartItem) |
| `CartItem` | id, cart (FK), product (FK), quantity |
| `Order` | id, user (FK), totalAmount, status (enum: PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED), items (one-to-many OrderItem), createdAt |
| `OrderItem` | id, order (FK), product (FK), quantity, priceAtPurchase |
| `Wishlist` | id, user (FK), product (FK), addedAt — unique on (user, product) |

- [ ] Create the 3 enums: `Role`, `Platform`, `OrderStatus`.
- [ ] Create all 9 entities above with Lombok `@Getter @Setter @Builder
      @NoArgsConstructor @AllArgsConstructor`.
- [ ] Create a Spring Data JPA repository interface for each entity.
- [ ] Write `data.sql` with: 1 category, 1 demo product, and 3
      `external_product_offers` rows for it — one clearly better (cheaper +
      faster + better rated), one cheaper-but-worse, one near-tied on price.
      This lets you test the Deal Engine (Phase 5) without building an
      admin UI first.
- [ ] Set `spring.jpa.defer-datasource-initialization: true` and
      `spring.sql.init.mode: always` so Hibernate creates tables before
      `data.sql` runs.

---

### Phase 2 — Authentication (JWT + Spring Security)
**Goal:** register/login, stateless JWT auth, role-based route protection.

- [ ] `JwtUtil`: generate/parse tokens using `io.jsonwebtoken` (jjwt 0.12.x),
      embedding email as subject and role as a claim.
- [ ] `JwtAuthFilter` (`OncePerRequestFilter`): reads `Authorization: Bearer
      <token>`, validates it, sets `SecurityContextHolder` authentication.
- [ ] `SecurityConfig`: stateless session policy, CSRF disabled, CORS
      allowing `http://localhost:3000`, route rules:
      - `/api/auth/**` → public
      - `GET /api/products/**`, `/api/categories/**` → public
      - `/api/admin/**` → `ROLE_ADMIN` only
      - everything else → authenticated
- [ ] DTOs: `RegisterRequest`, `LoginRequest`, `AuthResponse`.
- [ ] `AuthService`: register (hash password with `BCryptPasswordEncoder`,
      reject duplicate emails with 409), login (verify password, issue JWT).
- [ ] `AuthController`: `POST /api/auth/register`, `POST /api/auth/login`.
- [ ] Global exception handling: a `ApiException(HttpStatus, message)` and
      a `@RestControllerAdvice` that converts it (and validation errors)
      into a consistent JSON error shape.

**Test before moving on:**
```bash
curl -X POST localhost:8080/api/auth/register -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"t@example.com","password":"password123"}'
curl -X POST localhost:8080/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"t@example.com","password":"password123"}'
```
Both should return a JWT.

---

### Phase 3 — Product Catalog
**Goal:** browse and search products (public endpoints).

- [ ] `ProductController`: `GET /api/products`, `GET /api/products/{id}`,
      `GET /api/products/search?q=`.
- [ ] `CategoryController`: `GET /api/categories`.
- [ ] (Optional, do in Phase 7) Admin CRUD under `/api/admin/products` and
      `/api/admin/categories`, protected by `hasRole("ADMIN")`.

---

### Phase 4 — Cart & Checkout
**Goal:** authenticated users can build a cart and place an order.

- [ ] DTOs: `CartItemRequest`, `CartItemResponse`, `CartResponse`,
      `OrderResponse`.
- [ ] `CartService`: get-or-create cart per user; add item (merge quantity
      if product already in cart, validate stock); update quantity (delete
      if set to 0); remove item.
- [ ] `CartController` (all endpoints read the logged-in user from
      `Authentication.getName()`, populated by the JWT filter):
      - `GET /api/cart`
      - `POST /api/cart/items`
      - `PATCH /api/cart/items/{id}?quantity=`
      - `DELETE /api/cart/items/{id}`
- [ ] `OrderService.checkout()`: validate stock for every cart line,
      snapshot `priceAtPurchase` onto each `OrderItem`, decrement product
      stock, clear the cart, save the order as `CONFIRMED`. Wrap in
      `@Transactional`.
- [ ] `OrderController`: `POST /api/orders/checkout`, `GET /api/orders`
      (history, newest first).

---

### Phase 5 — The AI Deal Comparison Engine (core feature)
**Goal:** given a product, score every competing offer and decide whether
to recommend one.

- [ ] `ExternalOfferProvider` interface: `List<ExternalProductOffer>
      fetchOffers(Product product)`.
- [ ] `MockOfferProvider implements ExternalOfferProvider`: reads from
      `ExternalProductOfferRepository.findByProductIdAndAvailableTrue(id)`,
      filtering out `OWN_STORE`. (This is the seam to replace later with a
      real data source — see section 1.)
- [ ] `DealComparisonService` — the algorithm:

  **Step 1 — "Meaningful savings" check.** A price difference only counts
  if it's ≥ a configurable threshold (`app.deal-engine.min-meaningful-saving-percent`,
  suggest 5%). This stops a ₹5 difference from triggering a notification.

  **Step 2 — Deal Score per offer**, weighted sum of four normalized (0–100)
  sub-scores:
  | Factor | Weight (meaningful price gap) | Weight (prices roughly tied) |
  |---|---|---|
  | Price (total cost incl. shipping, cheaper = higher score) | 50% | 15% |
  | Delivery speed (1 day → 100, 10+ days → ~0, linear) | 20% | 35% |
  | Rating (rating/5 × 100) | 20% | 35% |
  | Review count (log-scaled, diminishing returns, caps ~50k reviews) | 10% | 15% |

  Use two weight sets so that when prices are near-identical, the engine
  stops chasing price and lets delivery/rating/reviews decide — this is
  what makes the recommendation defensible ("why not just cheapest price?").

  **Step 3 — Pick the best-scoring offer.** Only surface a recommendation
  if either (a) it has meaningful savings, or (b) its Deal Score beats our
  own listing's baseline score by a clear margin (~8 points) even at a
  similar price.

  **Step 4 — Build a human message**, e.g.: *"Hold on! I found the same
  product on Flipkart for ₹700 less, with 2-day delivery and a 4.5★
  rating. You could save ₹700."* Vary the message when it's a tie-break
  recommendation (delivery/rating driven, not price driven).

- [ ] `DealRecommendationResponse` DTO: `betterDealFound`, `platform`,
      `offerPrice`, `potentialSavings`, `dealScore`, `message`, `productUrl`.
- [ ] `DealComparisonController`: `GET
      /api/deals/products/{productId}/recommendation`.

**Test with the seed data from Phase 1** — the engine should pick the
"clearly better" offer over the "cheaper but worse" one.

---

### Phase 6 — React Frontend
**Goal:** full shopping UI plus the DealBot widget.

- [ ] `src/api/client.js`: axios instance, attaches JWT from
      `localStorage` on every request, clears it on 401.
- [ ] `src/api/{auth,products,cart}.js`: thin wrappers around each backend
      endpoint group.
- [ ] `src/context/AuthContext.jsx`: login/register/logout, persists
      `{token, email, fullName}` to `localStorage`.
- [ ] Pages: `Login`, `Register`, `ProductList` (grid + search),
      `ProductDetail`, `Cart`, `Orders`.
- [ ] `ProtectedRoute` wrapper for `/cart` and `/orders`.
- [ ] **`DealBot` component** — the differentiator:
  - Starts a timer when the product page mounts (stand-in for real
    purchase-intent tracking — see Phase 8).
  - On timeout, calls `GET /api/deals/products/{id}/recommendation`.
  - Shows a quiet idle bubble (🤖) while waiting/checking.
  - If `betterDealFound: true`, pops up an animated bubble with the
    message, a "View offer" link, a dismiss button, and the Deal Score.
  - If not, stays quiet — **never show a false-positive interruption.**
- [ ] Styling: fixed-position bottom-right bot, slide-in animation on
      alert, pulse animation while "checking."

---

### Phase 7 — Admin & Polish
- [ ] Admin-only product/category CRUD (backend `/api/admin/**` + a simple
      admin page in the frontend, gated on `role === 'ADMIN'`).
- [ ] Wishlist: `WishlistController` (`GET/POST/DELETE
      /api/wishlist`) + a heart-icon button on `ProductCard`.
- [ ] Order status transitions (admin can mark orders SHIPPED/DELIVERED).
- [ ] Basic input validation error display across all forms.
- [ ] Replace letter-avatar product placeholders with real images.

---

### Phase 8 — Real Purchase-Intent Signal (stretch)
Replace the frontend timer with the behavior the original spec describes:
- [ ] `POST /api/events` endpoint logging: product view, time-on-product,
      wishlist add, cart add, repeat views.
- [ ] A scoring rule (backend or frontend) that decides "user is seriously
      considering this" from a combination of those events, not a flat timer.
- [ ] `DealBot` calls the recommendation endpoint when that score crosses
      threshold, instead of a fixed delay.

---

## 3. Full API Reference (for Copilot to implement against)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | none | Create account, returns JWT |
| POST | `/api/auth/login` | none | Login, returns JWT |
| GET | `/api/products` | none | List all products |
| GET | `/api/products/{id}` | none | Product detail |
| GET | `/api/products/search?q=` | none | Search by name |
| GET | `/api/categories` | none | List categories |
| GET | `/api/deals/products/{id}/recommendation` | none | AI deal recommendation |
| GET | `/api/cart` | user | Get current user's cart |
| POST | `/api/cart/items` | user | Add item `{productId, quantity}` |
| PATCH | `/api/cart/items/{id}?quantity=` | user | Update quantity (0 = remove) |
| DELETE | `/api/cart/items/{id}` | user | Remove item |
| POST | `/api/orders/checkout` | user | Convert cart → order |
| GET | `/api/orders` | user | Order history |
| GET/POST/PUT/DELETE | `/api/admin/products/**` | admin | Product management |
| GET/POST/DELETE | `/api/wishlist` | user | Wishlist (Phase 7) |

---

## 4. Definition of Done (per phase)

Tell Copilot to treat each phase as complete only when:
1. The code compiles / runs with no errors.
2. Every endpoint in that phase has been manually tested with `curl` or
   Postman (paste the exact request/response into the PR description or
   commit message).
3. No secrets (JWT secret, DB password) are hardcoded outside
   `application.yml` / `.env` — and those files are in `.gitignore`.

---

## 5. What NOT to build

- No live scraping of Amazon/Flipkart/Meesho (see Section 1).
- No storing plaintext passwords — always BCrypt.
- No client-side-only "auth" — every protected endpoint must verify the
  JWT server-side via the security filter, not trust a frontend flag.
