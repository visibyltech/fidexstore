// Cart and wishlist items live in localStorage, so they can outlive the
// product they point to: a rebrand that deleted old photos, a price change,
// or a product that was removed. These helpers refresh saved items from the
// live catalogue.

type LiveProduct = { name: string; image: string; price: number };

// Maps each id to its current details, or to null when the product no longer
// exists. Ids whose lookup failed for another reason (e.g. offline) are left
// out, so callers keep those items untouched.
export async function fetchLiveProducts(ids: number[]): Promise<Map<number, LiveProduct | null>> {
  const results = new Map<number, LiveProduct | null>();
  await Promise.all(
    [...new Set(ids)].map(async (id) => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.status === 404 || res.status === 400) {
          results.set(id, null);
          return;
        }
        if (!res.ok) return;
        const { product } = await res.json();
        results.set(id, { name: product.name, image: product.image ?? "", price: product.price });
      } catch {
        // Network error: keep the saved item as it is.
      }
    })
  );
  return results;
}

export function applyLiveProducts<T extends { id: number }>(
  items: T[],
  live: Map<number, LiveProduct | null>
): T[] {
  return items.flatMap((item) => {
    if (!live.has(item.id)) return [item];
    const current = live.get(item.id);
    return current ? [{ ...item, ...current }] : [];
  });
}
