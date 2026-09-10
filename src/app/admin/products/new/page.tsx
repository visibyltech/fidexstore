"use client";

import ProductForm, { ProductFormValues } from "../ProductForm";

export default function NewProductPage() {
  const handleSubmit = async (values: ProductFormValues) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        categoryId: Number(values.categoryId),
        price: Number(values.price),
        oldPrice: values.oldPrice ? Number(values.oldPrice) : null,
        description: values.description || null,
        image: values.image || null,
        stock: Number(values.stock),
      }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Failed to create product" };
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">New Product</h2>
      <div className="mt-6">
        <ProductForm submitLabel="Create Product" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
