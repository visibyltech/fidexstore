import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Public — serves images an admin uploaded to a product's gallery.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const imageId = Number(id);
  if (!Number.isInteger(imageId)) {
    return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
  }

  const doc = await getDb().collection("product_images").doc(String(imageId)).get();
  const image = doc.data();
  if (!image?.data) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return new NextResponse(Buffer.from(image.data, "base64"), {
    headers: {
      "Content-Type": image.mime_type || "application/octet-stream",
      // Image ids are never reused, so the content behind a URL never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
