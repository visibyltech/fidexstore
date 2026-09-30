"use client";

import { FormEvent, useEffect, useState } from "react";
import ProductImage from "../../components/ProductImage";
import { Trash2 } from "lucide-react";

type Category = { id: number; name: string; slug: string; image: string | null; parent_id: number | null };

const emptyForm = { name: "", slug: "", image: "", parentId: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Category>>({});
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState(emptyForm);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const applyCategories = (list: Category[]) => {
    setCategories(list);
    setDrafts(Object.fromEntries(list.map((c) => [c.id, c])));
  };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => applyCategories(data.categories ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => applyCategories(data.categories ?? []))
      .finally(() => setLoading(false));
  }, []);

  const updateDraft = (id: number, field: keyof Category, value: string | number | null) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const parentOptions = categories.filter((c) => c.parent_id === null);
  const topLevel = categories.filter((c) => c.parent_id === null);
  const childrenOf = (parentId: number) => categories.filter((c) => c.parent_id === parentId);
  const orphaned = categories.filter(
    (c) => c.parent_id !== null && !categories.some((p) => p.id === c.parent_id)
  );

  const handleSave = async (id: number) => {
    setError("");
    setSavingId(id);
    const draft = drafts[id];
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draft.name,
        slug: draft.slug,
        image: draft.image || null,
        parent_id: draft.parent_id,
      }),
    });
    const data = await res.json();
    setSavingId(null);
    if (!res.ok) {
      setError(data.error ?? "Failed to save category");
      return;
    }
    load();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? Categories that still have products or subcategories can't be deleted.`))
      return;
    setError("");
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to delete category");
      return;
    }
    load();
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCategory.name,
        slug: newCategory.slug || undefined,
        image: newCategory.image || null,
        parent_id: newCategory.parentId ? Number(newCategory.parentId) : null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to create category");
      return;
    }
    setNewCategory(emptyForm);
    load();
  };

  const CategoryRow = ({ category, indent }: { category: Category; indent: boolean }) => {
    const draft = drafts[category.id] ?? category;
    return (
      <div
        className={`flex flex-wrap items-center gap-3 bg-cream p-4 ${indent ? "ml-8" : ""}`}
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-ink/10">
          <ProductImage src={draft.image} alt={draft.name} fill className="object-cover" />
        </div>
        <input
          value={draft.name}
          onChange={(e) => updateDraft(category.id, "name", e.target.value)}
          className="min-w-40 flex-1 border border-ink/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
        <input
          value={draft.slug}
          onChange={(e) => updateDraft(category.id, "slug", e.target.value)}
          className="min-w-32 flex-1 border border-ink/20 bg-white px-3 py-2 text-sm text-ink/60 focus:border-gold focus:outline-none"
        />
        <input
          value={draft.image ?? ""}
          onChange={(e) => updateDraft(category.id, "image", e.target.value)}
          placeholder="Image URL"
          className="min-w-40 flex-1 border border-ink/20 bg-white px-3 py-2 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
        />
        <select
          value={draft.parent_id ?? ""}
          onChange={(e) =>
            updateDraft(category.id, "parent_id", e.target.value ? Number(e.target.value) : null)
          }
          className="border border-ink/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
        >
          <option value="">Top-level</option>
          {parentOptions
            .filter((p) => p.id !== category.id)
            .map((p) => (
              <option key={p.id} value={p.id}>
                Under {p.name}
              </option>
            ))}
        </select>
        <button
          onClick={() => handleSave(category.id)}
          disabled={savingId === category.id}
          className="bg-gold px-4 py-2 text-xs font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {savingId === category.id ? "Saving…" : "Save"}
        </button>
        <button onClick={() => handleDelete(category.id, category.name)} className="text-ink/50 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div>
      <h2 className="display-type text-3xl">Categories ({categories.length})</h2>
      <p className="mt-1 text-sm text-ink/50">
        Categories can be nested one level deep. Fidex currently uses four top-level categories
        (Clothing, Accessories, Grooming and Essentials), and you can add subcategories under any
        of them.
      </p>

      {error && (
        <p className="mt-4 bg-red-500/10 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <form
        onSubmit={handleCreate}
        className="mt-6 flex flex-wrap items-end gap-3 bg-cream p-4"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink/80">Name</label>
          <input id="name"
            required
            value={newCategory.name}
            onChange={(e) => setNewCategory((v) => ({ ...v, name: e.target.value }))}
            className="mt-2 border border-ink/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="slug-optional" className="text-sm font-medium text-ink/80">Slug (optional)</label>
          <input id="slug-optional"
            value={newCategory.slug}
            onChange={(e) => setNewCategory((v) => ({ ...v, slug: e.target.value }))}
            placeholder="auto from name"
            className="mt-2 border border-ink/20 bg-white px-3 py-2 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="image-url" className="text-sm font-medium text-ink/80">Image URL</label>
          <input id="image-url"
            value={newCategory.image}
            onChange={(e) => setNewCategory((v) => ({ ...v, image: e.target.value }))}
            placeholder="https://images.example.com/category.jpg"
            className="mt-2 border border-ink/20 bg-white px-3 py-2 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="parent-category" className="text-sm font-medium text-ink/80">Parent Category</label>
          <select id="parent-category"
            value={newCategory.parentId}
            onChange={(e) => setNewCategory((v) => ({ ...v, parentId: e.target.value }))}
            className="mt-2 border border-ink/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          >
            <option value="">None (top-level)</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-gold px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
        >
          + Add Category
        </button>
      </form>

      {loading ? (
        <p className="mt-8 text-sm text-ink/50">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {topLevel.map((parent) => (
            <div key={parent.id} className="space-y-3">
              <CategoryRow category={parent} indent={false} />
              {childrenOf(parent.id).map((child) => (
                <CategoryRow key={child.id} category={child} indent />
              ))}
            </div>
          ))}
          {orphaned.map((category) => (
            <CategoryRow key={category.id} category={category} indent={false} />
          ))}
        </div>
      )}
    </div>
  );
}
