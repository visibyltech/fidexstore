import ProductImage from "../ProductImage";
import { useCart } from "../../context/CartContext";
import { DELIVERY_FEE } from "@/lib/pricing";

export { DELIVERY_FEE };

const OrderSummary = () => {
  const { items, subtotal } = useCart();
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  return (
    <div className="h-fit w-full bg-cream p-6">
      <h2 className="text-lg font-semibold">Order summary</h2>

      <div className="mt-4 flex flex-col gap-4 border-b border-ink/10 pb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-white">
              <ProductImage src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-ink/50">Qty: {item.qty}</p>
            </div>
            <p className="text-sm font-semibold text-gold">
              ₦{(item.price * item.qty).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-ink/60">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-ink/60">
          <span>Delivery</span>
          <span>{items.length > 0 ? `₦${DELIVERY_FEE.toLocaleString()}` : "₦0"}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 text-base font-semibold">
        <span>Total</span>
        <span className="text-gold">₦{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
