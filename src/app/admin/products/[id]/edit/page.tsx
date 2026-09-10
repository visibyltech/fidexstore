"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm, { ProductFormValues } from "../../ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<Partial<ProductFormValues> | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.product) {
          setNotFound(true);
          return;
        }
        const p = data.product;
        setInitialValues({
          name: p.name,
          categoryId: String(p.category_id),
          price: String(p.price),
          oldPrice: p.old_price != null ? String(p.old_price) : "",
          description: p.description ?? "",
          image: p.image ?? "",
          stock: String(p.stock),
          isActive: p.is_active,
        });
      });
  }, [params.id]);

  const handleSubmit = async (values: ProductFormValues) => {
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        categoryId: Number(values.categoryId),
        price: Number(values.price),
        oldPrice: values.oldPrice ? Number(values.oldPrice) : null,
        description: values.description || null,
        image: values.image || null,
        stock: Number(values.stock),
        isActive: values.isActive,
      }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Failed to update product" };
  };

  if (notFound) {
    return <p className="text-sm text-white/50">Product not found.</p>;
  }

  if (!initialValues) {
    return <p className="text-sm text-white/50">Loading…</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Edit Product</h2>
      <div className="mt-6">
        <ProductForm initialValues={initialValues} submitLabel="Save Changes" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
