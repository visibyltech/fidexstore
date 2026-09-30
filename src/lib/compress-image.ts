
// Phone photos are often several MB. Scale down and re-encode as JPEG so
// each upload (product photos, payment receipts) fits comfortably in a
// single Firestore document, which is capped at 1 MiB.
const MAX_DIMENSION = 1600;
const TARGET_BYTES = 600 * 1024;

export const compressImage = async (file: File): Promise<File> => {
  if (file.size <= TARGET_BYTES || file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let blob: Blob | null = null;
  for (const quality of [0.85, 0.75, 0.65, 0.5]) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= TARGET_BYTES) break;
  }
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
};
