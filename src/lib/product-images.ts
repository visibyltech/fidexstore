import type { Firestore } from "firebase-admin/firestore";
import { nextId } from "@/lib/db";
import { readImageFile } from "@/lib/image-upload";

export const MAX_PRODUCT_IMAGES = 8;

const UPLOADED_PREFIX = "/api/product-images/";

// The admin form sends the gallery as an ordered JSON list in the "images"
// field, where each slot is either an existing/external URL or the index of
// a file sent under "imageFiles". Order matters: the first image is the cover.
type ImageSlot = { url: string } | { file: number };

// Products saved before multi-image support only have `image`.
export function productImages(p: Record<string, unknown>): string[] {
  if (Array.isArray(p.images)) return p.images as string[];
  return typeof p.image === "string" && p.image ? [p.image] : [];
}

function uploadedImageId(url: string): number | null {
  if (!url.startsWith(UPLOADED_PREFIX)) return null;
  const id = Number(url.slice(UPLOADED_PREFIX.length));
  return Number.isInteger(id) ? id : null;
}

// Validates every file before writing anything, so a bad file doesn't leave
// half the gallery uploaded.
export async function saveProductImages(
  db: Firestore,
  productId: number,
  formData: FormData
): Promise<{ images: string[] } | { error: string }> {
  let slots: ImageSlot[];
  try {
    slots = JSON.parse(String(formData.get("images") ?? "[]"));
    if (!Array.isArray(slots)) throw new Error();
  } catch {
    return { error: "Invalid images list" };
  }
  if (slots.length > MAX_PRODUCT_IMAGES) {
    return { error: `A product can have at most ${MAX_PRODUCT_IMAGES} images` };
  }

  const files = formData.getAll("imageFiles").filter((f): f is File => f instanceof File);
  const readFiles = [];
  for (const file of files) {
    const result = await readImageFile(file);
    if ("error" in result) return result;
    readFiles.push(result);
  }

  const now = new Date().toISOString();
  const images: string[] = [];
  for (const slot of slots) {
    if ("url" in slot && typeof slot.url === "string" && slot.url.trim()) {
      images.push(slot.url.trim());
    } else if ("file" in slot && readFiles[slot.file]) {
      const { data, mimeType } = readFiles[slot.file];
      const id = await nextId("product_images");
      await db.collection("product_images").doc(String(id)).set({
        id,
        product_id: productId,
        data,
        mime_type: mimeType,
        created_at: now,
      });
      images.push(`${UPLOADED_PREFIX}${id}`);
    }
  }
  return { images };
}

// Removes uploaded image docs this product no longer references.
export async function deleteUnusedProductImages(
  db: Firestore,
  productId: number,
  keep: string[] = []
) {
  const kept = new Set(keep.map(uploadedImageId).filter((id) => id !== null));
  const snap = await db.collection("product_images").where("product_id", "==", productId).get();
  await Promise.all(
    snap.docs.filter((doc) => !kept.has(doc.data().id)).map((doc) => doc.ref.delete())
  );
}
