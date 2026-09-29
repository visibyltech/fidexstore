import { NextRequest, NextResponse } from "next/server";
import { getDb, nextId } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { productImages, saveProductImages } from "@/lib/product-images";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const db = getDb();
  const [productsSnap, categoriesSnap] = await Promise.all([
    db.collection("products").get(),
    db.collection("categories").get(),
  ]);
  const categoriesById = new Map(categoriesSnap.docs.map((doc) => [doc.data().id, doc.data()]));

  const products = productsSnap.docs
    .map((doc) => {
      const p = doc.data();
      const category = categoriesById.get(p.category_id);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        image: p.image,
        images: productImages(p),
        price: p.price,
        old_price: p.old_price,
        rating: p.rating,
        reviews_count: p.reviews_count,
        stock: p.stock,
        is_active: p.is_active,
        category_id: p.category_id,
        category: category?.slug ?? null,
        category_name: category?.name ?? null,
      };
    })
    .sort((a, b) => b.id - a.id);

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = Number(formData.get("categoryId"));
  const price = Number(formData.get("price"));

  if (!name || !Number.isInteger(categoryId) || !Number.isFinite(price)) {
    return NextResponse.json(
      { error: "name, categoryId and price are required" },
      { status: 400 }
    );
  }

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name);
  const descriptionRaw = formData.get("description");
  const description =
    typeof descriptionRaw === "string" && descriptionRaw.trim() ? descriptionRaw : null;
  const oldPriceRaw = formData.get("oldPrice");
  const oldPrice =
    oldPriceRaw != null && Number.isFinite(Number(oldPriceRaw)) ? Number(oldPriceRaw) : null;
  const stockRaw = Number(formData.get("stock"));
  const stock = Number.isInteger(stockRaw) ? stockRaw : 0;

  const db = getDb();

  const categoryDoc = await db.collection("categories").doc(String(categoryId)).get();
  if (!categoryDoc.exists) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const existingSlugSnap = await db.collection("products").where("slug", "==", slug).limit(1).get();
  if (!existingSlugSnap.empty) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  const id = await nextId("products");
  const saved = await saveProductImages(db, id, formData);
  if ("error" in saved) {
    return NextResponse.json({ error: saved.error }, { status: 400 });
  }

  const now = new Date().toISOString();
  const product = {
    id,
    category_id: categoryId,
    name,
    slug,
    description,
    images: saved.images,
    image: saved.images[0] ?? null,
    price,
    old_price: oldPrice,
    rating: 0,
    reviews_count: 0,
    stock,
    is_active: true,
    created_at: now,
    updated_at: now,
  };
  await db.collection("products").doc(String(id)).set(product);

  return NextResponse.json(
    {
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        image: product.image,
        images: product.images,
        price: product.price,
        old_price: product.old_price,
        stock: product.stock,
        is_active: product.is_active,
        category_id: product.category_id,
      },
    },
    { status: 201 }
  );
}
