import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { readImageFile } from "@/lib/image-upload";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const sql = getSql();
  const products = await sql`
    SELECT p.id, p.name, p.slug, p.description, p.image, p.price, p.old_price,
           p.rating, p.reviews_count, p.stock, p.is_active, p.category_id,
           c.slug AS category, c.name AS category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ORDER BY p.created_at DESC
  `;
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
  const imageUrlRaw = formData.get("imageUrl");
  const imageUrl =
    typeof imageUrlRaw === "string" && imageUrlRaw.trim() ? imageUrlRaw.trim() : null;
  const oldPriceRaw = formData.get("oldPrice");
  const oldPrice =
    oldPriceRaw != null && Number.isFinite(Number(oldPriceRaw)) ? Number(oldPriceRaw) : null;
  const stockRaw = Number(formData.get("stock"));
  const stock = Number.isInteger(stockRaw) ? stockRaw : 0;

  const sql = getSql();

  const [category] = await sql`SELECT id FROM categories WHERE id = ${categoryId}`;
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const [existingSlug] = await sql`SELECT id FROM products WHERE slug = ${slug}`;
  if (existingSlug) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  let imageData: string | null = null;
  let imageMimeType: string | null = null;

  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    const result = await readImageFile(imageFile);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    imageData = result.data;
    imageMimeType = result.mimeType;
  }

  const [product] = await sql`
    INSERT INTO products (
      category_id, name, slug, description, image, image_data, image_mime_type, price, old_price, stock
    ) VALUES (
      ${categoryId}, ${name}, ${slug}, ${description}, ${imageUrl}, ${imageData}, ${imageMimeType}, ${price}, ${oldPrice}, ${stock}
    )
    RETURNING id, name, slug, description, image, price, old_price, stock, is_active, category_id
  `;

  if (imageData) {
    const [updated] = await sql`
      UPDATE products SET image = ${`/api/products/${product.id}/image`}
      WHERE id = ${product.id}
      RETURNING id, name, slug, description, image, price, old_price, stock, is_active, category_id
    `;
    return NextResponse.json({ product: updated }, { status: 201 });
  }

  return NextResponse.json({ product }, { status: 201 });
}
