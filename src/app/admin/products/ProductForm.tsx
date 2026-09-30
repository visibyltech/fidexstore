"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, UploadCloud, X } from "lucide-react";
import { groupCategories } from "@/lib/categories";
import type { ApiCategory } from "@/types/api";
import { compressImage } from "@/lib/compress-image";

// Mirrors MAX_PRODUCT_IMAGES in src/lib/product-images.ts (server-only module).
const MAX_IMAGES = 8;

export type ProductFormValues = {
  name: string;
  categoryId: string;
  price: string;
  oldPrice: string;
  description: string;
  images: string[];
  stock: string;
  isActive: boolean;
};

const emptyValues: ProductFormValues = {
  name: "",
  categoryId: "",
  price: "",
  oldPrice: "",
  description: "",
  images: [],
  stock: "0",
  isActive: true,
};

// A gallery entry is either an already-saved/external URL or a new file
// picked from the admin's device (previewed via an object URL).
export type GalleryItem = { key: string; preview: string; url?: string; file?: File };

// Writes the gallery into the shape saveProductImages() expects on the server.
export const appendGallery = (formData: FormData, gallery: GalleryItem[]) => {
  let fileIndex = 0;
  const slots = gallery.map((item) => {
    if (!item.file) return { url: item.url };
    formData.append("imageFiles", item.file);
    return { file: fileIndex++ };
  });
  formData.set("images", JSON.stringify(slots));
};

type ProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  submitLabel: string;
  onSubmit: (
    values: ProductFormValues,
    gallery: GalleryItem[]
  ) => Promise<{ error?: string } | void>;
};

const ProductForm = ({ initialValues, submitLabel, onSubmit }: ProductFormProps) => {
  const router = useRouter();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [values, setValues] = useState<ProductFormValues>({ ...emptyValues, ...initialValues });
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    (initialValues?.images ?? []).map((url, i) => ({ key: `${i}-${url}`, preview: url, url }))
  );
  const [imageUrl, setImageUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  const set = (key: keyof ProductFormValues, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const roomLeft = MAX_IMAGES - gallery.length;

  const handleFilesChange = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).slice(0, roomLeft);
    if (files.length === 0) return;
    setError("");
    setProcessing(true);
    try {
      const compressed = await Promise.all(files.map(compressImage));
      setGallery((prev) => [
        ...prev,
        ...compressed.map((file) => ({
          key: crypto.randomUUID(),
          preview: URL.createObjectURL(file),
          file,
        })),
      ]);
    } catch {
      setError("Couldn't read one of the selected images. Try a JPG or PNG.");
    } finally {
      setProcessing(false);
    }
  };

  const handleAddUrl = () => {
    const url = imageUrl.trim();
    if (!url || roomLeft <= 0) return;
    setGallery((prev) => [...prev, { key: crypto.randomUUID(), preview: url, url }]);
    setImageUrl("");
  };

  const removeImage = (key: string) =>
    setGallery((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item?.file) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.key !== key);
    });

  const makeCover = (key: string) =>
    setGallery((prev) => [
      ...prev.filter((i) => i.key === key),
      ...prev.filter((i) => i.key !== key),
    ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await onSubmit(values, gallery);
    setSubmitting(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/admin/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl bg-cream p-6">
      {error && (
        <p className="mb-4 bg-red-500/10 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink/80">Name</label>
          <input id="name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="category" className="text-sm font-medium text-ink/80">Category</label>
          <select id="category"
            required
            value={values.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
          >
            <option value="" disabled className="bg-white">
              Select a category
            </option>
            {groupCategories(categories).map(({ parent, children }) =>
              children.length > 0 ? (
                <optgroup key={parent.slug} label={parent.name}>
                  {children.map((category) => (
                    <option key={category.id} value={category.id} className="bg-white">
                      {category.name}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option key={parent.slug} value={parent.id} className="bg-white">
                  {parent.name}
                </option>
              )
            )}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="text-sm font-medium text-ink/80">Price (₦)</label>
            <input id="price"
              required
              type="number"
              min={0}
              value={values.price}
              onChange={(e) => set("price", e.target.value)}
              className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="old-price" className="text-sm font-medium text-ink/80">Old Price (₦)</label>
            <input id="old-price"
              type="number"
              min={0}
              value={values.oldPrice}
              onChange={(e) => set("oldPrice", e.target.value)}
              placeholder="Optional"
              className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink/80">
            Product images ({gallery.length}/{MAX_IMAGES})
          </p>
          <p className="mt-1 text-xs text-ink/40">
            The first image is the cover shown in the shop. Click the star on any image to make it the cover.
          </p>

          {gallery.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((item, i) => (
                <div
                  key={item.key}
                  className={`relative aspect-square overflow-hidden bg-ink/10 ${
                    i === 0 ? "ring-2 ring-gold" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.preview} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
                  {i === 0 ? (
                    <span className="absolute bottom-1 left-1 bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeCover(item.key)}
                      aria-label="Make cover image"
                      title="Make cover image"
                      className="absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/60 text-white transition hover:bg-gold hover:text-ink"
                    >
                      <Star className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(item.key)}
                    aria-label="Remove image"
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/60 text-white transition hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {roomLeft > 0 && (
            <>
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-ink/20 py-6 text-sm text-ink/50 transition hover:border-gold hover:text-gold">
                <UploadCloud className="h-5 w-5" />
                {processing ? "Preparing images…" : "Click to upload images (you can select several)"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={processing}
                  className="hidden"
                  onChange={(e) => {
                    handleFilesChange(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>

              <label htmlFor="image-url" className="mt-3 block text-sm font-medium text-ink/80">
                Or add an image URL
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  placeholder="https://images.example.com/product.jpg"
                  className="w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="shrink-0 border border-ink/10 px-4 text-sm font-semibold transition hover:border-gold hover:text-gold"
                >
                  Add
                </button>
              </div>
            </>
          )}
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-ink/80">Description</label>
          <textarea id="description"
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock" className="text-sm font-medium text-ink/80">Stock</label>
            <input id="stock"
              required
              type="number"
              min={0}
              value={values.stock}
              onChange={(e) => set("stock", e.target.value)}
              className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="accent-gold"
              />
              Active (visible in shop)
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || processing}
        className="mt-6 w-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;
