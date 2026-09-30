# Fidex — Firestore data model

Firestore is schemaless (no migration step — collections and fields are
created implicitly on first write). This documents the shape every route in
`src/app/api/**` reads and writes, so it stays consistent across routes.

All numeric ids are assigned via `nextId()` in `src/lib/db.ts` (a
transactional counter per collection) and used as both the `id` field and
the document's own ID (as a string) — this keeps the whole frontend, which
is typed and written against numeric ids (cart, wishlist, admin forms,
order references), unchanged from the previous Postgres-backed version.

Dates are stored as ISO strings (not Firestore `Timestamp`s), since routes
return them directly as JSON.

### `users/{id}`
`{ id, name, email, password_hash, role: "user" | "admin", created_at }`
Every account is created with role `"user"`; role is only ever changed to
`"admin"` by an existing admin (`PATCH /api/admin/users/[id]/role`) or by
`scripts/seed-admin.mjs` run directly against Firestore.

### `categories/{id}`
`{ id, name, slug, image, parent_id: number | null, created_at }`
`parent_id` is `null` for a top-level category and set for a leaf category
nested under one. Only two levels are supported; products always belong to
a leaf category when a hierarchy is in use (Fidex's own catalog is flat —
every category is top-level with no children).

### `products/{id}`
`{ id, category_id, name, slug, description, images, image, image_data, image_mime_type, price, old_price, rating, reviews_count, stock, is_active, created_at, updated_at }`
`images` is the ordered gallery (URLs/paths); the first is the cover and is
mirrored into `image`, which is what cards, cart, wishlist and orders render.
Products saved before multi-image support have no `images` — read it via
`productImages()` in `src/lib/product-images.ts`, which falls back to `image`.
`image_data`/`image_mime_type` are legacy: a single inline upload served at
`/api/products/[id]/image`, cleared once the admin removes it from the gallery.

### `product_images/{id}`
`{ id, product_id, data, mime_type, created_at }` — one uploaded gallery
image (base64), served at `/api/product-images/[id]`. Kept out of the
product doc so product listings stay small and each image gets its own
1 MiB Firestore document. Deleted when removed from the gallery or when the
product is deleted.

### `orders/{id}`
`{ id, user_id: number, status: "pending" | "completed", payment_method: "bank-transfer" | "installments" | "klump", full_name, email, phone, address, city, subtotal, delivery_fee, total, installment_weeks, installment_interest_rate, installment_deposit, klump_reference, has_receipt, receipt_filename, items: OrderItem[], created_at }`
Every price and total is computed server-side in `POST /api/orders` from
product prices in Firestore and the rules in `src/lib/pricing.ts`; the
browser only sends product ids and quantities.
`items` is embedded directly on the order document (no separate collection)
since it's always read and written together with its order. Each
`OrderItem` is `{ id, product_id, name, image, price, qty }` (a snapshot of
the product at order time), `id` being that item's own position id within
the order (assigned via `nextId("order_items")`), used only to give each row
a stable React key.
Klump orders have no receipt; the order is only recorded after the server
verifies `klump_reference` with Klump, and each reference can be used once.
Orders placed before receipts moved out still carry `receipt_data` /
`receipt_mime_type` inline; the receipt endpoint falls back to those.

### `order_receipts/{orderId}`
`{ order_id, filename, mime_type, data, created_at }` — the uploaded
payment receipt (base64), kept out of the order document so orders stay
small and each receipt gets its own 1 MiB document.

### `newsletter_subscribers/{email}`
`{ email, created_at }` — keyed by email (lowercased) for free uniqueness,
equivalent to the old `ON CONFLICT (email) DO NOTHING`.

### `counters/{collectionName}`
`{ value: number }` — internal, not read by any route. Holds the last
assigned id for the named collection.
