import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// One-time catalog seed for a fresh Fidex Firestore project. Run directly
// against Firestore with server-side env vars. Safe to re-run: categories
// and products are matched by slug and skipped if they already exist.
const CATEGORIES = [
  { name: "Clothing", slug: "clothing", image: "/products-fidex/tshirt-black.jpg" },
  { name: "Accessories", slug: "accessories", image: "/products-fidex/watch.jpg" },
  { name: "Grooming", slug: "grooming", image: "/products-fidex/grooming-set.jpg" },
  { name: "Essentials", slug: "essentials", image: "/products-fidex/sneakers.jpg" },
];

const PRODUCTS = [
  { category: "clothing", name: "Classic Black Crew Tee", slug: "classic-black-crew-tee", description: "A wardrobe staple. 100% heavyweight cotton crew neck tee, cut for a clean, modern fit.", image: "/products-fidex/tshirt-black.jpg", price: 8500, old_price: null, rating: 4.6, reviews_count: 34, stock: 60 },
  { category: "clothing", name: "Essential White Crew Tee", slug: "essential-white-crew-tee", description: "Crisp white cotton tee that pairs with everything. Breathable, durable, and true to size.", image: "/products-fidex/tshirt-white.jpg", price: 8500, old_price: 10000, rating: 4.5, reviews_count: 28, stock: 55 },
  { category: "clothing", name: "Slim Fit Denim Jeans", slug: "slim-fit-denim-jeans", description: "Stretch denim with a tailored slim fit. Built for everyday wear from day to night.", image: "/products-fidex/jeans.jpg", price: 22000, old_price: 26000, rating: 4.7, reviews_count: 41, stock: 32 },
  { category: "accessories", name: "Full-Grain Leather Belt", slug: "full-grain-leather-belt", description: "Hand-cut full-grain leather belt with a solid metal buckle. Ages beautifully with wear.", image: "/products-fidex/belt.jpg", price: 12500, old_price: null, rating: 4.4, reviews_count: 19, stock: 40 },
  { category: "accessories", name: "Classic Chronograph Watch", slug: "classic-chronograph-watch", description: "A timeless chronograph on a stainless steel case. Sharp enough for the office, tough enough for the weekend.", image: "/products-fidex/watch.jpg", price: 45000, old_price: 55000, rating: 4.8, reviews_count: 52, stock: 18 },
  { category: "accessories", name: "Polarized Aviator Sunglasses", slug: "polarized-aviator-sunglasses", description: "UV400 polarized lenses in a classic aviator frame. Comes with a protective case.", image: "/products-fidex/sunglasses.jpg", price: 15000, old_price: null, rating: 4.3, reviews_count: 22, stock: 45 },
  { category: "accessories", name: "Leather Trifold Wallet", slug: "leather-trifold-wallet", description: "Compact trifold wallet in genuine leather with card slots and a coin pocket.", image: "/products-fidex/wallet.jpg", price: 18000, old_price: null, rating: 4.6, reviews_count: 16, stock: 38 },
  { category: "accessories", name: "Everyday Canvas Backpack", slug: "everyday-canvas-backpack", description: "Durable canvas backpack with a padded laptop sleeve. Built for daily carry.", image: "/products-fidex/backpack.jpg", price: 27500, old_price: 32000, rating: 4.7, reviews_count: 37, stock: 24 },
  { category: "grooming", name: "Men's Grooming Essentials Kit", slug: "mens-grooming-essentials-kit", description: "A complete grooming set. Trimmer, brush, and skincare essentials in one travel-ready kit.", image: "/products-fidex/grooming-set.jpg", price: 19500, old_price: null, rating: 4.5, reviews_count: 29, stock: 27 },
  { category: "essentials", name: "Classic Snapback Cap", slug: "classic-snapback-cap", description: "Structured six-panel snapback with an adjustable fit. A go-to finishing piece for any outfit.", image: "/products-fidex/cap.jpg", price: 9500, old_price: null, rating: 4.4, reviews_count: 21, stock: 50 },
  { category: "essentials", name: "Canvas Low-Top Sneakers", slug: "canvas-low-top-sneakers", description: "Lightweight canvas low-tops with a cushioned footbed. An everyday essential for any wardrobe.", image: "/products-fidex/sneakers.jpg", price: 24000, old_price: 28000, rating: 4.6, reviews_count: 44, stock: 30 },
];

async function nextId(db, collectionName) {
  const counterRef = db.collection("counters").doc(collectionName);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef);
    const next = (snap.exists ? snap.data().value : 0) + 1;
    tx.set(counterRef, { value: next });
    return next;
  });
}

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables are not set"
    );
  }

  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  const db = getFirestore();
  const now = new Date().toISOString();

  const slugToId = {};
  for (const cat of CATEGORIES) {
    const existing = await db.collection("categories").where("slug", "==", cat.slug).limit(1).get();
    if (!existing.empty) {
      slugToId[cat.slug] = existing.docs[0].data().id;
      console.log(`Category "${cat.name}" already exists, skipping.`);
      continue;
    }
    const id = await nextId(db, "categories");
    await db.collection("categories").doc(String(id)).set({
      id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      parent_id: null,
      created_at: now,
    });
    slugToId[cat.slug] = id;
    console.log(`Created category "${cat.name}" (id ${id}).`);
  }

  for (const p of PRODUCTS) {
    const existing = await db.collection("products").where("slug", "==", p.slug).limit(1).get();
    if (!existing.empty) {
      console.log(`Product "${p.name}" already exists, skipping.`);
      continue;
    }
    const id = await nextId(db, "products");
    await db.collection("products").doc(String(id)).set({
      id,
      category_id: slugToId[p.category],
      name: p.name,
      slug: p.slug,
      description: p.description,
      image: p.image,
      image_data: null,
      image_mime_type: null,
      price: p.price,
      old_price: p.old_price,
      rating: p.rating,
      reviews_count: p.reviews_count,
      stock: p.stock,
      is_active: true,
      created_at: now,
      updated_at: now,
    });
    console.log(`Created product "${p.name}" (id ${id}).`);
  }

  console.log("Catalog seed complete.");
}

main().catch((err) => {
  console.error("Seeding catalog failed:", err);
  process.exit(1);
});
