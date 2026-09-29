// Each uploaded image is stored base64-encoded in its own Firestore document,
// and Firestore caps a document at 1 MiB — base64 adds ~33%, so the raw file
// has to stay under ~750KB. The admin form resizes/compresses photos in the
// browser before upload, so this is only hit by unusually large images.
export const MAX_IMAGE_BYTES = 700 * 1024;

export async function readImageFile(
  file: File
): Promise<{ data: string; mimeType: string } | { error: string }> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: `"${file.name}" is too large (max 700KB after compression)` };
  }
  if (!file.type.startsWith("image/")) {
    return { error: `"${file.name}" must be an image` };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  return { data: buffer.toString("base64"), mimeType: file.type };
}
