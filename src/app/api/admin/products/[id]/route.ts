import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { readImageFile } from "@/lib/image-upload";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const sql = getSql();
  const [product] = await sql`
    SELECT id, name, slug, description, image, price, old_price, stock, is_active, category_id
    FROM products WHERE id = ${productId}
  `;
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const sql = getSql();
  const [existing] = await sql`SELECT * FROM products WHERE id = ${productId}`;
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const formData = await request.formData();

  const categoryIdRaw = formData.get("categoryId");
  if (categoryIdRaw != null && String(categoryIdRaw).trim()) {
    const categoryId = Number(categoryIdRaw);
    if (!Number.isInteger(categoryId)) {
      return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
    }
    const [category] = await sql`SELECT id FROM categories WHERE id = ${categoryId}`;
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
  }

  const nameRaw = String(formData.get("name") ?? "").trim();
  const name = nameRaw || existing.name;
  const categoryId = categoryIdRaw != null && String(categoryIdRaw).trim() ? Number(categoryIdRaw) : existing.category_id;
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugify(slugRaw) : existing.slug;
  const descriptionRaw = formData.get("description");
  const description =
    typeof descriptionRaw === "string" && descriptionRaw.trim() ? descriptionRaw : existing.description;
  const priceRaw = formData.get("price");
  const price =
    priceRaw != null && Number.isFinite(Number(priceRaw)) ? Number(priceRaw) : existing.price;
  const oldPriceRaw = formData.get("oldPrice");
  const oldPrice =
    oldPriceRaw != null && String(oldPriceRaw).trim()
      ? Number.isFinite(Number(oldPriceRaw))
        ? Number(oldPriceRaw)
        : existing.old_price
      : existing.old_price;
  const stockRaw = formData.get("stock");
  const stock = stockRaw != null && Number.isInteger(Number(stockRaw)) ? Number(stockRaw) : existing.stock;
  const isActiveRaw = formData.get("isActive");
  const isActive = isActiveRaw != null ? isActiveRaw === "true" : existing.is_active;

  let image = existing.image;
  let imageData = existing.image_data;
  let imageMimeType = existing.image_mime_type;

  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    const result = await readImageFile(imageFile);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    imageData = result.data;
    imageMimeType = result.mimeType;
    image = `/api/products/${productId}/image`;
  } else {
    const imageUrlRaw = formData.get("imageUrl");
    if (typeof imageUrlRaw === "string" && imageUrlRaw.trim()) {
      image = imageUrlRaw.trim();
      imageData = null;
      imageMimeType = null;
    }
  }

  if (slug !== existing.slug) {
    const [slugTaken] = await sql`SELECT id FROM products WHERE slug = ${slug} AND id != ${productId}`;
    if (slugTaken) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
  }

  const [product] = await sql`
    UPDATE products SET
      category_id = ${categoryId},
      name = ${name},
      slug = ${slug},
      description = ${description},
      image = ${image},
      image_data = ${imageData},
      image_mime_type = ${imageMimeType},
      price = ${price},
      old_price = ${oldPrice},
      stock = ${stock},
      is_active = ${isActive},
      updated_at = now()
    WHERE id = ${productId}
    RETURNING id, name, slug, description, image, price, old_price, stock, is_active, category_id
  `;
  return NextResponse.json({ product });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const sql = getSql();
  const result = await sql`DELETE FROM products WHERE id = ${productId} RETURNING id`;
  if (!result.length) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
