import type { Metadata } from "next";
import { getDb } from "@/lib/db";

// The page itself is a client component, so its per-product title and
// description are generated here.
export async function generateMetadata({ params }: LayoutProps<"/product/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!Number.isInteger(Number(id))) return { title: "Product" };

  try {
    const doc = await getDb().collection("products").doc(id).get();
    const p = doc.data();
    if (!p?.is_active) return { title: "Product not found" };
    return {
      title: p.name,
      description: p.description ?? undefined,
      openGraph: { title: p.name, images: p.image ? [p.image] : undefined },
    };
  } catch {
    return { title: "Product" };
  }
}

export default function Layout({ children }: LayoutProps<"/product/[id]">) {
  return children;
}
